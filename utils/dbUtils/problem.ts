import { Prisma, Problem } from "@prisma/client";
import { getServerUser } from "@/utils/serverUtils";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicOrCreatedBy } from "@/utils/dbUtils/shared";
import { Session } from "next-auth";
import { LOCALE_MAP, PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";
import { ILocale } from "@/types/common";

/**
 * Get problem detail info (Public or created by user)
 * @param id Problem id
 * @param extra
 */
export const getProblemInfo = async (
  id: number | string,
  extra?: Prisma.ProblemArgs,
): Promise<Problem | null> => {
  const user = await getServerUser();
  const problemId = z.coerce.number().parse(id);

  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
      OR: publicOrCreatedBy(user),
    },
    ...extra,
  });

  return problem;
};

export const getPublicProblems = async ({
  pageIndex = 1,
  take = PROBLEM_LIST_PAGE_SIZE,
  locale,
}: {
  pageIndex: number;
  take?: number;
  locale?: string;
}): Promise<[Problem[], number]> => {
  const problemsData = await prisma.$transaction([
    prisma.problem.findMany({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        isPublic: true,
      },
      skip: (pageIndex - 1) * take,
      take: take,
    }),
    prisma.problem.count({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        isPublic: true,
      },
    }),
  ]);

  return problemsData;
};

export const getMyProblems = async ({
  pageIndex = 1,
  user,
  locale,
}: {
  pageIndex: number;
  user: Session["user"];
  locale?: string;
}): Promise<[Problem[], number]> => {
  const problems = await prisma.$transaction([
    prisma.problem.findMany({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        createdBy: user.id,
      },
      orderBy: {
        id: "desc",
      },
      skip: (pageIndex - 1) * PROBLEM_LIST_PAGE_SIZE,
      take: PROBLEM_LIST_PAGE_SIZE,
    }),
    prisma.problem.count({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        createdBy: user.id,
      },
    }),
  ]);

  return problems;
};

export const getProblemsByText = async ({
  take = 10,
  text,
}: {
  take?: number;
  text: string;
}): Promise<Problem[]> => {
  const problems = await prisma.problem.findMany({
    where: {
      isPublic: true,
      title: {
        contains: text,
      },
    },
    take,
  });

  return problems;
};
