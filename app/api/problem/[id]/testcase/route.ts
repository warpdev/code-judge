import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";
import { getIsMyProblem, wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";

const PostTestcaseSchema = z.object({
  input: z.string(),
  output: z.string(),
  idx: z.number().optional(),
});

export const POST = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
  bodySchema: PostTestcaseSchema,
})(async (req: NextRequest, { user, params, body }) => {
  const { idx, input, output } = body;
  const { id: problemId } = params;

  const isEdit = idx !== undefined;

  const problemInfo = await getProblemInfo(problemId);
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }
  const isMine = getIsMyProblem(problemInfo, user);
  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }
  if ((idx ?? 0) > problemInfo.testSetSize) {
    return ResTypes.NOT_FOUND("Testcase not found");
  }
  const testSetNumber = idx ?? problemInfo.testSetSize;

  //TODO: optimize performance with signed url

  try {
    const { data: inputResult, error: inputError } = await supabase.storage
      .from("testcase")
      .upload(`${problemInfo.id}/${testSetNumber}.in`, input, {
        upsert: isEdit,
      });
    const { data: outputResult, error: outputError } = await supabase.storage
      .from("testcase")
      .upload(`${problemInfo.id}/${testSetNumber}.out`, output, {
        upsert: isEdit,
      });
    if (inputError || outputError) {
      return ResTypes.OTHER_ERROR;
    }
    if (!idx) {
      await prisma.problem.update({
        where: {
          id: problemInfo.id,
        },
        data: {
          testSetSize: testSetNumber + 1,
        },
      });
    }
    return NextResponse.json({
      input: inputResult,
      output: outputResult,
    });
  } catch (error) {
    return ResTypes.OTHER_ERROR;
  }
});

const GetTestcaseQuerySchema = z.object({
  idx: z.coerce.number(),
});

export const GET = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
  querySchema: GetTestcaseQuerySchema,
})(async (req: NextRequest, { user, params, query }) => {
  const { id: problemId } = params;

  const problemInfo = await getProblemInfo(problemId);
  const isMine = getIsMyProblem(problemInfo, user);
  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const { idx } = query;

  const { data: input, error: inputError } = await supabase.storage
    .from("testcase")
    .download(`${problemId}/${idx}.in`);
  const { data: output, error: outputError } = await supabase.storage
    .from("testcase")
    .download(`${problemId}/${idx}.out`);

  if (inputError || outputError) {
    return NextResponse.error();
  }

  return ResTypes.OK({
    input: await input?.text(),
    output: await output?.text(),
  });
});
