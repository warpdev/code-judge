"use client";
import { Problem } from "@prisma/client";
import { BaseProps } from "@/types/common";
import BaseProblemList from "@/components/Problems/BaseProblemList";

const MyProblemList = ({
  className,
  problems,
}: BaseProps & { problems: Problem[] }) => {
  return (
    <BaseProblemList
      problems={problems}
      className={className}
      showBadge={true}
    />
  );
};

export default MyProblemList;
