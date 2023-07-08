import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { getProblemInfo } from "@/utils/dbUtils";
import prisma from "@/lib/prisma";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();

  const { input, output }: { input: string; output: string } = body;
  const { id: problemId } = params;

  const { testSetSize } = await getProblemInfo(problemId);

  //TODO: optimize performance with signed url

  try {
    const { data: inputResult, error: inputError } = await supabase.storage
      .from("testcase")
      .upload(`${params.id}/${testSetSize}.in`, input);
    const { data: outputResult, error: outputError } = await supabase.storage
      .from("testcase")
      .upload(`${params.id}/${testSetSize}.out`, output);
    if (!inputError && !outputError) {
      await prisma.problem.update({
        where: {
          id: problemId,
        },
        data: {
          testSetSize: testSetSize + 1,
        },
      });
    }
    return NextResponse.json({
      input: inputResult,
      output: outputResult,
    });
  } catch (error) {
    return NextResponse.error();
  }
};
