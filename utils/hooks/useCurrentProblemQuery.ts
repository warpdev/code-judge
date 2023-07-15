"use client";
import { useSearchParams } from "next/navigation";
import { IProblemFilter } from "@/types/common";
import { useMemo } from "react";

const useCurrentProblemQuery = (defaultLocal: string) => {
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    if (page) {
      return +page;
    } else {
      return 1;
    }
  }, [searchParams]);

  const currentFilter: Record<keyof IProblemFilter, string | null> =
    useMemo(() => {
      const localeParam = searchParams.get("locale") || defaultLocal;
      return {
        locale: localeParam,
      };
    }, [defaultLocal, searchParams]);

  return {
    currentFilter,
    currentPage,
  };
};

export default useCurrentProblemQuery;
