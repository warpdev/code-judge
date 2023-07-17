import { NextRequest, NextResponse } from "next/server";
import { getDetailSubmission } from "@/utils/judgeServerUtils";
import { getIsMyProblem, getServerUser } from "@/utils/serverUtils";
import { getProblemInfo } from "@/utils/dbUtils";
import { ResTypes } from "@/constants/response";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";

const ParamsSchema = ProblemParamsSchema.extend({
  judgeId: z.string(),
});

export const GET = async (
  req: NextRequest,
  { params: _params }: { params: { id: string; judgeId: string } },
) => {
  const params = ParamsSchema.safeParse(_params);
  if (!params.success) {
    return ResTypes.BAD_REQUEST(params.error.message);
  }
  const { id, judgeId } = params.data;
  const user = await getServerUser();

  const problem = await getProblemInfo(id);
  if (!problem) {
    return ResTypes.NOT_FOUND("Problem not found");
  }

  const isMine = getIsMyProblem(problem, user);

  if (!isMine) {
    return ResTypes.NOT_AUTHORIZED;
  }
  const submission = await getDetailSubmission(judgeId);

  return NextResponse.json(submission, {
    headers: {
      "Cache-Control":
        submission.status.id > 2
          ? "maxage=31536000,s-maxage=31536000,immutable"
          : "no-cache",
    },
  });
};
