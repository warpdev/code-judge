import prisma from "@/lib/prisma";

export const getProblemInfo = async (id: number | string) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
  });
  if (!problem) {
    throw new Error("Problem not found");
  }
  return problem;
};
