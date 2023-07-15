import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIsAdmin, getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { getPublicProblems } from "@/utils/dbUtils";
import { LOCALE_MAP } from "@/constants/common";
import { ILocale } from "@/types/common";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  const user = await getServerUser();
  if (!(await getIsAdmin(user))) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.create({
    data: {
      ...body,
      memoryLimit: parseInt(body.memoryLimit),
      timeLimit: parseInt(body.timeLimit),
      locale: LOCALE_MAP[body.locale as ILocale].id,
      createdBy: user!.id,
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(problem);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "all";
  const page = parseInt(searchParams.get("page") || "0");

  const problems = await getPublicProblems({
    locale: locale,
    pageIndex: page,
  });

  return NextResponse.json(problems);
};
