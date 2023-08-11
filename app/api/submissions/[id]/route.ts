import { NextRequest } from "next/server";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";

export const GET = wrapApi({
  paramsSchema: ProblemParamsSchema,
})(async (req: NextRequest, { params }) => {
  const { id } = params;
  const submission = await getSubmissionAllInfo(id);

  return ResTypes.OK(submission);
});
