export const makeHintUserPrompt = (
  problem: string,
  code: string,
  inputFormat: string,
  outputFormat: string,
) => {
  return `문제: ${problem.replaceAll(
    "\\n",
    "\n",
  )}\n\n현재 코드: ${code.replaceAll(
    "\\n",
    "\n",
  )}\n\n입력 전제 조건: ${inputFormat.replaceAll(
    "\\n",
    "\n",
  )}\n\n출력 형식: ${outputFormat.replaceAll("\\n", "\n")}\n\n`;
};

export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void,
) => {
  const value = e.target.value.replace(/\D+/g, "");
  e.target.value = value;
  setValue(e);
};
