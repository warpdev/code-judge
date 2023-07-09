import prisma from "@/lib/prisma";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ISubmissions } from "@/types/judge";
import { twJoin } from "tailwind-merge";
import Link from "next/link";
import { title } from "@/style/baseStyle";
import { ArrowUpRight } from "lucide-react";

const getTextColor = (statusId: number) => {
  switch (statusId) {
    case 3:
      return "text-green-400";
    case 4:
      return "text-red-400";
    default:
      return "text-neutral-400";
  }
};

const SubmissionDetailPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
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
      ","
    )}&base64_encoded=true&fields=status`,
    {
      next: {
        revalidate: 30,
      },
    }
  );

  return (
    <div>
      <h1>
        Submission Detail
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
              "md:flex-row md:justify-between md:border-b"
            )}
          >
            <span>Case #{index + 1}</span>
            <p className={twJoin(getTextColor(result.status.id), "font-bold")}>
              {result.status.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SubmissionDetailPage;
