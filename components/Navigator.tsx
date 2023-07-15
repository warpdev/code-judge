"use client";
import usePageIndex from "@/utils/hooks/usePageIndex";
import { useCallback } from "react";

const PageNavigator = () => {
  const { currentPage, changePage } = usePageIndex();
  const handleClick = useCallback(
    (page: number) => () => {
      changePage(page);
    },
    [changePage],
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="rounded bg-neutral-100 p-2 dark:bg-neutral-800"
        onClick={handleClick(currentPage - 1)}
      >
        Prev
      </button>
      <span>{currentPage}</span>
      <button
        className="rounded bg-neutral-100 p-2 dark:bg-neutral-800"
        onClick={handleClick(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigator;
