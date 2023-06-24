import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();

  const problem = await prisma.problem.create({
    data: {
      ...body,
      memoryLimit: parseInt(body.memoryLimit),
      timeLimit: parseInt(body.timeLimit),
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(problem);
};
