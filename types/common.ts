import { RegisterOptions } from "react-hook-form/dist/types/validator";

export interface BaseProps {
  className?: string;
}

export interface ILanguage {
  id: number;
  name: string;
  monacoLanguage: string;
}

export interface IProblemInput {
  id: string;
  label: string;
  placeholder?: string;
  type: "multiline" | "text" | "number";
  inputMode?: "text" | "numeric";
  options: RegisterOptions;
}
