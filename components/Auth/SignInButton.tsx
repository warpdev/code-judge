"use client";

import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { signIn } from "next-auth/react";
import { BaseProps } from "@/types/common";
import { useTranslations } from "next-intl";

const SignInButton = ({
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
        onClick={() => signIn(undefined, { callbackUrl })}
      >
        {t("signIn")}
      </button>
    </>
  );
};

export default SignInButton;
