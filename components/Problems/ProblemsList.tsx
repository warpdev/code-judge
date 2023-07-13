"use client";
import { twJoin } from "tailwind-merge";
import { actionNeutral, actionToDark, roundButton } from "@/style/baseStyle";
import Link from "next/link";
import { Problem } from "@prisma/client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { IProblemFilter } from "@/types/common";
import ProblemFilterModal from "@/components/Modal/ProblemFilterModal";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import ProblemFilterView from "@/components/Problems/ProblemFilterView";
import { motion } from "framer-motion";

const makeParams = (filter: Record<keyof IProblemFilter, string | null>) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params;
};

const ProblemsList = ({
  initData,
  locale,
}: {
  initData: Problem[];
  locale: string;
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    if (page) {
      return +page - 1;
    } else {
      return 0;
    }
  }, [searchParams]);

  const currentFilter: Record<keyof IProblemFilter, string | null> =
    useMemo(() => {
      const localeParam = searchParams.get("locale") || locale;
      return {
        locale: localeParam,
      };
    }, [locale, searchParams]);

  const { data: problems } = useSWR<Problem[]>(
    `/api/problem?${makeParams(currentFilter)}&page=${currentPage}`,
    {
      fallbackData: initData,
    },
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="mt-8 flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <ProblemFilterView currentFilter={currentFilter} />
        <motion.span
          layoutId="filter-open-button"
          layout="position"
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
        >
          <button
            className={twJoin(
              roundButton,
              "rounded-full",
              "border border-neutral-400",
              actionNeutral,
            )}
            onClick={() => setIsFilterOpen(true)}
          >
            {t("problem.filter")}
          </button>
        </motion.span>
      </div>
      <ul className="flex flex-col">
        {problems?.map((problem) => (
          <li
            key={problem.id}
            className={twJoin(
              "px-1 py-2",
              "border-b border-neutral-400 first:border-t",
              actionNeutral,
              "hover:opacity-80",
            )}
          >
            <Link className="block w-full" href={`/problems/${problem.id}`}>
              {problem.title}
            </Link>
          </li>
        ))}
      </ul>
      <AnimatePresence key="modal-problem">
        {isFilterOpen && (
          <ProblemFilterModal
            currentFilter={currentFilter}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProblemsList;
