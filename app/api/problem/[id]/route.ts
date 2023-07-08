import { NextRequest, NextResponse } from "next/server";
import { getProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";
import { getIsAdmin } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const problemInfo = await getProblemInfo(params.id);

  return NextResponse.json(problemInfo);
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.delete({
    where: {
      id: params.id,
    },
  });
  return NextResponse.json(problem);
};
