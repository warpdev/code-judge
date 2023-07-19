import { Prisma } from "@prisma/client";

export type IAllDetailedSubmissions = Prisma.SubmissionGetPayload<{
  include: {
    problem: true;
    language: true;
    judgeTokens: true;
  };
}>;