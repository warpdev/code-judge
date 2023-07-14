"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { TiptapEditorProps, TiptapExtensions } from "@/lib/editorConfigs";
import { twMerge } from "tailwind-merge";

import { defaultEditor } from "@/style/baseComponent";

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

  return <EditorContent editor={editor} />;
};

export default Viewer;
