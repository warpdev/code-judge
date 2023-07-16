"use client";
import { twJoin } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { UserCheck2 } from "lucide-react";
import TimeText from "@/components/TimeText";
import { Session } from "next-auth";
import usePageIndex from "@/utils/hooks/usePageIndex";
import useSWR from "swr";

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

const SubmissionsListPanel = ({
  userInfo,
  submissions: initData,
  onlyMine = false,
}: {
  userInfo?: Session["user"];
  submissions: Prisma.SubmissionGetPayload<typeof submissionWithExtra>[];
  onlyMine?: boolean;
}) => {
  const { currentPage } = usePageIndex();
  const { data: submissions } = useSWR<
    Prisma.SubmissionGetPayload<typeof submissionWithExtra>[]
  >(`/api/submissions?onlyMine=${onlyMine}page=${currentPage}`, {
    fallbackData: initData,
  });

  return (
    <ul className="flex flex-col">
      {submissions?.map((submission) => (
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
            <TimeText
              time={new Date(submission.createdAt)}
              className="text-right"
            />
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
