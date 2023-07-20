"use client";

import { IAllDetailedSubmissions } from "@/types/dbTypes";
import { twJoin } from "tailwind-merge";
import { greenButton } from "@/style/baseComponent";
import { useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";
import { getScore } from "@/utils/commonUtils";
import Tooltip from "@/components/Tooltip";
import { miniLabel } from "@/style/baseStyle";
import { BaseProps } from "@/types/common";
import { useState } from "react";
import { Spinner } from "@/components/BaseComponents";

const SetToAnswerButton = ({
  className,
  submission,
}: BaseProps & {
  submission: IAllDetailedSubmissions;
}) => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete =
    submission.judgeTokens.length === getScore(submission.judgeTokens);

  const handleClick = async () => {
    if (!isComplete) {
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`/api/problem/${submission.problemId}/answer`, {
        submissionId: submission.id,
      });
      toast.success(t("toast.setToAnswer.success"));
    } catch (e) {
      toast.error(t("toast.setToAnswer.fail"));
    }
    setIsSubmitting(false);
  };

  return (
    <Tooltip
      side="left"
      includeWrapper={false}
      trigger={
        <button
          className={twJoin(
            greenButton,
            "relative",
            "flex items-center justify-center gap-2",
            "md:self-end",
            "disabled:grayscale",
            className,
          )}
          onClick={handleClick}
          disabled={!isComplete || isSubmitting}
        >
          {isSubmitting && <Spinner className="absolute" />}
          {t("submission.setToAnswer")}
        </button>
      }
    >
      <span className={miniLabel}>{t("tooltip.setToAnswer")}</span>
    </Tooltip>
  );
};

export default SetToAnswerButton;
