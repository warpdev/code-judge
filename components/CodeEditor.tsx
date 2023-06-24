"use client";

import { Editor } from "@monaco-editor/react";
import { ForwardedRef, forwardRef, useRef } from "react";

const CodeEditor = (
  {
    defaultValue,
    language,
    theme,
  }: {
    defaultValue?: string;
    language: string;
    theme: string;
  },
  ref: ForwardedRef<any>
) => {
  function handleEditorDidMount(editor: any) {
    // @ts-ignore
    ref.current = editor;
  }

  return (
    <Editor
      height="80vh"
      language={language}
      defaultValue={defaultValue}
      theme={theme}
      onMount={handleEditorDidMount}
    />
  );
};

export default forwardRef(CodeEditor);
