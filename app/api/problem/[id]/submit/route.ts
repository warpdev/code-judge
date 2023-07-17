import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { postBatchSubmission } from "@/utils/judgeServerUtils";
import { getProblemInfo } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import supabase from "@/lib/supabase";
import { revalidateSubmissions } from "@/utils/revalidateUtils";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";

const SubmissionBodySchema = z.object({
  code: z.string(),
  langId: z.number(),
});

export const POST = async (
  req: NextRequest,
  { params: _params }: { params: { id: string } },
) => {
  const _body = await req.json();
  const body = SubmissionBodySchema.safeParse(_body);
  const params = ProblemParamsSchema.safeParse(_params);
  if (!params.success) {
    return ResTypes.BAD_REQUEST(params.error.message);
  }
  if (!body.success) {
    return ResTypes.BAD_REQUEST(body.error.message);
  }

  const { id: problemId } = params.data;
  const { code, langId } = body.data;

  const problemInfo = await getProblemInfo(problemId);
  const userInfo = await getServerUser();
  if (!userInfo) {
    return ResTypes.NOT_AUTHORIZED;
  }
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  const sub = await prisma.submission.create({
    data: {
      problemId: problemId,
      userId: userInfo.id,
      languageId: langId,
    },
  });

  const { data: codeUploadResult } = await supabase.storage
    .from("usercodes")
    .upload(`${userInfo.id}/${problemId}/${sub.id}`, code);

  setTimeout(async () => {
    const allTestSets = await Promise.all(
      Array.from({ length: problemInfo.testSetSize }).map(async (_, i) => {
        return {
          input: await supabase.storage
            .from("testcase")
            .download(`${problemId}/${i}.in`)
            .then((res) => {
              if (!res.data) throw new Error("Testcase not found");
              return res.data?.text();
            }),
          output: await supabase.storage
            .from("testcase")
            .download(`${problemId}/${i}.out`)
            .then((res) => {
              if (!res.data) throw new Error("Testcase not found");
              return res.data?.text();
            }),
        };
      }),
    );

    const submitTokens = await postBatchSubmission({
      langId,
      code,
      testSets: allTestSets,
      timeLimit: problemInfo.timeLimit,
      memoryLimit: problemInfo.memoryLimit,
    });

    await prisma.judgeToken.createMany({
      data: submitTokens.map((token) => ({
        submissionId: sub.id,
        id: token,
      })),
    });
  }, 0);

  if (!codeUploadResult) {
    return ResTypes.OTHER_ERROR;
  }
  revalidateSubmissions();
  return NextResponse.json(sub);
};
