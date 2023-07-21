import { PROMPTS } from "@/constants/prompts";
import { ILocale, IProblemFilter } from "@/types/common";
import { isAxiosError } from "axios";

export const makeHintUserPrompt = (
  locale: ILocale,
  problem: string,
  code: string,
  inputFormat: string,
  outputFormat: string,
) => {
  const prompt = PROMPTS.user[locale];
  return `${prompt.problem}: ${problem.replaceAll("\\n", "\n")}\n\n${
    prompt.code
  }: ${code.replaceAll("\\n", "\n")}\n\n${
    prompt.input
  }: ${inputFormat.replaceAll("\\n", "\n")}\n\n${
    prompt.output
  }: ${outputFormat.replaceAll("\\n", "\n")}\n\n`;
};

export const makeAutoInputPrompt = (
  locale: ILocale,
  problem: string,
  inputFormat: string,
) => {
  const prompt = PROMPTS.user[locale];
  return `${prompt.problem}: ${problem.replaceAll("\\n", "\n")}\n\n${
    prompt.input
  }: ${inputFormat.replaceAll("\\n", "\n")}\n\n`;
};

export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void,
  allowDecimal: boolean = false,
) => {
  const regex = allowDecimal ? /[^\d.]/g : /[^\d]/g;
  const value = e.target.value.replace(regex, "").split(".", 2).join(".");
  e.target.value = value;
  setValue(e);
};

export const makeParams = (
  filter: Record<keyof IProblemFilter, string | null>,
) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params;
};

export const getScore = (
  statuses: {
    status: number;
  }[],
) => {
  return statuses.filter((s) => s.status === 3).length;
};

export const getErrorMessage = (error: any): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message;
  }
  return error.message;
};
