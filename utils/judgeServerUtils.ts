import { JUDGE_API_URL } from "@/constants/common";

const JUDGE_HEADER = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": process.env.JUDGE_API_KEY || "",
  "X-RapidAPI-Host": process.env.JUDGE_HOST || "",
};

export const fetchJudgeApi = async (url: string, options?: RequestInit) => {
  const response = await fetch(JUDGE_API_URL + url, {
    headers: JUDGE_HEADER,
    ...options,
  });
  return response.json();
};

export const getAvailableLanguages = async () => {
  const response = await fetchJudgeApi("/languages", {});
  return response;
};

/**
 * submit problem to judge0 api
 * @param langId
 * @param code
 * @param input
 * @param output
 * @returns token
 */
export const postSubmission = async ({
  langId,
  code,
  input,
  output,
}: {
  langId: number;
  code: string;
  input: string;
  output: string;
}): Promise<string> => {
  const { token } = await fetchJudgeApi(
    "/submissions?base64_encoded=true&fields=*",
    {
      method: "POST",
      body: JSON.stringify({
        language_id: langId,
        source_code: btoa(code),
        stdin: btoa(input),
        expected_output: btoa(output),
      }),
    }
  );
  return token;
};
