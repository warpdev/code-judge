import { Problem } from "@prisma/client";
import { twJoin } from "tailwind-merge";
import { baseCard } from "@/style/baseComponent";
import { FileEdit } from "lucide-react";

const RelatedProblemCard = ({ problem }: { problem: Problem }) => {
  return (
    <div className={twJoin(baseCard, "flex items-center gap-2")}>
      <FileEdit className="h-6 w-6" />
      <span>{problem.title}</span>
    </div>
  );
};

export default RelatedProblemCard;
