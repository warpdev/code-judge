"use client";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { twJoin } from "tailwind-merge";
import { actionNeutral, roundButton } from "@/style/baseStyle";
import { UserIcon } from "@/components/Icons";
import Link from "next/link";

const UserHeaderPanel = ({ user }: { user?: Session["user"] }) => {
  if (user) {
    return (
      <>
        <Link
          className={twJoin(roundButton, actionNeutral, "flex gap-1")}
          href="/profile"
        >
          <UserIcon />
          <span>{user.name}</span>
        </Link>
      </>
    );
  }
  return (
    <>
      <button
        className={twJoin(roundButton, actionNeutral)}
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
};

export default UserHeaderPanel;
