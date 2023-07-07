"use client";

import { twJoin, twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import { actionNeutral, actionToDark, roundButton } from "@/style/baseStyle";
import { Lightbulb, Plus } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { editor } from "monaco-editor";
import { useParams } from "next/navigation";
import type { Hint } from "@prisma/client";

const tabButton = twJoin(
  "w-10 h-10 bg-neutral-100",
  "rounded-md border-2 border-neutral-400 border-r-0 rounded-r-none",
  actionNeutral
);

const ExtraInfoPanel = ({
  editor,
  savedHints,
}: {
  editor?: editor.IStandaloneCodeEditor;
  savedHints: Hint[];
}) => {
  const [currentTab, setCurrentTab] = useState<string | undefined>(undefined);
  const { id } = useParams();

  const handleClick = useCallback(
    (tab: string) => () => {
      setCurrentTab((prev) => (prev === tab ? undefined : tab));
    },
    []
  );

  const { completion, complete } = useCompletion({
    id: "hint",
    api: `/api/problem/${id}/hint`,
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const handleGetHint = useCallback(async () => {
    const code = editor?.getValue();
    if (!code) return;
    await complete(code);
  }, [complete, editor]);

  return (
    <aside className={twJoin("fixed bottom-0 right-0 top-0 z-10", "flex")}>
      <ul className="py-2">
        <li>
          <button className={tabButton} onClick={handleClick("hint")}>
            <Lightbulb className="m-auto h-4 w-4" />
          </button>
        </li>
      </ul>
      <div
        className={twMerge(
          "h-full w-[300px]",
          "border-l border-neutral-700 bg-neutral-100",
          "overflow-y-auto transition-all",
          "px-2 py-4",
          currentTab ? "mr-0" : "-mr-[300px]"
        )}
      >
        <ul className="flex flex-col gap-2">
          {savedHints.map((hint) => (
            <li
              className="rounded border border-neutral-600 bg-neutral-50 p-4 shadow-sm"
              key={hint.id}
            >
              {hint.content}
            </li>
          ))}
          {completion && (
            <li className="rounded border border-neutral-600 bg-neutral-50 p-4 shadow-lg">
              {completion}
            </li>
          )}
        </ul>
        <button
          className={twJoin(
            roundButton,
            "bg-neutral-200",
            actionToDark,
            "flex w-full items-center justify-center gap-1 px-3 py-2",
            "mt-6"
          )}
          onClick={handleGetHint}
        >
          <Plus className="h-4 w-4" />
          <span>Get a new hint</span>
        </button>
      </div>
    </aside>
  );
};

export default ExtraInfoPanel;
