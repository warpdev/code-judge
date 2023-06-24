import prisma from "@/lib/prisma";
import { PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";
import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";

const ProblemsList = async ({ initIndex }: { initIndex: number }) => {
  const problems = await prisma.problem.findMany({
    skip: initIndex * PROBLEM_LIST_PAGE_SIZE,
    take: PROBLEM_LIST_PAGE_SIZE,
  });

  return (
    <ul className="mt-8 flex flex-col">
      {problems.map((problem) => (
        <li
          key={problem.id}
          className={twJoin(
            "px-1 py-2",
            "border-b border-neutral-400 first:border-t",
            actionNeutral
          )}
        >
          <Link href={`/problems/${problem.id}`}>{problem.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ProblemsList;
