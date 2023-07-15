"use client";
import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Problem } from "@prisma/client";
import useSWR from "swr";
import { IProblemFilter } from "@/types/common";
import { useTranslations } from "next-intl";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import { Badge } from "@/components/BaseComponents";
import { Lock, Unlock } from "lucide-react";
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

const MyProblemList = ({ initData }: { initData: Problem[] }) => {
  const t = useTranslations();
  const { currentFilter, currentPage } = useCurrentProblemQuery("all");

  const { data: problems } = useSWR<Problem[]>(
    `/api/problem/my?${makeParams(currentFilter)}&page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );

  return (
    <section className="mt-8 flex flex-col gap-8">
      <ProblemFilterPanel defaultLocal="all" />
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
            <Link
              className={twJoin(
                //TODO: grid
                "flex justify-between",
                "block w-full",
              )}
              href={`/problems/${problem.id}`}
            >
              <span>{problem.title}</span>
              <Badge
                className={
                  problem.isPublic
                    ? "bg-emerald-500 text-emerald-500"
                    : "bg-amber-600 text-amber-600"
                }
              >
                {problem.isPublic ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>
                  {problem.isPublic ? t("common.public") : t("common.private")}
                </span>
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
      <PageNavigator />
    </section>
  );
};

export default MyProblemList;
