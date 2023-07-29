"use client";
import { BaseProps } from "@/types/common";
import { Lecture } from "@prisma/client";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import useSWR from "swr";
import { makeParams } from "@/utils/commonUtils";
import LectureCard from "@/components/Lecture/LectureCard";
import Link from "next-intl/link";
import { twJoin } from "tailwind-merge";

const LectureList = ({
  className,
  lectures: initData,
  locale,
}: BaseProps & {
  lectures: Lecture[];
  locale: string;
}) => {
  const { currentFilter, currentPage } = useCurrentProblemQuery(locale);

  const { data: lectures } = useSWR<Lecture[]>(
    `/api/lecture?${makeParams(currentFilter)}&page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );

  return (
    <ul className={twJoin("flex flex-col gap-4", className)}>
      {lectures?.map((lecture) => (
        <li key={lecture.id}>
          <Link href={`/lectures/${lecture.id}`}>
            <LectureCard lecture={lecture} className="cursor-pointer" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LectureList;
