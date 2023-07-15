"use client";
import { Problem } from "@prisma/client";
import useSWR from "swr";
import { BaseProps, IProblemFilter } from "@/types/common";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import BaseProblemList from "@/components/Problems/BaseProblemList";

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
  className,
  initData,
  locale,
}: BaseProps & {
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

  return <BaseProblemList problems={problems} className={className} />;
};

export default ProblemsList;
