import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchJudgeApi, postBatchSubmission } from "@/utils/judgeServerUtils";
import { getProblemInfo } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import supabase from "@/lib/supabase";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const body = await req.json();

  const { code, langId } = body;

  const problemInfo = await getProblemInfo(params.id);
  const userInfo = await getServerUser();
  if (!userInfo) {
    return ResTypes.NOT_AUTHORIZED;
  }
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  const sub = await prisma.submission.create({
    data: {
      problemId: +params.id,
      userId: userInfo.id,
      languageId: langId,
    },
  });

  const { data: codeUploadResult } = await supabase.storage
    .from("usercodes")
    .upload(`${userInfo.id}/${params.id}/${sub.id}`, code);

  setTimeout(async () => {
    const allTestSets = await Promise.all(
      Array.from({ length: problemInfo.testSetSize }).map(async (_, i) => {
        return {
          input: await supabase.storage
            .from("testcase")
            .download(`${params.id}/${i}.in`)
            .then((res) => {
              if (!res.data) throw new Error("Testcase not found");
              return res.data?.text();
            }),
          output: await supabase.storage
            .from("testcase")
            .download(`${params.id}/${i}.out`)
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
  return NextResponse.json(sub);
};
