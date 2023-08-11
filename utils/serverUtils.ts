import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Problem } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ResTypes } from "@/constants/response";

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
    withAuth,
    querySchema,
    paramsSchema,
    bodySchema,
  }: {
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
  async (req: T, _params?: Record<string, string>, ...args: A) => {
    let props: any = {};
    if (withAuth) {
      const user = await getServerUser();
      if (!user) {
        return ResTypes.NOT_AUTHORIZED;
      }
      props.user = user;
    }
    if (paramsSchema) {
      const params = paramsSchema.safeParse(_params);
      if (!params.success) {
        return ResTypes.BAD_REQUEST(params.error.message);
      }
      props.params = params.data;
    }
    if (querySchema) {
      const { searchParams } = new URL(req.url);
      const query = querySchema.safeParse(Object.fromEntries(searchParams));
      if (!query.success) {
        return ResTypes.BAD_REQUEST(query.error.message);
      }
      props.query = query.data;
    }
    if (bodySchema) {
      const body = bodySchema.safeParse(await req.json());
      if (!body.success) {
        return ResTypes.BAD_REQUEST(body.error.message);
      }
      props.body = body.data;
    }
    return handler(req, props, ...args);
  };
