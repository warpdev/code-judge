import { Badge } from "@/components/BaseComponents";
import { twJoin } from "tailwind-merge";

const ScoreBadge = ({ statuses }: { statuses: { status: number }[] }) => {
  const correct = statuses.filter((s) => s.status === 3).length;
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
