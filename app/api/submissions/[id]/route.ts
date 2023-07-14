import { NextRequest, NextResponse } from "next/server";
import { getSubmissionAllInfo } from "@/utils/dbUtils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const submission = await getSubmissionAllInfo(id);

  return NextResponse.json(submission);
};
