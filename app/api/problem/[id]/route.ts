import { NextRequest, NextResponse } from "next/server";
import { getProblemInfo } from "@/utils/dbUtils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const problemInfo = await getProblemInfo(params.id);

  return NextResponse.json(problemInfo);
};