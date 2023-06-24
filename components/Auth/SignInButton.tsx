"use client";

import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { signIn } from "next-auth/react";
import { BaseProps } from "@/types/common";

const SignInButton = ({
  className,
  callbackUrl,
}: BaseProps & {
  callbackUrl?: string;
}) => {
  return (
    <>
      <button
        className={twJoin(roundButton, actionNeutral, className)}
        onClick={() => signIn(undefined, { callbackUrl })}
      >
        Sign In
      </button>
    </>
  );
};

export default SignInButton;
