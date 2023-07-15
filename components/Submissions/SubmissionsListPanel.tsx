import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { getServerUser } from "@/utils/serverUtils";
import { UserCheck2 } from "lucide-react";
import { getTranslator } from "next-intl/server";
import TimeText from "@/components/TimeText";

const submissionWithExtra = Prisma.validator<Prisma.SubmissionArgs>()({
  include: {
    problem: true,
    user: {
      select: {
        id: true,
      },
    },
    language: true,
  },
});

const gridTemplate = twJoin(`grid-cols-[1fr_auto_30px]`);

const SubmissionsListPanel = async ({
  submissions,
  locale,
}: {
  submissions: Prisma.SubmissionGetPayload<typeof submissionWithExtra>[];
  locale: string;
}) => {
  const t = await getTranslator(locale, "submission");
  const userInfo = await getServerUser();

  return (
    <ul className="flex flex-col">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className={twJoin(
            "border-b border-neutral-400 first:border-t",
            "dark:border-neutral-600",
          )}
        >
          <Link
            href={`/submissions/${submission.id}`}
            className={twJoin(
              "grid",
              gridTemplate,
              "place-items-center",
              "gap-2",
              "px-1 py-2",
              actionNeutral,
              "text-sm md:text-base",
            )}
          >
            <span className="block place-self-start">
              {submission.problem.title}
            </span>
            <TimeText time={submission.createdAt} className="text-right" />
            <span>
              {userInfo?.id === submission.userId ? (
                <UserCheck2 className="h-6 w-6" />
              ) : (
                ""
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SubmissionsListPanel;
