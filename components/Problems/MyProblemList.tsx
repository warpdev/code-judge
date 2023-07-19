"use client";
import { Problem } from "@prisma/client";
import { BaseProps } from "@/types/common";
import BaseProblemList from "@/components/Problems/BaseProblemList";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import useSWR from "swr";

const MyProblemList = ({
  className,
  problems: initData,
  locale,
}: BaseProps & { problems: Problem[]; locale: string }) => {
  const { currentPage } = useCurrentProblemQuery(locale);

  const { data: problems } = useSWR<Problem[]>(
    `/api/problem/my?page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );
  return (
    <BaseProblemList
      problems={problems}
      className={className}
      showBadge={true}
    />
  );
};

export default MyProblemList;
