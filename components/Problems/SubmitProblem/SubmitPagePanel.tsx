"use client";
import { ILanguage } from "@/types/common";
import SettingPanel from "@/components/Problems/SubmitProblem/SettingPanel";
import CodeEditor from "@/components/CodeEditor";
import { useCallback, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import { submitProblem } from "@/utils/judgeClientUtils";
import { useParams, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { actionOpacity, roundButton } from "@/style/baseStyle";
import ExtraInfoPanel from "@/components/Problems/SubmitProblem/ExtraInfoPanel";
import { Hint } from "@prisma/client";

const SubmitPagePanel = ({
  availableLangs,
  savedHints,
}: {
  availableLangs: ILanguage[];
  savedHints: Hint[];
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
    availableLangs.find((lang) => lang.monacoLanguage === "python") ||
      availableLangs[0]
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const { id } = useParams();

  const router = useRouter();

  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >();

  const handleSubmission = useCallback(async () => {
    const code = editorRef.current?.getValue();
    if (!code) return;
    const { id: sid } = await submitProblem(id, code, currentLanguage.id);
    router.push(`/submissions/${sid}`);
  }, [currentLanguage.id, id, router]);

  return (
    <div className="flex flex-col gap-8">
      <SettingPanel
        allLanguages={availableLangs}
        currentLanguage={currentLanguage}
        setLanguage={setCurrentLanguage}
      />
      <CodeEditor
        setEditor={setEditor}
        ref={editorRef}
        language={currentLanguage.monacoLanguage}
        storeKey={`${id}.code`}
        theme="vs-dark"
      />
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
      <ExtraInfoPanel savedHints={savedHints} editor={editor} />
    </div>
  );
};

export default SubmitPagePanel;
