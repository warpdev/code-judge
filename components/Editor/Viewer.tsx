"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { TiptapEditorProps, TiptapExtensions } from "@/lib/editorConfigs";

const Viewer = ({ value }: { value: any }) => {
  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {},
    content: value,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default Viewer;
