"use client";

import { useTranslations } from "next-intl";
import useSWRImmutable from "swr/immutable";
import { IJudgeFullStatus } from "@/types/judge";
import { Spinner } from "@/components/BaseComponents";
import { twJoin } from "tailwind-merge";
import { baseInput } from "@/style/baseStyle";

const JudgeResultPanel = ({
  problemId,
  tokenId,
  isMine,
}: {
  problemId: number;
  tokenId: string;
  isMine?: boolean;
}) => {
  const t = useTranslations();
  const { data, isLoading } = useSWRImmutable<IJudgeFullStatus>(
    `/api/problem/${problemId}/${tokenId}`,
  );

  //TODO: expect out ?
  return (
    <div className="flex h-64 flex-col items-center">
      {!isMine ? (
        <span>{t("submission.notMyProblem")}</span>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex w-full justify-between">
            <span>
              {t("submission.execMemory")} : {data?.memory}KB
            </span>
            <span>
              {t("submission.execTime")} : {data?.time}s
            </span>
          </div>
          <div className="flex h-full w-full flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <span>{t("submission.stdin")}</span>
              <span className={twJoin(baseInput, "font-mono", "h-full")}>
                {atob(data?.stdin ?? "")}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span>{t("submission.stdout")}</span>
              <span className={twJoin(baseInput, "font-mono", "h-full")}>
                {atob(data?.stdout ?? "")}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JudgeResultPanel;
