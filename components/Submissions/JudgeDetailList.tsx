"use client";
import { Prisma } from "@prisma/client";
import SubmissionGetPayload = Prisma.SubmissionGetPayload;
import useSWR from "swr";
import { useParams } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { JUDGE_STATUS } from "@/constants/judge";
import { Spinner } from "@/components/BaseComponents";

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

const JudgeDetailList = ({
  initSubmission,
}: {
  initSubmission: SubmissionGetPayload<{
    include: {
      problem: true;
      language: true;
      judgeTokens: true;
    };
  }>;
}) => {
  const { id } = useParams();
  const { data: submissionDetail } = useSWR<
    SubmissionGetPayload<{
      include: {
        problem: true;
        language: true;
        judgeTokens: true;
      };
    }>
  >(`/api/submissions/${id}`, {
    fallbackData: initSubmission,
    refreshInterval: 5000,
  });

  return (
    <>
      {submissionDetail?.judgeTokens.length ? (
        <ol className="mt-12 flex flex-col gap-2">
          {submissionDetail.judgeTokens.map((result, index) => (
            <li
              key={index}
              className={twJoin(
                "flex flex-col border-neutral-950 py-2",
                "dark:border-neutral-700",
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
    </>
  );
};

export default JudgeDetailList;
