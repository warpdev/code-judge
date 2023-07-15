"use client";
import { Problem } from "@prisma/client";
import { BaseProps } from "@/types/common";
import BaseProblemList from "@/components/Problems/BaseProblemList";
import useSWR from "swr";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import { makeParams } from "@/utils/commonUtils";

const ProblemsList = ({
  className,
  problems: initData,
  locale,
}: BaseProps & {
  problems: Problem[];
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
