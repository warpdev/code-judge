import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";

const SubmissionsListPanel = async ({
  submissions,
}: {
  submissions: any[];
}) => {
  return (
    <ul className="flex flex-col">
      {submissions.map((submission) => (
        <li
          className={twJoin(
            "grid grid-cols-4",
            "px-1 py-2",
            "border-b border-neutral-400 first:border-t",
            actionNeutral
          )}
          key={submission.id}
        >
          <Link href={`/problems/${submission.problem.id}`} className="block">
            {submission.problem.title}
          </Link>
          <Link href={`/submissions/${submission.id}`} className="block">
            View Detail
          </Link>
          <span>{submission.createdAt.toLocaleString()}</span>
          <span>{submission.user.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default SubmissionsListPanel;
