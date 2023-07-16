import { NextRequest, NextResponse } from "next/server";
import { getMyProblems } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const user = await getServerUser();

  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const [problems] = await getMyProblems({
    locale: locale,
    user: user,
    pageIndex: page,
  });

  return NextResponse.json(problems);
};
