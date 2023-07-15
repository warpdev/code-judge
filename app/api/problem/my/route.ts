import { NextRequest, NextResponse } from "next/server";
import { getMyProblems } from "@/utils/dbUtils";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "all";
  const page = parseInt(searchParams.get("page") || "1");

  const [problems] = await getMyProblems({
    locale: locale,
    pageIndex: page,
  });

  return NextResponse.json(problems);
};
