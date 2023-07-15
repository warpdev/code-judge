"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { TiptapEditorProps, TiptapExtensions } from "@/lib/editorConfigs";
import { twMerge } from "tailwind-merge";

import { defaultEditor } from "@/style/baseComponent";
import { useEffect } from "react";

const Viewer = ({ value }: { value: any }) => {
  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: {
      ...TiptapEditorProps,
      attributes: {
        class: twMerge(
          defaultEditor,
          "border-none bg-transparent dark:bg-transparent",
        ),
      },
    },
    content: value,

    editable: false,
  });

  useEffect(() => {
    editor?.commands.setContent(value);
  }, [editor?.commands, value]);

  return <EditorContent editor={editor} />;
};

export default Viewer;
