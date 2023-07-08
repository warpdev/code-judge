import { getProblemInfo } from "@/utils/dbUtils";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";
import { Edit3 } from "lucide-react";
import TestcaseRow from "@/components/Problems/Testcase/TestcaseRow";

const TestcaseListPanel = async ({ problemId }: { problemId: string }) => {
  const problem = await getProblemInfo(problemId);

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
    </ol>
  );
};

export default TestcaseListPanel;
