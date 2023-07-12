import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/utils/serverUtils";
import { ResTypes } from "@/constants/response";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  const user = await getServerUser();
  if (!user) {
    return ResTypes.NOT_AUTHORIZED;
  }

  const problem = await prisma.problem.create({
    data: {
      ...body,
      memoryLimit: parseInt(body.memoryLimit),
      timeLimit: parseInt(body.timeLimit),
      createdBy: user.id,
      locale: "ko",
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(problem);
};
