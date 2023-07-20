import "server-only";
import { JUDGE_API_URL } from "@/constants/common";
import { ITestSet } from "@/types/common";
import { IJudgeFullStatus, IJudgeStatus } from "@/types/judge";

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
  timeLimit,
  memoryLimit,
}: {
  langId: number;
  code: string;
  testSets: ITestSet[];
  timeLimit: number;
  memoryLimit: number;
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
          cpu_time_limit: timeLimit / 1000,
          memory_limit: memoryLimit * 1024,
        })),
      }),
    },
  );

  return tokens.map((token) => token.token);
};

export const getBatchSubmission = async (
  tokens: string[],
  fullFields = false,
): Promise<{
  submissions: IJudgeStatus[];
}> => {
  const submissions = await fetchJudgeApi<{
    submissions: IJudgeStatus[];
  }>(
    `/submissions/batch?tokens=${tokens.join(
      ",",
    )}&base64_encoded=true&fields=status,token${
      fullFields ? ",stdout,stdin,time,memory" : ""
    }`,
    {
      next: {
        revalidate: 30,
      },
    },
  );
  return submissions;
};

export const getDetailSubmission = async (
  token: string,
): Promise<IJudgeFullStatus> => {
  const submission = await fetchJudgeApi<IJudgeFullStatus>(
    `/submissions/${token}?base64_encoded=true&fields=status,token,stdin,stdout,time,memory`,
    {
      next: {
        revalidate: 30,
      },
    },
  );
  return submission;
};

export const runCode = async ({
  langId,
  code,
  input,
}: {
  langId: number;
  code: string;
  input: string;
}) => {
  const { stdout } = await fetchJudgeApi<{ stdout: string }>(
    "/submissions?base64_encoded=true&wait=true&fields=stdout",
    {
      method: "POST",
      body: JSON.stringify({
        language_id: langId,
        source_code: btoa(code),
        stdin: btoa(input),
      }),
    },
  );
  return atob(stdout);
};
