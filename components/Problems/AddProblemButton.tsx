import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { useTranslations } from "next-intl";

const AddProblemButton = () => {
  const t = useTranslations("problem");
  return (
    <Link
      href={"/problems/add"}
      className={twJoin(
        roundButton,
        "bg-violet-500 font-bold text-white",
        actionToDark,
      )}
    >
      {t("addProblem")}
    </Link>
  );
};

export default AddProblemButton;
