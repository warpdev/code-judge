import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { useTranslations } from "next-intl";
import { violetButton } from "@/style/baseComponent";

const AddProblemButton = () => {
  const t = useTranslations("problem");
  return (
    <Link href={"/problems/add"} className={violetButton}>
      {t("addProblem")}
    </Link>
  );
};

export default AddProblemButton;
