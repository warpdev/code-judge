import { NextRequest, NextResponse } from "next/server";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";
import { getIsMyProblem, getServerUser, wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import supabase from "@/lib/supabase";
import { revalidateProblems } from "@/utils/revalidateUtils";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { ProblemSchema } from "@/types/schema";
import { LOCALE_MAP } from "@/constants/common";

export const GET = wrapApi({
  paramsSchema: ProblemParamsSchema,
})(async (req: NextRequest, { params }) => {
  const problemInfo = await serverGetProblemInfo(params.id);
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  return ResTypes.OK(problemInfo);
});

export const POST = wrapApi({
  withAuth: true,
  bodySchema: ProblemSchema,
  paramsSchema: ProblemParamsSchema,
})(async (req, { user, body, params: { id } }) => {
  const result = await prisma.problem.update({
    where: {
      id,
      createdBy: user.id,
    },
    data: {
      description: body.description,
      title: body.title,
      inputFormat: body.inputFormat,
      outputFormat: body.outputFormat,
      sampleInput: body.sampleInput,
      sampleOutput: body.sampleOutput,
      memoryLimit: body.memoryLimit,
      timeLimit: body.timeLimit,
      locale: LOCALE_MAP[body.locale].id,
    },
    select: {
      id: true,
    },
  });
  revalidateProblems();

  const { data: inputResult, error: inputError } = await supabase.storage
    .from("testcase")
    .upload(`${id}/0.in`, body.sampleInput, {
      upsert: true,
    });
  const { data: outputResult, error: outputError } = await supabase.storage
    .from("testcase")
    .upload(`${id}/0.out`, body.sampleOutput, {
      upsert: true,
    });

  if (inputError || outputError) {
    await prisma.problem.delete({
      where: {
        id,
      },
    });
    return ResTypes.OTHER_ERROR;
  }

  return ResTypes.OK(result);
});

export const DELETE = async (
  req: NextRequest,
  { params: _params }: { params: { id: string } },
) => {
  const params = ProblemParamsSchema.safeParse(_params);
  if (!params.success) {
    return ResTypes.BAD_REQUEST(params.error.message);
  }
  const problemInfo = await serverGetProblemInfo(params.data.id);
  const user = await getServerUser();
  const isMine = getIsMyProblem(problemInfo, user);
  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.delete({
    where: {
      id: problemInfo.id,
    },
  });

  const { data, error } = await supabase.storage
    .from("testcase")
    .remove([`${problemInfo.id}/`]);
  if (error) {
    await prisma.problem.create({
      data: problem as any,
    });
    return ResTypes.OTHER_ERROR;
  }

  revalidateProblems();
  return NextResponse.json(problem);
};
