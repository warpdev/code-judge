import { NextRequest } from "next/server";
import { getAllSubmissions } from "@/utils/dbUtils";
import { wrapApi } from "@/utils/serverUtils";
import { z } from "zod";
import { ResTypes } from "@/constants/response";

const querySchema = z.object({
  page: z.coerce.number().default(1),
  onlyMine: z.coerce.boolean().default(false),
});

export const GET = wrapApi({
  querySchema: querySchema,
})(async (req: NextRequest, { query: { page, onlyMine } }) => {
  const [allSubmissions] = await getAllSubmissions({
    pageIndex: page,
    onlyMy: onlyMine,
  });

  return ResTypes.OK(allSubmissions);
});
