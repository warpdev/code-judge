"use client";
import { Problem } from "@prisma/client";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import DeleteProblemModal from "@/components/Modal/DeleteProblemModal";
import { AnimatePresence } from "framer-motion";

const DeleteProblemButton = ({ problem }: { problem: Problem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className={twJoin(
          roundButton,
          "bg-red-500 font-bold text-white",
          actionToDark
        )}
        onClick={() => setIsModalOpen(true)}
      >
        Delete
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
