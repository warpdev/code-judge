"use client";
import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Problem } from "@prisma/client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const ProblemsList = ({
  initData,
  locale,
}: {
  initData: Problem[];
  locale: string;
}) => {
  const searchParams = useSearchParams();
  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    if (page) {
      return +page - 1;
    } else {
      return 0;
    }
  }, [searchParams]);

  const { data: problems } = useSWR<Problem[]>(
    `/api/problems?locale=${locale}&page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );

  return (
    <ul className="mt-8 flex flex-col">
      {problems?.map((problem) => (
        <li
          key={problem.id}
          className={twJoin(
            "px-1 py-2",
            "border-b border-neutral-400 first:border-t",
            actionNeutral,
          )}
        >
          <Link href={`/problems/${problem.id}`}>{problem.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ProblemsList;
