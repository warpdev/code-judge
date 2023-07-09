"use client";

import { Editor } from "@monaco-editor/react";
import { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import useStorage from "@/utils/hooks/useStorage";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { useDebouncedCallback } from "use-debounce";

const CodeEditor = (
  {
    storeKey,
    language,
    theme,
    setEditor,
  }: {
    storeKey?: string;
    language: string;
    theme: string;
    setEditor: (editor: any) => void;
  },
  ref: ForwardedRef<any>
) => {
  const {
    storedValue: content,
    setValue: setContent,
    isLoading,
    rawGet,
  } = useStorage<string>(storeKey || "temp.code");

  function handleEditorDidMount(editor: IStandaloneCodeEditor) {
    // @ts-ignore
    ref.current = editor;
    setEditor(editor);
    rawGet().then((value) => {
      editor.setValue(value || "");
    });
  }

  const handleChange = useDebouncedCallback((value?: string) => {
    if (!isLoading) {
      setContent(value || "");
    }
  }, 1000);

  return (
    <div className="min-h-0 min-w-0 flex-1">
      <Editor
        options={{
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
        }}
        language={language}
        theme={theme}
        onMount={handleEditorDidMount}
        onChange={handleChange}
      />
    </div>
  );
};

export default forwardRef(CodeEditor);
