"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OpenSubmitButton = ({ id }: { id: string }) => {
  const [submitWindow, setSubmitWindow] = useState<Window | null>(null);
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (submitWindow) {
      submitWindow.focus();
      return;
    }
    setSubmitWindow(
      window.open(`/problems/${id}/submit`, "_blank", "width=1200,height=800")
    );
  }, [id, submitWindow]);

  const messageHandler = useCallback(
    (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data === "submitted") {
        router.push("/submissions");
      }
    },
    [router]
  );

  useEffect(() => {
    if (!submitWindow) return;
    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [messageHandler, submitWindow]);

  return (
    <button
      onClick={handleClick}
      className={twMerge(
        roundButton,
        "bg-emerald-500 font-bold text-neutral-50",
        "px-4 py-2",
        actionToDark
      )}
    >
      Start Coding!
    </button>
  );
};

export default OpenSubmitButton;
