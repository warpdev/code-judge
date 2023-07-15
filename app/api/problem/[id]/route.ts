import { NextRequest, NextResponse } from "next/server";
import { getProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";
import { getIsMyProblem, getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import supabase from "@/lib/supabase";
import { revalidateProblems } from "@/utils/revalidateUtils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const problemInfo = await getProblemInfo(params.id);
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  return NextResponse.json(problemInfo);
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const problemInfo = await getProblemInfo(params.id);
  const user = await getServerUser();
  const isMine = getIsMyProblem(problemInfo, user);
  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.delete({
    where: {
      id: +params.id,
    },
  });

  const { data, error } = await supabase.storage
    .from("testcase")
    .remove([`${params.id}/`]);
  if (error) {
    await prisma.problem.create({
      data: problem as any,
    });
    return ResTypes.OTHER_ERROR;
  }

  revalidateProblems();
  return NextResponse.json(problem);
};
