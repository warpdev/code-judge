"use client";
import { Prisma } from "@prisma/client";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { JUDGE_STATUS } from "@/constants/judge";
import { Spinner } from "@/components/BaseComponents";
import Accordion from "@/components/Accordions/Accordion";
import JudgeResultPanel from "@/components/Submissions/Judge/JudgeResultPanel";
import { IAllDetailedSubmissions } from "@/types/dbTypes";
import SetToAnswerButton from "@/components/Submissions/SetToAnswerButton";

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
  isMyProblem,
}: {
  initSubmission: IAllDetailedSubmissions;
  isMyProblem?: boolean;
}) => {
  const { id } = useParams();
  const { data: submissionDetail } = useSWR<IAllDetailedSubmissions>(
    `/api/submissions/${id}`,
    {
      fallbackData: initSubmission,
      refreshInterval: 5000,
    },
  );

  return (
    <>
      <div className="flex justify-end">
        {isMyProblem && (
          <SetToAnswerButton submission={submissionDetail!} className="mt-4" />
        )}
      </div>
      {submissionDetail?.judgeTokens.length ? (
        <ol className="mt-6 flex flex-col gap-2">
          <Accordion
            contents={submissionDetail.judgeTokens.map((result, index) => ({
              title: (
                <li
                  key={index}
                  className={twJoin(
                    "flex w-full border-neutral-950 py-2",
                    "dark:border-neutral-700",
                    "flex-row justify-between",
                  )}
                >
                  <span>Case #{index + 1}</span>
                  <p
                    className={twJoin(getTextColor(result.status), "font-bold")}
                  >
                    {
                      JUDGE_STATUS.find((status) => status.id === result.status)
                        ?.description
                    }
                  </p>
                </li>
              ),
              content: (
                <JudgeResultPanel
                  tokenId={result.id}
                  problemId={submissionDetail.problemId}
                  isMine={isMyProblem}
                />
              ),
            }))}
            defaultValue=""
          />
        </ol>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default JudgeDetailList;
