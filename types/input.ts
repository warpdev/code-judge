import { RegisterOptions } from "react-hook-form/dist/types/validator";

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

export type IProblemInput = {
  id: string;
  label: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  options: RegisterOptions;
  className?: string;
} & IInputType;
