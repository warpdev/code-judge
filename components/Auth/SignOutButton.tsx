"use client";

import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { signOut } from "next-auth/react";
import { BaseProps } from "@/types/common";

const SignOutButton = ({ className }: BaseProps) => {
  return (
    <>
      <button
        className={twJoin(roundButton, actionNeutral, className)}
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </>
  );
};

export default SignOutButton;
