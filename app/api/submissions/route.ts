import { NextRequest, NextResponse } from "next/server";
import { getAllSubmissions } from "@/utils/dbUtils";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const onlyMine = searchParams.get("onlyMine") === "true";

  const [allSubmissions] = await getAllSubmissions({
    pageIndex: page,
    onlyMy: onlyMine,
  });

  return NextResponse.json(allSubmissions);
};
