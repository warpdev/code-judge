import { PROMPTS } from "@/constants/prompts";
import { ILocale } from "@/types/common";

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

export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void,
) => {
  const value = e.target.value.replace(/\D+/g, "");
  e.target.value = value;
  setValue(e);
};
