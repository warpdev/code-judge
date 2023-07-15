import { twJoin } from "tailwind-merge";
import Link from "next/link";
import { title } from "@/style/baseStyle";
import SubmissionCodePanel from "@/components/Submissions/SubmissionCodePanel";
import { getTranslator } from "next-intl/server";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import JudgeDetailList from "@/components/Submissions/Judge/JudgeDetailList";
import { getServerUser } from "@/utils/serverUtils";

const SubmissionDetailPage = async ({
  params,
}: {
  params: {
    locale: string;
    id: string;
  };
}) => {
  const t = await getTranslator(params.locale, "submission");
  const user = await getServerUser();
  const submission = await getSubmissionAllInfo(params.id);

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const isMyProblem = submission.problem.createdBy === user?.id;

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
      <JudgeDetailList initSubmission={submission} isMyProblem={isMyProblem} />
      <SubmissionCodePanel submission={submission} locale={params.locale} />
    </div>
  );
};

export default SubmissionDetailPage;
