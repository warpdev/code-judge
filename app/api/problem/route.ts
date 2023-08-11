import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { LOCALE_MAP } from "@/constants/common";
import supabase from "@/lib/supabase";
import { revalidateProblems } from "@/utils/revalidateUtils";
import { ProblemSchema } from "@/types/schema";
import { getPublicProblems } from "@/utils/dbUtils";
import { z } from "zod";

export const POST = wrapApi({
  withAuth: true,
  bodySchema: ProblemSchema,
})(async (req: NextRequest, { user, body }) => {
  const problem = await prisma.problem.create({
    data: {
      description: body.description,
      title: body.title,
      inputFormat: body.inputFormat,
      outputFormat: body.outputFormat,
      sampleInput: body.sampleInput,
      sampleOutput: body.sampleOutput,
      isPublic: false,
      memoryLimit: body.memoryLimit,
      timeLimit: body.timeLimit,
      locale: LOCALE_MAP[body.locale].id,
      createdBy: user.id,
      testSetSize: 1,
    },
    select: {
      id: true,
    },
  });

  const { data: inputResult, error: inputError } = await supabase.storage
    .from("testcase")
    .upload(`${problem.id}/0.in`, body.sampleInput, {
      upsert: true,
    });
  const { data: outputResult, error: outputError } = await supabase.storage
    .from("testcase")
    .upload(`${problem.id}/0.out`, body.sampleOutput, {
      upsert: true,
    });

  if (inputError || outputError) {
    await prisma.problem.delete({
      where: {
        id: problem.id,
      },
    });
    return ResTypes.OTHER_ERROR;
  }
  revalidateProblems();
  return ResTypes.CREATED(problem);
});

const GetProblemsSchema = z.object({
  locale: z.string().default("all"),
  page: z.coerce.number().default(1),
  search: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? decodeURIComponent(v) : v)),
});

export const GET = wrapApi({
  querySchema: GetProblemsSchema,
})(async (req: NextRequest, { query }) => {
  const { locale, page, search } = query;

  const [problems] = await getPublicProblems({
    locale: locale,
    pageIndex: page,
    search: search || undefined,
  });

  return ResTypes.OK(problems);
});
