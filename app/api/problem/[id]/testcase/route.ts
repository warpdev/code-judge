import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";
import { getIsMyProblem, getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }
  const body = await req.json();

  const {
    idx,
    input,
    output,
  }: { input: string; output: string; idx?: number } = body;
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
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problemInfo = await getProblemInfo(params.id);
  const isMine = getIsMyProblem(problemInfo, user);
  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const { searchParams } = new URL(req.url);
  const { id: problemId } = params;
  const idx = parseInt(searchParams.get("idx") ?? "");
  if (isNaN(idx)) {
    return NextResponse.json(
      {
        error: "Invalid index",
      },
      {
        status: 400,
      },
    );
  }

  const { data: input, error: inputError } = await supabase.storage
    .from("testcase")
    .download(`${problemId}/${idx}.in`);
  const { data: output, error: outputError } = await supabase.storage
    .from("testcase")
    .download(`${problemId}/${idx}.out`);

  if (inputError || outputError) {
    return NextResponse.error();
  }

  return NextResponse.json({
    input: await input?.text(),
    output: await output?.text(),
  });
};
