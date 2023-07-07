"use client";
import { ILanguage } from "@/types/common";
import SettingPanel from "@/components/Problems/SubmitProblem/SettingPanel";
import CodeEditor from "@/components/CodeEditor";
import { useCallback, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import { submitProblem } from "@/utils/judgeClientUtils";
import { useParams } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";
import { actionOpacity, roundButton } from "@/style/baseStyle";
import { useChat, useCompletion } from "ai/react";
import { toast } from "sonner";

const SubmitPagePanel = ({
  availableLangs,
}: {
  availableLangs: ILanguage[];
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
    availableLangs.find((lang) => lang.monacoLanguage === "python") ||
      availableLangs[0]
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const { id } = useParams();

  const { isLoading, setInput, completion, complete } = useCompletion({
    id: "hint",
    api: "/api/generate/hint",
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

  const handleSubmission = useCallback(async () => {
    const code = editorRef.current?.getValue();
    if (!code) return;
    const { id: sid } = await submitProblem(id, code, currentLanguage.id);
    window.opener?.postMessage("submitted", window.location.origin);
    window.close();
  }, [currentLanguage.id, id]);

  const handleGetHint = useCallback(async () => {
    const code = editorRef.current?.getValue();
    if (!code) return;
    await complete(code);
  }, [complete]);

  return (
    <div className="flex flex-col gap-8">
      <SettingPanel
        allLanguages={availableLangs}
        currentLanguage={currentLanguage}
        setLanguage={setCurrentLanguage}
      />
      <CodeEditor
        ref={editorRef}
        language={currentLanguage.monacoLanguage}
        defaultValue={`#include <iostream>`}
        theme="vs-dark"
      />
      <span>{completion}</span>
      <button
        onClick={handleGetHint}
        className={twMerge(
          roundButton,
          "bg-emerald-500 font-bold text-neutral-50",
          "px-4 py-2",
          actionOpacity
        )}
      >
        Get Hint
      </button>
      <button
        onClick={handleSubmission}
        className={twMerge(
          roundButton,
          "bg-emerald-500 font-bold text-neutral-50",
          "px-4 py-2",
          actionOpacity
        )}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitPagePanel;
