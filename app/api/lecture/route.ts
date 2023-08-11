import { NextRequest } from "next/server";
import { LectureSchema } from "@/types/schema";
import { ResTypes } from "@/constants/response";
import { wrapApi } from "@/utils/serverUtils";
import prisma from "@/lib/prisma";
import { LOCALE_MAP } from "@/constants/common";

export const POST = wrapApi({ withAuth: true, bodySchema: LectureSchema })(
  async (req: NextRequest, { user, body }) => {
    const { title, locale, videoUrl, description, content, relatedProblems } =
      body;

    const lecture = await prisma.lecture.create({
      data: {
        title,
        locale: LOCALE_MAP[locale].id,
        videoUrl,
        description,
        content,
        createdBy: user.id,
        problems: {
          connect: relatedProblems?.map((id) => ({
            id,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return ResTypes.CREATED(lecture);
  },
);
