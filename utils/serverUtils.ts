import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Problem } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ResTypes } from "@/constants/response";
import { redirect } from "next/navigation";

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const getIsAdmin = async (_user?: Session["user"]) => {
  const user = _user ?? (await getServerUser());
  return user?.role === "admin";
};

export const getIsMyProblem = (
  problem: Problem | null,
  user?: Session["user"],
): problem is Problem => {
  return !!problem && problem.createdBy === user?.id;
};

export const isNullProblem = (problem?: Problem): problem is Problem => {
  return !problem;
};

const verifyNextAuthCsrfToken = async (
  req: NextRequest,
  tokenToCheck: string,
) => {
  const secret: string = process.env.NEXTAUTH_SECRET || "";
  const csrfMethods = ["POST", "PUT", "PATCH", "DELETE", "GET"];

  if (!csrfMethods.includes(req.method || "")) {
    // we dont need to check the CSRF if it's not within the method.
    return true;
  }

  try {
    const useSecureCookies =
      process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
    const csrfProp = `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`;
    const cookieValue = req.cookies.get(csrfProp)?.value;

    if (cookieValue) {
      const cookieSplitKey = cookieValue.match("|") ? "|" : "%7C";

      const [csrfTokenValue, csrfTokenHash] = cookieValue.split(cookieSplitKey);

      if (csrfTokenValue === tokenToCheck) {
        const hashArray = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              Buffer.from(tokenToCheck + secret),
            ),
          ),
        );
        const generatedHash = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        if (csrfTokenHash === generatedHash) return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const wrapApi =
  <
    T extends NextRequest,
    A extends any[],
    R,
    S,
    Q,
    P,
    BD extends z.ZodType<S>,
    QD extends z.ZodType<Q>,
    PD extends z.ZodType<P>,
    WA extends true | false = false,
  >({
    withCsrf,
    withAuth,
    querySchema,
    paramsSchema,
    bodySchema,
  }: {
    withCsrf?: boolean;
    withAuth?: WA;
    querySchema?: QD;
    paramsSchema?: PD;
    bodySchema?: BD;
  }) =>
  (
    handler: (
      req: T,
      props: {
        user: WA extends true ? NonNullable<Session["user"]> : undefined;
        body: BD extends z.ZodType<infer S> ? z.infer<BD> : undefined;
        query: QD extends z.ZodType<infer Q> ? z.infer<QD> : undefined;
        params: PD extends z.ZodType<infer P> ? z.infer<PD> : undefined;
      },
      ...args: A
    ) => R,
  ) =>
  async (
    req: T,
    _params?: {
      params: Record<string, string>;
    },
    ...args: A
  ) => {
    let props: any = {};
    if (withCsrf) {
      const isValid = await verifyNextAuthCsrfToken(
        req,
        req.headers.get("x-csrf-token") || "",
      );
      if (!isValid) {
        return ResTypes.FORBIDDEN;
      }
    }
    if (withAuth) {
      const user = await getServerUser();
      if (!user) {
        return ResTypes.NOT_AUTHORIZED;
      }
      props.user = user;
    }
    if (paramsSchema) {
      const params = paramsSchema.safeParse(_params?.params);
      if (!params.success) {
        return ResTypes.BAD_REQUEST(params.error);
      }
      props.params = params.data;
    }
    if (querySchema) {
      const { searchParams } = req.nextUrl;
      const query = querySchema.safeParse(Object.fromEntries(searchParams));
      if (!query.success) {
        return ResTypes.BAD_REQUEST(query.error);
      }
      props.query = query.data;
    }
    if (bodySchema) {
      const body = bodySchema.safeParse(await req.json());
      if (!body.success) {
        return ResTypes.BAD_REQUEST(body.error);
      }
      props.body = body.data;
    }
    return handler(req, props, ...args);
  };

export const pageWithOptions =
  <
    A extends any[],
    R,
    Q,
    P,
    QD extends z.ZodType<Q>,
    PD extends z.ZodType<P>,
    WA extends true | false = false,
  >({
    withAuth,
    paramsSchema,
    querySchema,
    //TODO: change to error page
    errorUrl = "/",
  }: {
    withAuth?: WA;
    querySchema?: QD;
    paramsSchema?: PD;
    errorUrl?: string;
  }) =>
  (
    handler: (
      props: {
        user: WA extends true ? NonNullable<Session["user"]> : undefined;
        query: QD extends z.ZodType<infer Q> ? z.infer<QD> : undefined;
        params: PD extends z.ZodType<infer P> ? z.infer<PD> : undefined;
        locale: string;
      },
      ...args: A
    ) => R,
  ) =>
  async (
    _props: {
      params: Record<string, string>;
      searchParams: Record<string, string>;
    },
    ...args: A
  ) => {
    let props: any = {};
    if (withAuth) {
      const user = await getServerUser();
      if (!user) {
        return redirect("/api/auth/signin");
      }
      props.user = user;
    }
    if (querySchema) {
      const query = querySchema.safeParse(_props.searchParams);
      if (!query.success) {
        return redirect(errorUrl);
      }
      props.query = query.data;
    }
    if (paramsSchema) {
      const params = paramsSchema.safeParse(_props.params);
      if (!params.success) {
        return redirect(errorUrl);
      }
      props.params = params.data;
    }
    props.locale = _props.params.locale;

    return handler(props, ...args);
  };
