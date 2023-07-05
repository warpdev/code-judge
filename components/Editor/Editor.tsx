"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { TiptapEditorProps, TiptapExtensions } from "@/lib/editorConfigs";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useStorage from "@/utils/hooks/useStorage";
import { EditorBubbleMenu } from "@/components/Editor/EditorBubbleMenu";

//TODO: add Syntax Highlighting
const Editor = ({
  id,
  onChange,
  readOnly,
}: {
  id: string;
  onChange: any;
  readOnly?: boolean;
}) => {
  const [content, setContent, isLoading] = useStorage(id);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    setContent(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      const selection = e.editor.state.selection;
      const lastTwo = e.editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n"
      );
      // if (lastTwo === "++" && !isLoading) {
      //   e.editor.commands.deleteRange({
      //     from: selection.from - 2,
      //     to: selection.from,
      //   });
      //   // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
      //   complete(e.editor.getText());
      //   // complete(e.editor.storage.markdown.getMarkdown());
      // } else {
      onChange(e.editor.getJSON());
      debouncedUpdates(e);
      // }
    },
    autofocus: "end",
  });

  useEffect(() => {
    if (editor && content && !isLoading && !hydrated) {
      editor.commands.setContent(content);
      onChange(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated, isLoading, onChange]);

  useEffect(() => {
    if (editor && readOnly) {
      editor.setEditable(false);
    }
  }, [editor, readOnly]);

  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
