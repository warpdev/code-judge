"use client";
import { ILanguage } from "@/types/common";
import CodeEditor from "@/components/CodeEditor";
import { useCallback, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import { submitProblem } from "@/utils/judgeClientUtils";
import { useParams, useRouter } from "next/navigation";
import ExtraInfoPanel from "@/components/Problems/SubmitProblem/ExtraInfoPanel";
import { Hint } from "@prisma/client";
import { useTranslations } from "next-intl";
import { greenButton } from "@/style/baseComponent";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import dynamic from "next/dynamic";

const SettingPanel = dynamic(
  () => import("@/components/Problems/SubmitProblem/SettingPanel"),
  {
    ssr: false,
  },
);

const SubmitPagePanel = ({
  availableLangs,
  savedHints,
}: {
  availableLangs: ILanguage[];
  savedHints: Hint[];
}) => {
  const t = useTranslations("solving");
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<ILanguage>(
    "currentLanguage",
    availableLangs.findLast((lang) => lang.monacoLanguage === "python") ||
      availableLangs[0],
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
    const { id: sid } = await submitProblem(
      id as string,
      code,
      currentLanguage.id,
    );
    router.push(`/submissions/${sid}`);
  }, [currentLanguage.id, id, router]);

  return (
    <div className="flex h-full flex-col gap-4">
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
      <button onClick={handleSubmission} className={greenButton}>
        {t("submit")}
      </button>
      <ExtraInfoPanel savedHints={savedHints} editor={editor} />
    </div>
  );
};

export default SubmitPagePanel;
