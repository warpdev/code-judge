import { z } from "zod";

export const ProblemParamsSchema = z.object({
  id: z.coerce.number(),
});
