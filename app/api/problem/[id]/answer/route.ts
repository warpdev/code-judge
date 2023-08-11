import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ResTypes } from "@/constants/response";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import { getScore } from "@/utils/commonUtils";
import { wrapApi } from "@/utils/serverUtils";
import prisma from "@/lib/prisma";

const SetAnswerSchema = z.object({
  submissionId: z.number(),
});

export const POST = wrapApi({
  withAuth: true,
  bodySchema: SetAnswerSchema,
  paramsSchema: ProblemParamsSchema,
})(async (req: NextRequest, { user, body, params }) => {
  const { submissionId } = body;
  const { id } = params;

  const submission = await getSubmissionAllInfo(submissionId);
  if (!submission) {
    return ResTypes.NOT_FOUND("Submission not found");
  }

  if (submission.problemId !== id) {
    return ResTypes.BAD_REQUEST("Problem id not match");
  }

  if (
    submission.userId !== user.id ||
    submission.problem.createdBy !== user.id
  ) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const correct = getScore(submission.judgeTokens);
  const total = submission.judgeTokens.length;

  if (correct !== total) {
    return ResTypes.BAD_REQUEST("Submission is not fully judged");
  }

  const result = await prisma.problem.update({
    where: {
      id,
    },
    data: {
      answerId: submissionId,
    },
  });

  return NextResponse.json(result);
});
