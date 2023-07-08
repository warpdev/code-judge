"use client";
import { Problem } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { Edit3 } from "lucide-react";
import { useState } from "react";
import EditTestcaseModal from "@/components/Modal/EditTestcaseModal";
import { AnimatePresence } from "framer-motion";

const TestcaseRow = ({
  problem,
  caseNumber,
}: {
  problem: Problem;
  caseNumber: number;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <button
        className={twMerge(
          roundButton,
          "bg-neutral-100 px-2 py-2 text-lg font-bold",
          "flex w-full items-center justify-between gap-4",
          actionToDark
        )}
        onClick={handleClick}
      >
        <span>Set #{caseNumber}</span>
        <Edit3 className="h-6 w-6 text-neutral-300 transition group-hover:text-neutral-400" />
      </button>
      <AnimatePresence>
        {openModal && (
          <EditTestcaseModal
            onClose={() => {
              setOpenModal(false);
            }}
            problem={problem}
            caseNumber={caseNumber - 1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TestcaseRow;
