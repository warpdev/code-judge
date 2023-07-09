import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Prisma } from "@prisma/client";

const submissionWithExtra = Prisma.validator<Prisma.SubmissionArgs>()({
  include: { problem: true, user: true, language: true },
});

const SubmissionsListPanel = async ({
  submissions,
}: {
  submissions: Prisma.SubmissionGetPayload<typeof submissionWithExtra>[];
}) => {
  return (
    <ul className="flex flex-col">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className="border-b border-neutral-400 first:border-t"
        >
          <Link
            href={`/submissions/${submission.id}`}
            className={twJoin("grid grid-cols-4", "px-1 py-2", actionNeutral)}
          >
            <span className="block">{submission.problem.title}</span>
            <span className="block">View Detail</span>
            <span>{submission.createdAt.toLocaleString()}</span>
            <span>{submission.user.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SubmissionsListPanel;
