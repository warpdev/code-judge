import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton, title } from "@/style/baseStyle";
import Link from "next/link";
import OpenSubmitButton from "@/components/Problems/OpenSubmitButton";
import { getServerUser } from "@/utils/serverUtils";
import SignInButton from "@/components/Auth/SignInButton";
import Viewer from "@/components/Editor/Viewer";

const sectionTitle = twJoin("mb-4", "text-lg font-bold text-neutral-900");
const monoContent = twJoin(
  "rounded-md border-2 border-neutral-600 p-2",
  "bg-neutral-900 text-neutral-50",
  "font-mono whitespace-pre"
);

const ProblemDetailPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id: params.id,
    },
  });

  const user = await getServerUser();

  if (!problem) {
    redirect("/problems");
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between">
        <h1 className={twJoin(title)}>{problem.title}</h1>
        <span className="flex gap-4">
          <span>Memory Limit : {problem.memoryLimit} MB</span>
          <span>Time Limit : {problem.timeLimit} ms</span>
        </span>
      </div>
      <h2 className="sr-only">Description</h2>
      <p className="rounded-lg bg-neutral-200 p-4">
        <Viewer value={problem.description} />
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>Input Format</h2>
          <p>
            <Viewer value={problem.input} />
          </p>
        </div>
        <div>
          <h2 className={sectionTitle}>Sample Input</h2>
          <pre className={monoContent}>{problem.sampleInput}</pre>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>Output Format</h2>
          <p>
            <Viewer value={problem.output} />
          </p>
        </div>
        <div>
          <h2 className={sectionTitle}>Sample Output</h2>
          <pre className={monoContent}>{problem.sampleOutput}</pre>
        </div>
      </div>
      {user ? (
        <OpenSubmitButton id={params.id} />
      ) : (
        <SignInButton className="border-2 border-neutral-400" />
      )}
    </div>
  );
};

export default ProblemDetailPage;
