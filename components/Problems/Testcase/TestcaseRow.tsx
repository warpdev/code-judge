"use client";
import { Problem } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { Edit3, Plus } from "lucide-react";
import { useState } from "react";
import EditTestcaseModal from "@/components/Modal/EditTestcaseModal";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const TestcaseRow = ({
  problem,
  caseNumber,
  isNew = false,
}: {
  problem: Problem;
  caseNumber: number;
  isNew?: boolean;
}) => {
  const t = useTranslations("testcase");
  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <button
        className={twMerge(
          roundButton,
          "rounded-full",
          "bg-neutral-100 dark:bg-neutral-800",
          "px-4 py-2 text-lg font-bold",
          "flex w-full items-center justify-between gap-4",
          actionToDark,
          isNew && "justify-center bg-violet-500 text-white",
        )}
        onClick={handleClick}
      >
        {isNew && <Plus className="h-6 w-6" />}
        {isNew ? (
          <span>{t("addTestCase")}</span>
        ) : (
          <span>Set #{caseNumber}</span>
        )}
        {!isNew && (
          <Edit3 className="h-6 w-6 text-neutral-300 transition group-hover:text-neutral-400" />
        )}
      </button>
      <AnimatePresence>
        {openModal && (
          <EditTestcaseModal
            onClose={() => {
              setOpenModal(false);
            }}
            problem={problem}
            caseNumber={caseNumber - 1}
            isNew={isNew}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TestcaseRow;
