import { twJoin } from "tailwind-merge";
import Link from "next/link";
import { title } from "@/style/baseStyle";
import SubmissionCodePanel from "@/components/Submissions/SubmissionCodePanel";
import { getTranslator } from "next-intl/server";
import { getSubmissionAllInfo } from "@/utils/dbUtils";
import JudgeDetailList from "@/components/Submissions/JudgeDetailList";

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
      <JudgeDetailList initSubmission={submission} />
      <SubmissionCodePanel submission={submission} locale={params.locale} />
    </div>
  );
};

export default SubmissionDetailPage;
