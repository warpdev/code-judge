export const submitProblem = async (
  pid: string,
  code: string,
  langId: number
) => {
  const response = await fetch(`/api/problem/${pid}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, langId }),
  });

  return response.json();
};
