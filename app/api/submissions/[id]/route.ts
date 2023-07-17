import { NextRequest, NextResponse } from "next/server";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import { ProblemParamsSchema } from "@/app/api/schemas";
import { ResTypes } from "@/constants/response";

export const GET = async (
  req: NextRequest,
  { params: _params }: { params: { id: string } },
) => {
  const params = ProblemParamsSchema.safeParse(_params);
  if (!params.success) {
    return ResTypes.BAD_REQUEST(params.error.message);
  }
  const { id } = params.data;
  const submission = await getSubmissionAllInfo(id);

  return NextResponse.json(submission);
};
