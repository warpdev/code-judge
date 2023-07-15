import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { LOCALES } from "@/constants/common";

export type ILocale = (typeof LOCALES)[number];

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
  type: "multiline" | "text" | "number" | "editor";
  inputMode?: "text" | "numeric";
  options: RegisterOptions;
}

export interface ITestSet {
  input: string;
  output: string;
}

export interface IProblemFilter {
  locale: {
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  };
}
