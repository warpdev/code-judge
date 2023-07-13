import "server-only";
import { JUDGE_API_URL } from "@/constants/common";
import { ITestSet } from "@/types/common";
import { IJudgeStatus } from "@/types/judge";

const JUDGE_HEADER = {
  "Content-Type": "application/json",
  "X-Auth-Token": process.env.JUDGE_SECRET || "",
};

export const fetchJudgeApi = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
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
  const { token } = await fetchJudgeApi<{ token: string }>(
    "/submissions?base64_encoded=true&fields=*",
    {
      method: "POST",
      body: JSON.stringify({
        language_id: langId,
        source_code: btoa(code),
        stdin: btoa(input),
        expected_output: btoa(output),
      }),
    },
  );
  return token;
};

export const postBatchSubmission = async ({
  langId,
  code,
  testSets,
}: {
  langId: number;
  code: string;
  testSets: ITestSet[];
}): Promise<string[]> => {
  const encodedCode = btoa(code);
  const tokens = await fetchJudgeApi<{ token: string }[]>(
    "/submissions/batch?base64_encoded=true&fields=*",
    {
      method: "POST",
      body: JSON.stringify({
        submissions: testSets.map((testSet) => ({
          language_id: langId,
          source_code: encodedCode,
          stdin: btoa(testSet.input),
          expected_output: btoa(testSet.output),
        })),
      }),
    },
  );
  return tokens.map((token) => token.token);
};

export const getBatchSubmission = async (
  tokens: string[],
): Promise<{
  submissions: IJudgeStatus[];
}> => {
  const submissions = await fetchJudgeApi<{
    submissions: IJudgeStatus[];
  }>(
    `/submissions/batch?tokens=${tokens.join(
      ",",
    )}&base64_encoded=true&fields=status,token`,
    {
      next: {
        revalidate: 30,
      },
    },
  );
  return submissions;
};
