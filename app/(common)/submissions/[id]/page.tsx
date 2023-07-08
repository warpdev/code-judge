import prisma from "@/lib/prisma";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ISubmissions } from "@/types/judge";

const getTextColor = (statusId: number) => {
  switch (statusId) {
    case 3:
      return "text-green-500";
    case 4:
      return "text-red-500";
    default:
      return "";
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
      <h1>Submission Detail - {submission?.problem.title}</h1>
      {judgeSubmissions.map((result, index) => (
        <p className={getTextColor(result.status.id)} key={index}>
          {result.status.description}
        </p>
      ))}
    </div>
  );
};

export default SubmissionDetailPage;
