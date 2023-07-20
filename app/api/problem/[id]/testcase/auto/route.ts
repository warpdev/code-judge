import { NextRequest, NextResponse } from "next/server";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { ResTypes } from "@/constants/response";
import { z } from "zod";
import { getProblemInfo } from "@/utils/dbUtils";
import supabase from "@/lib/supabase";
import { getServerUser } from "@/utils/serverUtils";
import { runCode } from "@/utils/judgeServerUtils";

const AutoTestcaseSchema = z.object({
  input: z.string(),
});

export const POST = async (
  req: NextRequest,
  { params: _params }: { params: { id: string } },
) => {
  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const params = ProblemParamsSchema.safeParse(_params);
  const body = AutoTestcaseSchema.safeParse(await req.json());
  if (!params.success) {
    return ResTypes.BAD_REQUEST(params.error.message);
  }
  if (!body.success) {
    return ResTypes.BAD_REQUEST(body.error.message);
  }
  const { id } = params.data;
  const { input } = body.data;

  const problemInfo = await getProblemInfo<{
    include: {
      submission: true;
    };
  }>(id, {
    include: {
      submission: true,
    },
  });

  if (!problemInfo) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  const answerSubmission = problemInfo.submission.find(
    (submission) => submission.id === problemInfo.answerId,
  );

  if (!answerSubmission) {
    return ResTypes.NOT_FOUND("Answer not found");
  }

  const { data: _code, error: codeError } = await supabase.storage
    .from("usercodes")
    .download(`${user.id}/${problemInfo.id}/${problemInfo.answerId}`);
  if (codeError) {
    return ResTypes.OTHER_ERROR;
  }

  const code = await _code?.text();
  const output = await runCode({
    langId: answerSubmission.languageId,
    code,
    input,
  });

  return NextResponse.json({
    output,
  });
};
