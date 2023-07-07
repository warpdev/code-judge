export const makeHintUserPrompt = (
  problem: string,
  code: string,
  inputFormat: string,
  outputFormat: string
) => {
  return `문제: ${problem.replaceAll(
    "\\n",
    "\n"
  )}\n\n현재 코드: ${code.replaceAll(
    "\\n",
    "\n"
  )}\n\n입력 전제 조건: ${inputFormat.replaceAll(
    "\\n",
    "\n"
  )}\n\n출력 형식: ${outputFormat.replaceAll("\\n", "\n")}\n\n`;
};
