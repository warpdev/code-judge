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

export type IInputContent<T = string> = {
  id: T;
  inputMode?: "text" | "numeric";
  //TODO: has hint
  hasHint?: boolean;
  hasPlaceholder?: boolean;
  options: RegisterOptions;
  className?: string;
  allowDecimal?: boolean;
} & IInputType;

export interface IInputExtraData {
  id: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: React.ReactNode;
}
