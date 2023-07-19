"use client";

import { IAllDetailedSubmissions } from "@/types/dbTypes";
import { twJoin } from "tailwind-merge";
import { greenButton } from "@/style/baseComponent";
import { useTranslations } from "next-intl";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { getScore } from "@/utils/commonUtils";
import Tooltip from "@/components/Tooltip";
import { miniLabel } from "@/style/baseStyle";

const SetToAnswerButton = ({
  submission,
}: {
  submission: IAllDetailedSubmissions;
}) => {
  const t = useTranslations();

  const isComplete =
    submission.judgeTokens.length >= 10 &&
    submission.judgeTokens.length === getScore(submission.judgeTokens);

  const handleClick = async () => {
    if (!isComplete) {
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/problem/${submission.problemId}/answer`,
        {
          submissionId: submission.id,
        },
      );
      toast.success(t("toast.setToAnswer.success"));
    } catch (e) {
      toast.error(t("toast.setToAnswer.fail"));
    }
  };

  return (
    <Tooltip
      side="bottom"
      includeWrapper={false}
      trigger={
        <button
          className={twJoin(
            greenButton,
            "md:self-end",
            "disabled:pointer-events-none disabled:grayscale",
          )}
          onClick={handleClick}
          disabled={!isComplete}
        >
          {t("submission.setToAnswer")}
        </button>
      }
    >
      <span className={miniLabel}>{t("tooltip.setToAnswer")}</span>
    </Tooltip>
  );
};

export default SetToAnswerButton;
