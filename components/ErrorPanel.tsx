"use client";
import { BaseProps } from "@/types/common";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

const ErrorPanel = ({
  className,
  errorMessage,
}: BaseProps & { errorMessage?: string }) => {
  const t = useTranslations("error");
  return (
    <p
      className={twMerge(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      {errorMessage ? (
        <span className="text-red-500">{errorMessage}</span>
      ) : (
        <span className="text-red-500">{t("default")}</span>
      )}
    </p>
  );
};

export default ErrorPanel;
