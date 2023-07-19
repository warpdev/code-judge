import { Badge } from "@/components/BaseComponents";
import { twJoin } from "tailwind-merge";
import { getScore } from "@/utils/commonUtils";

const ScoreBadge = ({ statuses }: { statuses: { status: number }[] }) => {
  const correct = getScore(statuses);
  const total = statuses.length;

  const badgeColor = twJoin(
    correct === 0
      ? "bg-red-500 text-red-500"
      : correct < total
      ? "bg-amber-500 text-amber-500"
      : "bg-emerald-500 text-emerald-500",
  );

  return (
    <Badge className={badgeColor}>
      {correct}/{total}
    </Badge>
  );
};

export default ScoreBadge;
