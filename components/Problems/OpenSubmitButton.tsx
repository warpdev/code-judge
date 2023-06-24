"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";

const OpenSubmitButton = ({ id }: { id: string }) => {
  const handleClick = () => {
    window.open(`/problems/${id}/submit`, "_blank", "width=1200,height=800");
  };

  return (
    <button
      onClick={handleClick}
      className={twMerge(
        roundButton,
        "bg-emerald-500 font-bold text-neutral-50",
        "px-4 py-2",
        actionToDark
      )}
    >
      Start Coding!
    </button>
  );
};

export default OpenSubmitButton;
