import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { postSubmission } from "@/utils/judgeServerUtils";
import { getProblemInfo } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();

  const { code, langId } = body;

  const problemInfo = await getProblemInfo(params.id);
  const userInfo = await getServerUser();
  if (!userInfo) return NextResponse.error();

  const submitToken = await postSubmission({
    langId,
    code,
    input: problemInfo.sampleInput,
    output: problemInfo.sampleOutput,
  });

  const sub = await prisma.submission.create({
    data: {
      problemId: params.id,
      userId: userInfo.id,
      submissionToken: submitToken,
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(sub);
};
