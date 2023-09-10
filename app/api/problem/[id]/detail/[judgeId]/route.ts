import { NextRequest, NextResponse } from "next/server";
import { getDetailSubmission } from "@/utils/judgeServerUtils";
import { getIsMyProblem, getServerUser, wrapApi } from "@/utils/serverUtils";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import { ResTypes } from "@/constants/response";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { z } from "zod";

const ParamsSchema = ProblemParamsSchema.extend({
  judgeId: z.string(),
});

export const GET = wrapApi({ withAuth: true, paramsSchema: ParamsSchema })(
  async (req: NextRequest, { params, user }) => {
    const { id, judgeId } = params;
    const problem = await serverGetProblemInfo(id);
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
  },
);
