import prisma from "@/lib/prisma";

export const getProblemInfo = async (id: string) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
  });
  if (!problem) {
    throw new Error("Problem not found");
  }
  return problem;
};
