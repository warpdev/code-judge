import { z } from "zod";
import { LOCALES } from "@/constants/common";

const BaseDocSchema = z
  .object({
    type: z.optional(z.string()),
    attrs: z.optional(z.record(z.any())),
    marks: z.optional(
      z.array(
        z
          .object({
            type: z.string(),
            attrs: z.optional(z.record(z.any())),
          })
          .catchall(z.any()),
      ),
    ),
    text: z.optional(z.string()),
  })
  .catchall(z.any());

type DocContent = z.infer<typeof BaseDocSchema> & {
  content?: DocContent[];
};

export const DocSchema: z.ZodType<DocContent> = BaseDocSchema.extend({
  content: z.lazy(() => z.optional(DocSchema.array())),
});

export const ProblemSchema = z.object({
  title: z.string().min(1).max(100),
  description: DocSchema,
  inputFormat: DocSchema,
  outputFormat: DocSchema,
  sampleInput: z.string(),
  sampleOutput: z.string(),
  memoryLimit: z.coerce.number(),
  timeLimit: z.coerce.number().transform((v) => v * 1000),
  locale: z.enum(LOCALES),
});

export const LectureSchema = z.object({
  title: z.string().min(2).max(20),
  locale: z.enum(LOCALES),
  description: z.string().min(2).max(20),
  content: DocSchema,
  videoUrl: z.string().url().optional().or(z.literal("")),
  relatedProblems: z.array(z.coerce.number()).optional(),
});

export const ProblemPageParamsSchema = z.object({
  id: z.coerce.number(),
});
