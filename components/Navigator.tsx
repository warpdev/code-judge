"use client";
import usePageIndex from "@/utils/hooks/usePageIndex";
import { useCallback, useMemo } from "react";
import { BaseProps } from "@/types/common";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { useTranslations } from "next-intl";
import { PROBLEM_LIST_PAGE_SIZE } from "@/constants/common";

const Navigator = ({
  className,
  totalCount,
}: BaseProps & {
  totalCount?: number;
}) => {
  const t = useTranslations("common");
  const { currentPage, changePage } = usePageIndex();
  const handleClick = useCallback(
    (page: number) => () => {
      changePage(page);
    },
    [changePage],
  );

  const isLast = useMemo(() => {
    return !!totalCount && currentPage * PROBLEM_LIST_PAGE_SIZE >= totalCount;
  }, [currentPage, totalCount]);

  return (
    <div
      className={twMerge("flex items-center justify-center gap-3", className)}
    >
      <button
        className={twJoin(
          roundButton,
          "bg-neutral-100 dark:bg-neutral-800",
          actionToDark,
          "disabled:opacity-50",
        )}
        onClick={handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t("previous")}
      </button>
      <span
        className={twJoin(
          "flex items-center justify-center",
          "rounded border border-emerald-500",
          "h-8 w-8 text-center",
        )}
      >
        {currentPage}
      </span>
      <button
        className={twJoin(
          roundButton,
          "bg-neutral-100 dark:bg-neutral-800",
          actionToDark,
          "disabled:opacity-50",
        )}
        onClick={handleClick(currentPage + 1)}
        disabled={isLast}
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Navigator;
