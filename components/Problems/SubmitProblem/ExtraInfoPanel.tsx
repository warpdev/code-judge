"use client";

import { twJoin, twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import {
  actionNeutral,
  actionToDark,
  baseTabButton,
  roundButton,
} from "@/style/baseStyle";
import { Lightbulb, Plus } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { editor } from "monaco-editor";
import { useParams } from "next/navigation";
import type { Hint } from "@prisma/client";
import useSWR from "swr";
import { useTranslations } from "next-intl";

const tabButton = twJoin(baseTabButton, "border-r-0 rounded-r-none");

const hintCard = twJoin(
  "rounded border border-neutral-600 bg-neutral-50 p-4 shadow-md",
  "dark:bg-neutral-900",
);

const ExtraInfoPanel = ({
  editor,
  savedHints,
}: {
  editor?: editor.IStandaloneCodeEditor;
  savedHints: Hint[];
}) => {
  const t = useTranslations("solving");
  const [currentTab, setCurrentTab] = useState<string | undefined>(undefined);
  const { id } = useParams();
  const { data: hints, mutate } = useSWR<Hint[]>(
    `/api/problem/${id}/hint`,
    null,
    {
      fallbackData: savedHints,
    },
  );

  const handleClick = useCallback(
    (tab: string) => () => {
      setCurrentTab((prev) => (prev === tab ? undefined : tab));
    },
    [],
  );

  const { completion, complete, isLoading } = useCompletion({
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
    onFinish: () => {
      mutate(undefined, {
        optimisticData: (prev) => {
          return [...(prev || []), { content: completion, id: "temp" } as Hint];
        },
      });
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
          "dark:bg-neutral-900",
          currentTab ? "mr-0" : "-mr-[300px]",
        )}
      >
        <ul className="flex flex-col gap-2">
          {hints?.map((hint) => (
            <li className={hintCard} key={hint.id}>
              {hint.content}
            </li>
          ))}
          {completion && isLoading && (
            <li className={hintCard}>{completion}</li>
          )}
        </ul>
        <button
          className={twJoin(
            roundButton,
            "bg-neutral-200 dark:bg-neutral-800",
            actionToDark,
            "flex w-full items-center justify-center gap-1 px-3 py-2",
            "mt-6",
            "disabled:brightness-80",
          )}
          disabled={isLoading}
          onClick={handleGetHint}
        >
          <Plus className="h-4 w-4" />
          <span>{t("getNewHint")}</span>
        </button>
      </div>
    </aside>
  );
};

export default ExtraInfoPanel;
