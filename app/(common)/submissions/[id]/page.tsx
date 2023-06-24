import prisma from "@/lib/prisma";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";

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
    },
  });

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const judgeResult = await fetchJudgeApi(
    `/submissions/${submission.submissionToken}?base64_encoded=true&fields=*`,
    {
      next: {
        revalidate: 30,
      },
    }
  );

  console.log(judgeResult);

  return (
    <div>
      <h1>Submission Detail - {submission?.problem.title}</h1>
      <p className={getTextColor(judgeResult.status.id)}>
        {judgeResult.status.description}
      </p>
    </div>
  );
};

export default SubmissionDetailPage;
