import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const useCreateUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string | null | undefined) => {
      const params = new URLSearchParams(searchParams as any);
      if (value === null || value === undefined) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  return createQueryString;
};

export default useCreateUrl;
