import { IAllDetailedSubmissions } from "@/types/dbTypes";
import { getServerUser } from "@/utils/serverUtils";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicOrCreatedBy } from "@/utils/dbUtils/shared";
import { getBatchSubmission } from "@/utils/judgeServerUtils";
import { Prisma } from "@prisma/client";
import { PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";

export const getSubmissionAllInfo = async (
  id: number | string,
): Promise<IAllDetailedSubmissions | undefined> => {
  const user = await getServerUser();
  const submissionId = z.coerce.number().parse(id);

  let submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
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
        judgeTokens: {
          select: {
            status: true;
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
        judgeTokens: {
          select: {
            status: true,
          },
        },
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
