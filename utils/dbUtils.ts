import "server-only";
import prisma from "@/lib/prisma";
import { LOCALE_MAP, PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";
import { getBatchSubmission } from "@/utils/judgeServerUtils";
import { Prisma, Problem } from "@prisma/client";
import SubmissionGetPayload = Prisma.SubmissionGetPayload;
import { getServerUser } from "@/utils/serverUtils";
import { Session } from "next-auth";
import { ILocale } from "@/types/common";

const publicOrCreatedBy = (user?: Session["user"]) => [
  {
    isPublic: true,
  },
  {
    createdBy: user?.id,
  },
];

/**
 * Get problem detail info (Public or created by user)
 * @param id Problem id
 */
export const getProblemInfo = async (
  id: number | string,
): Promise<Problem | null> => {
  const user = await getServerUser();

  const problem = await prisma.problem.findUnique({
    where: {
      id: +id,
      OR: publicOrCreatedBy(user),
    },
  });

  return problem;
};

export const getPublicProblems = async ({
  pageIndex = 1,
  locale,
}: {
  pageIndex: number;
  locale?: string;
}): Promise<[Problem[], number]> => {
  const problemsData = await prisma.$transaction([
    prisma.problem.findMany({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        isPublic: true,
      },
      skip: (pageIndex - 1) * PROBLEM_LIST_PAGE_SIZE,
      take: PROBLEM_LIST_PAGE_SIZE,
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

export const getSubmissionAllInfo = async (
  id: number | string,
): Promise<
  | SubmissionGetPayload<{
      include: {
        problem: true;
        language: true;
        judgeTokens: true;
      };
    }>
  | undefined
> => {
  const user = await getServerUser();

  let submission = await prisma.submission.findUnique({
    where: {
      id: +id,
      problem: {
        OR: publicOrCreatedBy(user),
      },
    },
    include: {
      problem: true,
      language: true,
      judgeTokens: true,
    },
  });
  if (!submission) {
    return undefined;
  }
  const refreshTokens = submission.judgeTokens
    .filter((token) => token.status < 3)
    .map((token) => token.id);

  if (refreshTokens.length) {
    const { submissions: judgeStatus } = await getBatchSubmission(
      refreshTokens,
    );
    submission.judgeTokens = submission.judgeTokens.map((token) => {
      const newStatus = judgeStatus.find((status) => status.token === token.id);

      return newStatus
        ? {
            ...token,
            status: newStatus.status.id,
          }
        : token;
    });

    await prisma.$transaction(
      judgeStatus.map((status) =>
        prisma.judgeToken.update({
          where: {
            id: status.token,
          },
          data: {
            status: status.status.id,
          },
        }),
      ),
    );
  }

  return submission;
};

export const getAllSubmissions = async ({
  pageIndex,
  onlyMy,
  locale,
}: {
  pageIndex: number;
  onlyMy?: boolean;
  locale?: string;
}): Promise<
  [
    Prisma.SubmissionGetPayload<{
      include: {
        problem: true;
        language: true;
        user: {
          select: {
            id: true;
          };
        };
      };
    }>[],
    number,
  ]
> => {
  const user = await getServerUser();

  const submissionData = await prisma.$transaction([
    prisma.submission.findMany({
      where: {
        problem: {
          OR: publicOrCreatedBy(user),
        },
        userId: onlyMy ? user?.id : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        problem: true,
        language: true,
      },
      orderBy: {
        id: "desc",
      },
      skip: (pageIndex - 1) * PROBLEM_LIST_PAGE_SIZE,
      take: PROBLEM_LIST_PAGE_SIZE,
    }),
    prisma.submission.count({
      where: {
        problem: {
          OR: publicOrCreatedBy(user),
        },
        userId: onlyMy ? user?.id : undefined,
      },
    }),
  ]);

  return submissionData;
};
