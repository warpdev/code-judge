import { NextRequest } from "next/server";
import { LectureSchema } from "@/types/schema";
import { ResTypes } from "@/constants/response";
import { getServerUser } from "@/utils/serverUtils";
import prisma from "@/lib/prisma";
import { LOCALE_MAP } from "@/constants/common";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const result = LectureSchema.safeParse(body);
  if (!result.success) {
    return ResTypes.BAD_REQUEST(result.error.message);
  }
  const { title, locale, videoUrl, description, content } = result.data;

  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const lecture = await prisma.lecture.create({
    data: {
      title,
      locale: LOCALE_MAP[locale].id,
      videoUrl,
      description,
      content,
      createdBy: user.id,
    },
    select: {
      id: true,
    },
  });

  return ResTypes.CREATED(lecture);
};
