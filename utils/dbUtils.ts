import prisma from "@/lib/prisma";
import { LOCALE_MAP, PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";

export const getProblemInfo = async (id: number | string) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id: +id,
    },
  });
  if (!problem) {
    throw new Error("Problem not found");
  }
  return problem;
};

export const getProblems = async ({
  pageIndex,
  locale,
}: {
  pageIndex: number;
  locale?: string;
}) => {
  const problems = await prisma.problem.findMany({
    where: {
      locale: LOCALE_MAP[locale as any]?.id,
    },
    skip: pageIndex * PROBLEM_LIST_PAGE_SIZE,
    take: PROBLEM_LIST_PAGE_SIZE,
  });
  if (!problems) {
    throw new Error("Problem not found");
  }
  return problems;
};
