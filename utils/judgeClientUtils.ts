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

export const getTextColor = (statusId: number) => {
  switch (statusId) {
    case 1: //In Queue
      return "text-neutral-400";
    case 2: //Processing
      return "text-orange-400";
    case 3: //Accepted
      return "text-green-400";
    case 4: //Wrong Answer
    case 5: //Time Limit Exceeded
    case 6: //Memory Limit Exceeded
    case 7: //Runtime Error
    case 8: //Runtime Error
    case 9: //Runtime Error
    case 10: //Runtime Error
    case 11: //Runtime Error
    case 12: //Runtime Error
    default:
      return "text-red-400";
  }
};
