"use client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoveUpRight } from "lucide-react";
import { greenButton } from "@/style/baseComponent";

const OpenSubmitButton = ({ id }: { id: string }) => {
  const [submitWindow, setSubmitWindow] = useState<Window | null>(null);
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (submitWindow && !submitWindow.closed) {
      submitWindow.focus();
      return;
    }
    setSubmitWindow(
      window.open(`/problems/${id}/submit`, "_blank", "width=1200,height=800"),
    );
  }, [id, submitWindow]);

  const messageHandler = useCallback(
    (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data === "submitted") {
        router.push("/submissions");
      }
    },
    [router],
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
      className={twMerge(greenButton, "flex items-center")}
    >
      Start Coding!
      <MoveUpRight className="h-4 w-4" />
    </button>
  );
};

export default OpenSubmitButton;
