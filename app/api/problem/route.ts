import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { getPublicProblems } from "@/utils/dbUtils";
import { LOCALE_MAP } from "@/constants/common";
import { ILocale } from "@/types/common";
import supabase from "@/lib/supabase";
import { revalidateProblems } from "@/utils/revalidateUtils";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.create({
    data: {
      description: body.description,
      title: body.title,
      inputFormat: body.inputFormat,
      outputFormat: body.outputFormat,
      sampleInput: body.sampleInput,
      sampleOutput: body.sampleOutput,
      isPublic: false,
      memoryLimit: parseInt(body.memoryLimit),
      timeLimit: parseInt(body.timeLimit),
      locale: LOCALE_MAP[body.locale as ILocale].id,
      createdBy: user!.id,
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
  return NextResponse.json(problem);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "all";
  const page = parseInt(searchParams.get("page") || "0");

  const [problems] = await getPublicProblems({
    locale: locale,
    pageIndex: page,
  });

  return NextResponse.json(problems);
};
