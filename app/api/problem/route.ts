import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { getPublicProblems } from "@/utils/dbUtils";
import { LOCALE_MAP, LOCALES } from "@/constants/common";
import supabase from "@/lib/supabase";
import { revalidateProblems } from "@/utils/revalidateUtils";
import { z } from "zod";

const BaseDocSchema = z
  .object({
    type: z.optional(z.string()),
    attrs: z.optional(z.record(z.any())),
    marks: z.optional(
      z.array(
        z
          .object({
            type: z.string(),
            attrs: z.optional(z.record(z.any())),
          })
          .catchall(z.any()),
      ),
    ),
    text: z.optional(z.string()),
  })
  .catchall(z.any());

type DocContent = z.infer<typeof BaseDocSchema> & {
  content?: DocContent[];
};

const DocSchema: z.ZodType<DocContent> = BaseDocSchema.extend({
  content: z.lazy(() => z.optional(DocSchema.array())),
});

const ProblemSchema = z.object({
  title: z.string().min(1).max(100),
  description: DocSchema,
  inputFormat: DocSchema,
  outputFormat: DocSchema,
  sampleInput: z.string(),
  sampleOutput: z.string(),
  memoryLimit: z.coerce.number(),
  timeLimit: z.coerce.number().transform((v) => v * 1000),
  locale: z.enum(LOCALES),
});

export const POST = async (req: NextRequest) => {
  const _body = await req.json();
  const result = ProblemSchema.safeParse(_body);
  if (!result.success) {
    return ResTypes.BAD_REQUEST(result.error.message);
  }
  const body = result.data;
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
  return NextResponse.json(problem);
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "all";
  const page = parseInt(searchParams.get("page") || "1");

  const [problems] = await getPublicProblems({
    locale: locale,
    pageIndex: page,
  });

  return NextResponse.json(problems);
};
