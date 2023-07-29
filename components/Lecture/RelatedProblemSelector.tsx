import { useFormContext } from "react-hook-form";
import { twJoin, twMerge } from "tailwind-merge";
import { actionNeutral, baseInput } from "@/style/baseStyle";
import { useDebouncedCallback } from "use-debounce";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { Problem } from "@prisma/client";
import Skeleton from "@/components/Shared/Skeleton";

const RelatedProblemSelector = ({ id }: { id: string }) => {
  const { setValue, getValues } = useFormContext();
  const [_searchText, setInnerSearchText] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data: problems, isLoading: _isLoading } = useSWR<Problem[]>(
    searchText && `/api/problem?search=${searchText}`,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const isLoading = _isLoading || _searchText !== searchText;

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    1000,
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInnerSearchText(e.target.value);
      handleSearch(e);
    },
    [handleSearch],
  );

  const handleClick = useCallback(
    (problem: Problem) => () => {
      const currentValue = getValues(id)?.filter(
        (p: Problem) => p.id !== problem.id,
      );
      setValue(id, [...(currentValue ?? []), problem]);
      setInnerSearchText("");
    },
    [getValues, id, setValue],
  );

  return (
    <div className="relative flex w-full flex-col gap-2">
      <input
        id={id}
        type="text"
        className={twMerge(
          baseInput,
          "w-full border-2",
          "hover:bg-neutral-200 dark:hover:bg-neutral-700",
          "peer",
        )}
        onChange={handleChange}
        value={_searchText}
      />
      <ul
        className={twMerge(
          "text-sm",
          "absolute left-0 top-full mt-2 w-full",
          "z-10",
          !_searchText && "hidden",
          "max-h-64",
        )}
      >
        {problems && problems.length > 0 ? (
          problems.map((problem) => (
            <li key={problem.id}>
              <button
                type="button"
                tabIndex={0}
                className={twJoin(
                  "w-full p-2 text-left",
                  "bg-neutral-100 dark:bg-neutral-900",
                  actionNeutral,
                )}
                onClick={handleClick(problem)}
              >
                {problem.title}
              </button>
            </li>
          ))
        ) : isLoading ? (
          <li
            className={twJoin(
              "w-full text-left",
              "bg-neutral-100 dark:bg-neutral-900",
            )}
          >
            <Skeleton className="h-[calc(1.5em+0.5rem)] bg-neutral-200 dark:bg-neutral-800" />
          </li>
        ) : (
          <li
            className={twJoin(
              "w-full p-2 text-left",
              "bg-neutral-100 dark:bg-neutral-900",
            )}
          >
            No results
          </li>
        )}
      </ul>
    </div>
  );
};

export default RelatedProblemSelector;
