"use client";
import { Problem } from "@prisma/client";
import { BaseProps, IProblemFilter } from "@/types/common";
import BaseProblemList from "@/components/Problems/BaseProblemList";

const ProblemsList = ({
  className,
  problems,
}: BaseProps & {
  problems: Problem[];
}) => {
  return <BaseProblemList problems={problems} className={className} />;
};

export default ProblemsList;
