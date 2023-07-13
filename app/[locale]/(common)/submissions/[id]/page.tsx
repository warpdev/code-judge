import prisma from "@/lib/prisma";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { IJudgeStatus } from "@/types/judge";
import { twJoin } from "tailwind-merge";
import Link from "next/link";
import { title } from "@/style/baseStyle";
import SubmissionCodePanel from "@/components/Submissions/SubmissionCodePanel";
import { getTranslator } from "next-intl/server";
import { Spinner } from "@/components/BaseComponents";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import { JUDGE_STATUS } from "@/constants/judge";

const getTextColor = (statusId: number) => {
  switch (statusId) {
    case 1: //In Queue
      return "text-neutral-400";
    case 2: //Processing
      return "text-orange-400";
    case 3: //Accepted
      return "text-green-400";
    case 4: //Wrong Answer
    case 5: //Time Limit Exceeded
    case 6: //Memory Limit Exceeded
    case 7: //Runtime Error
    case 8: //Runtime Error
    case 9: //Runtime Error
    case 10: //Runtime Error
    case 11: //Runtime Error
    case 12: //Runtime Error
    default:
      return "text-red-400";
  }
};

const SubmissionDetailPage = async ({
  params,
}: {
  params: {
    locale: string;
    id: string;
  };
}) => {
  const t = await getTranslator(params.locale, "submission");
  const submission = await getSubmissionAllInfo(params.id);

  if (!submission) {
    return <div>Submission not found</div>;
  }

  return (
    <div>
      <h1>
        <span>{t("submissionDetail")}</span>
        <span className="sr-only"> - {submission?.problem.title}</span>
      </h1>
      <Link
        href={`/problems/${submission.problem.id}`}
        className={twJoin(title, "underline")}
      >
        {submission.problem.title}
      </Link>
      {submission.judgeTokens ? (
        <ol className="mt-12 flex flex-col gap-2">
          {submission.judgeTokens?.map((result, index) => (
            <li
              key={index}
              className={twJoin(
                "flex flex-col border-neutral-950 py-2",
                "md:flex-row md:justify-between md:border-b",
              )}
            >
              <span>Case #{index + 1}</span>
              <p className={twJoin(getTextColor(result.status), "font-bold")}>
                {
                  JUDGE_STATUS.find((status) => status.id === result.status)
                    ?.description
                }
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <Spinner />
      )}
      <SubmissionCodePanel submission={submission} locale={params.locale} />
    </div>
  );
};

export default SubmissionDetailPage;
