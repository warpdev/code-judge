import { Editor } from "@tiptap/core";
import { Check, Trash } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const LinkSelector: FC<LinkSelectorProps> = ({ editor, isOpen, setIsOpen }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-base">↗</p>
        <p
          className={twMerge(
            "underline decoration-stone-400 underline-offset-4",
            editor.isActive("link") && "text-blue-500"
          )}
        >
          Link
        </p>
      </button>
      {isOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            //@ts-ignore
            const input = e.target[0] as HTMLInputElement;
            editor.chain().focus().setLink({ href: input.value }).run();
            setIsOpen(false);
          }}
          className="animate-in fade-in slide-in-from-top-1 fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border border-stone-200 bg-white p-1 shadow-xl"
        >
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <button
              className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              <Trash className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default LinkSelector;
