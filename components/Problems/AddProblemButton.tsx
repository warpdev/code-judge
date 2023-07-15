import Link from "next/link";
import { violetButton } from "@/style/baseComponent";
import { BaseProps } from "@/types/common";
import { twMerge } from "tailwind-merge";
import { PlusCircle } from "lucide-react";

const AddProblemButton = ({
  className,
  buttonText,
}: BaseProps & {
  buttonText: string;
}) => {
  return (
    <Link
      href={"/problems/add"}
      className={twMerge(
        violetButton,
        "dark:bg-neutral-800",
        "dark:hover:bg-neutral-600",
        className,
      )}
    >
      <PlusCircle className="inline-block h-5 w-5 md:hidden" />
      <span className="hidden md:inline">{buttonText}</span>
    </Link>
  );
};

export default AddProblemButton;
