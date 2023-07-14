"use client";
import ProblemFilterView from "@/components/Problems/Filter/ProblemFilterView";
import { AnimatePresence, motion } from "framer-motion";
import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ProblemFilterModal from "@/components/Modal/ProblemFilterModal";
import useCurrentProblemQuery from "@/utils/hooks/useCurrentProblemQuery";

const ProblemFilterPanel = ({ defaultLocal }: { defaultLocal: string }) => {
  const t = useTranslations();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { currentFilter } = useCurrentProblemQuery(defaultLocal);

  return (
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
            "border border-neutral-400 dark:border-neutral-700",
            actionNeutral,
          )}
          onClick={() => setIsFilterOpen(true)}
        >
          {t("problem.filter")}
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
