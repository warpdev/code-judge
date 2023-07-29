import { Prisma, Lecture } from "@prisma/client";
import { getServerUser } from "@/utils/serverUtils";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { publicOrCreatedBy } from "@/utils/dbUtils/shared";
import { LOCALE_MAP, PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";
import { ILocale } from "@/types/common";

export const getLectureInfo = async (
  id: number | string,
  extra?: Prisma.LectureArgs,
): Promise<Lecture | null> => {
  const user = await getServerUser();
  const lectureId = z.coerce.number().parse(id);

  const lecture = await prisma.lecture.findUnique({
    where: {
      id: lectureId,
      OR: publicOrCreatedBy(user),
    },
    ...extra,
  });

  return lecture;
};

export const getPublicLectures = async ({
  pageIndex = 1,
  locale,
}: {
  pageIndex: number;
  locale?: string;
}) => {
  const lecturesData = await prisma.$transaction([
    prisma.lecture.findMany({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        isPublic: true,
      },
      skip: (pageIndex - 1) * PROBLEM_LIST_PAGE_SIZE,
      take: PROBLEM_LIST_PAGE_SIZE,
    }),
    prisma.lecture.count({
      where: {
        locale: LOCALE_MAP[locale as ILocale]?.id,
        isPublic: true,
      },
    }),
  ]);

  return lecturesData;
};
