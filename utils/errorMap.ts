import { z } from "zod";

export const getErrorKeySuffix = (issueType: string) => {
  switch (issueType) {
    case "string":
      return "Length";
    default:
      return "";
  }
};

export const getErrorData = (issue: z.ZodIssueOptionalMessage) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_union:
    case z.ZodIssueCode.invalid_type:
    case z.ZodIssueCode.invalid_literal:
      return {
        key: "invalid",
      } as const;
    case z.ZodIssueCode.too_small:
      return {
        key: `min${getErrorKeySuffix(issue.type)}`,
        data: {
          min: issue.minimum.toString(),
        },
      } as const;
    case z.ZodIssueCode.too_big:
      return {
        key: `max${getErrorKeySuffix(issue.type)}`,
        data: {
          max: issue.maximum.toString(),
        },
      } as const;
  }
};
