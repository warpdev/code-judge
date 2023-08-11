import { NextRequest } from "next/server";
import { getMyProblems } from "@/utils/dbUtils";
import { wrapApi } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";
import { z } from "zod";

const GetMyProblemSchema = z.object({
  locale: z.string().default("all"),
  page: z.coerce.number().default(1),
});

export const GET = wrapApi({
  withAuth: true,
  querySchema: GetMyProblemSchema,
})(async (req: NextRequest, { user, query }) => {
  const { locale, page } = query;

  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const [problems] = await getMyProblems({
    locale: locale,
    user: user,
    pageIndex: page,
  });

  return ResTypes.OK(problems);
});
