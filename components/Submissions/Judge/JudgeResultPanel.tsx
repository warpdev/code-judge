"use client";

import { useTranslations } from "next-intl";
import useSWRImmutable from "swr/immutable";
import { IJudgeFullStatus } from "@/types/judge";
import { Spinner } from "@/components/BaseComponents";
import { twJoin } from "tailwind-merge";
import { baseInput } from "@/style/baseStyle";
import prettyBytes from "pretty-bytes";
import ErrorPanel from "@/components/ErrorPanel";

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
    `/api/problem/${problemId}/detail/${tokenId}`,
  );

  //TODO: expect out ?
  return (
    <div className="flex h-64 flex-col items-center">
      {!isMine ? (
        <span>{t("submission.notMyProblem")}</span>
      ) : isLoading ? (
        <Spinner />
      ) : !data ? (
        <ErrorPanel />
      ) : (
        <>
          <div className="flex w-full justify-between">
            <span>
              {t("submission.execMemory")} :{" "}
              {prettyBytes((data?.memory || 0) * 1024, {
                binary: true,
              })}
            </span>
            <span>
              {`${t("submission.execTime")} : ${data?.time} ${t(
                "problem.view.seconds",
              )}`}
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
