import prisma from "@/lib/prisma";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ISubmissions } from "@/types/judge";
import { twJoin } from "tailwind-merge";
import Link from "next/link";
import { title } from "@/style/baseStyle";
import SubmissionCodePanel from "@/components/Submissions/SubmissionCodePanel";
import { getTextColor } from "@/utils/judgeClientUtils";
import { getTranslator } from "next-intl/server";

const SubmissionDetailPage = async ({
  params,
}: {
  params: {
    locale: string;
    id: string;
  };
}) => {
  const t = await getTranslator(params.locale, "submission");
  const submission = await prisma.submission.findUnique({
    where: {
      id: params.id,
    },
    include: {
      problem: true,
      language: true,
    },
  });

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const { submissions: judgeSubmissions } = await fetchJudgeApi<{
    submissions: ISubmissions[];
  }>(
    `/submissions/batch?tokens=${submission.submissionTokens.join(
      ",",
    )}&base64_encoded=true&fields=status`,
    {
      next: {
        revalidate: 30,
      },
    },
  );

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
      <ol className="mt-12 flex flex-col gap-2">
        {judgeSubmissions.map((result, index) => (
          <li
            key={index}
            className={twJoin(
              "flex flex-col border-neutral-950 py-2",
              "md:flex-row md:justify-between md:border-b",
            )}
          >
            <span>Case #{index + 1}</span>
            <p className={twJoin(getTextColor(result.status.id), "font-bold")}>
              {result.status.description}
            </p>
          </li>
        ))}
      </ol>
      <SubmissionCodePanel submission={submission} locale={params.locale} />
    </div>
  );
};

export default SubmissionDetailPage;
