import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  const submission = await prisma.submission.findUnique({
    where: {
      id: +id,
    },
    include: {
      problem: true,
      language: true,
    },
  });

  return NextResponse.json(submission);
};
