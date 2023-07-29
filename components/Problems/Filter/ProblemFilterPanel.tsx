"use client";
import ProblemFilterView from "@/components/Problems/Filter/ProblemFilterView";
import { AnimatePresence, motion } from "framer-motion";
import { twJoin, twMerge } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ProblemFilterModal from "@/components/Modal/ProblemFilterModal";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";
import { BaseProps } from "@/types/common";

const ProblemFilterPanel = ({
  className,
  defaultLocal,
}: BaseProps & { defaultLocal: string }) => {
  const t = useTranslations();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { currentFilter } = useCurrentProblemQuery(defaultLocal);

  return (
    <div
      className={twMerge("flex flex-nowrap gap-3 overflow-x-auto", className)}
    >
      <ProblemFilterView currentFilter={currentFilter} />
      <motion.span
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
            "border border-neutral-400 dark:border-neutral-700",
            actionNeutral,
          )}
          onClick={() => setIsFilterOpen(true)}
        >
          {t("problem.view.filter")}
        </button>
      </motion.span>
      <AnimatePresence key="modal-problem">
        {isFilterOpen && (
          <ProblemFilterModal
            currentFilter={currentFilter}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProblemFilterPanel;
