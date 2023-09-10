import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { postBatchSubmission } from "@/utils/judgeServerUtils";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import { wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import supabase from "@/lib/supabase";
import { revalidateSubmissions } from "@/utils/revalidateUtils";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";

const SubmissionBodySchema = z.object({
  code: z.string(),
  langId: z.number(),
});

export const POST = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
  bodySchema: SubmissionBodySchema,
})(async (req: NextRequest, { params, user, body }) => {
  const { id: problemId } = params;
  const { code, langId } = body;

  const problemInfo = await serverGetProblemInfo(problemId);
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  const sub = await prisma.submission.create({
    data: {
      problemId: problemId,
      userId: user.id,
      languageId: langId,
    },
  });

  const { data: codeUploadResult } = await supabase.storage
    .from("usercodes")
    .upload(`${user.id}/${problemId}/${sub.id}`, code);

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
  return ResTypes.OK(sub);
});
