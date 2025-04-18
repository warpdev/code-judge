"use client";

import { twJoin, twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import { Problem } from "@prisma/client";
import Viewer from "@/components/Editor/Viewer";
import { actionNeutral, actionToDark, baseTabButton } from "@/style/baseStyle";
import { FileInput, FileOutput, FileText } from "lucide-react";

const tabButton = twJoin(baseTabButton, "border-l-0 rounded-l-none");

const monoContent = twJoin(
  "rounded-md border-2 border-neutral-600 p-2",
  "bg-neutral-900 text-neutral-50",
  "font-mono whitespace-pre",
);

const ProblemInfoPanel = ({ problem }: { problem: Problem }) => {
  const [currentTab, setCurrentTab] = useState<string | undefined>(
    "description",
  );

  const handleClick = useCallback(
    (tab: string) => () => {
      setCurrentTab((prev) => (prev === tab ? undefined : tab));
    },
    [],
  );

  return (
    <aside
      className={twJoin("fixed bottom-0 left-0 top-0 z-10", "hidden md:flex")}
    >
      <div
        className={twMerge(
          "h-full w-[360px]",
          "border-r border-neutral-700 bg-neutral-100",
          "overflow-y-auto transition-all",
          "px-2 py-4",
          "dark:bg-neutral-900",
          currentTab ? "ml-0" : "-ml-[360px]",
        )}
      >
        {currentTab === "inputFormat" || currentTab === "outputFormat" ? (
          <div className="flex flex-col gap-4">
            <span>
              <Viewer value={problem[currentTab]} />
            </span>
            <span className="h-0.5 w-full bg-neutral-400 dark:bg-neutral-700" />
            <span className={monoContent}>
              {
                problem[
                  currentTab === "inputFormat" ? "sampleInput" : "sampleOutput"
                ]
              }
            </span>
          </div>
        ) : (
          <Viewer value={problem.description} />
        )}
      </div>
      <ul className="space-y-2 py-2">
        <li>
          <button className={tabButton} onClick={handleClick("description")}>
            <FileText className="m-auto h-4 w-4" />
          </button>
        </li>
        <li>
          <button className={tabButton} onClick={handleClick("inputFormat")}>
            <FileInput className="m-auto h-4 w-4" />
          </button>
        </li>
        <li>
          <button className={tabButton} onClick={handleClick("outputFormat")}>
            <FileOutput className="m-auto h-4 w-4" />
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default ProblemInfoPanel;
