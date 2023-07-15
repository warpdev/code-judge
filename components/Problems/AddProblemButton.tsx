import Link from "next/link";
import { useTranslations } from "next-intl";
import { violetButton } from "@/style/baseComponent";
import { BaseProps } from "@/types/common";
import { twMerge } from "tailwind-merge";
import { PlusCircle } from "lucide-react";
import { actionToDark, actionToLight, roundButton } from "@/style/baseStyle";

const AddProblemButton = ({ className }: BaseProps) => {
  const t = useTranslations("problem");

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
      <span className="hidden md:inline">{t("addProblem")}</span>
    </Link>
  );
};

export default AddProblemButton;
