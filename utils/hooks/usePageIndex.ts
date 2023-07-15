import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import useCreateUrl from "@/utils/hooks/useCreateUrl";

const usePageIndex = () => {
  const searchParams = useSearchParams();
  const createUrl = useCreateUrl();
  const router = useRouter();

  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    if (page && +page > 0) {
      return +page;
    } else {
      return 1;
    }
  }, [searchParams]);

  const changePage = useCallback(
    (page: number) => {
      const url = createUrl("page", page.toString());
      router.push(url);
    },
    [createUrl, router],
  );

  return {
    currentPage,
    changePage,
  };
};

export default usePageIndex;
