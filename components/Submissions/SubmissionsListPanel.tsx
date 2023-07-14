import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { getServerUser } from "@/utils/serverUtils";
import { UserCheck2 } from "lucide-react";
import { getTranslator } from "next-intl/server";

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

const gridTemplate = twJoin(`grid-cols-[1fr_1fr_1fr_30px]`);

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
            className={twJoin("grid", gridTemplate, "px-1 py-2", actionNeutral)}
          >
            <span className="block">{submission.problem.title}</span>
            <span className="block">{t("viewDetail")}</span>
            <span>{submission.createdAt.toLocaleString()}</span>
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
