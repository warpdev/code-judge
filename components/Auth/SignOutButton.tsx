"use client";

import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { signOut } from "next-auth/react";
import { BaseProps } from "@/types/common";
import { useTranslations } from "next-intl";

const SignOutButton = ({
  locale,
  className,
  callbackUrl,
}: BaseProps & {
  locale: string;
  callbackUrl?: string;
}) => {
  const t = useTranslations("common");
  return (
    <>
      <button
        className={twJoin(roundButton, actionNeutral, className)}
        onClick={() => signOut({ callbackUrl })}
      >
        {t("signOut")}
      </button>
    </>
  );
};

export default SignOutButton;
