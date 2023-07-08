import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { postBatchSubmission } from "@/utils/judgeServerUtils";
import { getProblemInfo } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { writeFile } from "fs/promises";
import { existsSync, mkdir, mkdirSync } from "fs";
import supabase from "@/lib/supabase";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();

  const { code, langId } = body;

  const problemInfo = await getProblemInfo(params.id);
  const userInfo = await getServerUser();
  if (!userInfo) {
    return ResTypes.NOT_AUTHORIZED;
  }
  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem or user not found");
  }
  //TODO: migrate to own judge server
  // const { run_cmd, compile_cmd, source_file } = await fetchJudgeApi(
  //   `/languages/${langId}`,
  //   {}
  // );
  // const dirPath = `/tmp/${userInfo.id}/${problemInfo.id}`;
  // if (!existsSync(dirPath)) {
  //   mkdirSync(dirPath, { recursive: true });
  // }
  // await writeFile(`/tmp/${userInfo.id}/${problemInfo.id}/${source_file}`, code);

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
    })
  );

  const submitTokens = await postBatchSubmission({
    langId,
    code,
    testSets: allTestSets,
  });

  const sub = await prisma.submission.createMany({
    data: submitTokens.map((submitToken) => ({
      problemId: params.id,
      userId: userInfo.id,
      submissionToken: submitToken,
    })),
  });

  return NextResponse.json(sub);
};
