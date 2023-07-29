import { RegisterOptions } from "react-hook-form";

type IInputType =
  | {
      type: "multiline" | "text" | "number" | "editor";
    }
  | {
      type: "select";
      selectOptions: {
        label: string;
        value: string;
      }[];
    };

export type IInputContent = {
  id: string;
  inputMode?: "text" | "numeric";
  hasPlaceholder?: boolean;
  options: RegisterOptions;
  className?: string;
  allowDecimal?: boolean;
} & IInputType;
