"use client";
import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Problem } from "@prisma/client";
import useSWR from "swr";
import { IProblemFilter } from "@/types/common";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import PageNavigator from "@/components/Navigator";

const makeParams = (filter: Record<keyof IProblemFilter, string | null>) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params;
};

const ProblemsList = ({
  initData,
  locale,
}: {
  initData: Problem[];
  locale: string;
}) => {
  const { currentFilter, currentPage } = useCurrentProblemQuery(locale);

  const { data: problems } = useSWR<Problem[]>(
    `/api/problem?${makeParams(currentFilter)}&page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );

  return (
    <section className="mt-8 flex flex-col gap-8">
      <ProblemFilterPanel defaultLocal={locale} />
      <ul className="flex flex-col">
        {problems?.map((problem) => (
          <li
            key={problem.id}
            className={twJoin(
              "px-1 py-2",
              "border-b border-neutral-400 first:border-t",
              "dark:border-neutral-600",
              actionNeutral,
              "hover:opacity-80",
            )}
          >
            <Link className="block w-full" href={`/problems/${problem.id}`}>
              {problem.title}
            </Link>
          </li>
        ))}
      </ul>
      <PageNavigator />
    </section>
  );
};

export default ProblemsList;
