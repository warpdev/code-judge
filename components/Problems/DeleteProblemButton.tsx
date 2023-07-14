"use client";
import { Problem } from "@prisma/client";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import DeleteProblemModal from "@/components/Modal/DeleteProblemModal";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { redButton } from "@/style/baseComponent";

const DeleteProblemButton = ({
  locale,
  problem,
}: {
  locale: string;
  problem: Problem;
}) => {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={redButton} onClick={() => setIsModalOpen(true)}>
        {t("delete")}
      </button>
      <AnimatePresence>
        {isModalOpen && (
          <DeleteProblemModal
            problem={problem}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteProblemButton;
