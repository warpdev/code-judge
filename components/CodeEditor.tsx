"use client";

import { Editor, EditorProps } from "@monaco-editor/react";
import { ForwardedRef, forwardRef } from "react";
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
    options,
    value,
    ...props
  }: {
    storeKey?: string;
    language: string;
    theme?: string;
    setEditor?: (editor: any) => void;
  } & EditorProps,
  ref: ForwardedRef<any>,
) => {
  const {
    storedValue: content,
    setValue: setContent,
    isLoading,
    rawGet,
  } = useStorage<string>(storeKey || "temp.code");

  function handleEditorDidMount(editor: IStandaloneCodeEditor) {
    if (ref) {
      // @ts-ignore
      ref.current = editor;
    }
    setEditor && setEditor(editor);
    if (!value) {
      rawGet().then((value) => {
        editor.setValue(value || "");
      });
    }
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
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
          ...options,
        }}
        language={language}
        theme={theme}
        onMount={handleEditorDidMount}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default forwardRef(CodeEditor);
