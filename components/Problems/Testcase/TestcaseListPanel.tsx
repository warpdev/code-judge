"use client";
import { redirect } from "next/navigation";
import TestcaseRow from "@/components/Problems/Testcase/TestcaseRow";
import { Problem } from "@prisma/client";
import useSWR from "swr";

const TestcaseListPanel = ({ initProblems }: { initProblems: Problem }) => {
  const { data: problem, mutate } = useSWR(
    `/api/problem/${initProblems.id}`,
    null,
    {
      fallbackData: initProblems,
    }
  );

  if (!problem) {
    redirect("/problems");
  }

  return (
    <ol className="flex flex-col gap-8">
      {Array.from({ length: problem.testSetSize }, (_, i) => i + 1).map((i) => (
        <li key={i}>
          <TestcaseRow problem={problem} caseNumber={i} />
        </li>
      ))}
      <li>
        <TestcaseRow
          problem={problem}
          caseNumber={problem.testSetSize + 1}
          isNew={true}
        />
      </li>
    </ol>
  );
};

export default TestcaseListPanel;
