import { NextRequest, NextResponse } from "next/server";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { ResTypes } from "@/constants/response";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import supabase from "@/lib/supabase";
import { wrapApi } from "@/utils/serverUtils";
import { runCode } from "@/utils/judgeServerUtils";
import { Prisma } from "@prisma/client";
import { openAiClient } from "@/lib/openAi";
import { PROMPTS } from "@/constants/prompts";
import { LOCALES } from "@/constants/common";
import { makeAutoInputPrompt } from "@/utils/commonUtils";
import { generateText } from "@tiptap/core";
import { TiptapExtensions } from "@/lib/editorConfigs";

export const POST = wrapApi({
  withAuth: true,
  paramsSchema: ProblemParamsSchema,
})(async (req: NextRequest, { params, user }) => {
  const { id } = params;

  const problemInfo = (await serverGetProblemInfo(id, {
    include: {
      submission: true,
    },
  })) as Prisma.ProblemGetPayload<{
    include: {
      submission: true;
    };
  }>;

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
  const aiResponse = await openAiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: PROMPTS.autoInput[LOCALES[problemInfo.locale]],
      },
      {
        role: "user",
        content: makeAutoInputPrompt(
          LOCALES[problemInfo.locale],
          JSON.stringify(
            generateText(problemInfo.description as any, TiptapExtensions),
          ),
          JSON.stringify(
            generateText(problemInfo.inputFormat as any, TiptapExtensions),
          ),
        ),
      },
    ],
  });

  const { choices } = await aiResponse.json();
  const { input: generatedInput } = JSON.parse(
    choices[0].message.content as string,
  );

  const output = await runCode({
    langId: answerSubmission.languageId,
    code,
    input: generatedInput,
  });

  return NextResponse.json({
    input: generatedInput,
    output,
  });
});
