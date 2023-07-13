import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const useCreateUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);

      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  return createQueryString;
};

export default useCreateUrl;
