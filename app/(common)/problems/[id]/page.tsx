import { redirect } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, roundButton, title } from "@/style/baseStyle";
import { getIsAdmin, getServerUser } from "@/utils/serverUtils";
import SignInButton from "@/components/Auth/SignInButton";
import { getProblemInfo } from "@/utils/dbUtils";
import { generateHTML } from "@tiptap/html";
import { TiptapExtensions } from "@/lib/editorConfigs";
import Link from "next/link";
import DeleteProblemButton from "@/components/Problems/DeleteProblemButton";

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
  const problem = await getProblemInfo(params.id);

  const user = await getServerUser();
  const isAdmin = await getIsAdmin(user);

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
      <div className="rounded-lg bg-neutral-200 p-4">
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTML(problem.description as any, TiptapExtensions),
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>Input Format</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: generateHTML(
                problem.inputFormat as any,
                TiptapExtensions
              ),
            }}
          />
        </div>
        <div>
          <h2 className={sectionTitle}>Sample Input</h2>
          <pre className={monoContent}>{problem.sampleInput}</pre>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>Output Format</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: generateHTML(
                problem.outputFormat as any,
                TiptapExtensions
              ),
            }}
          />
        </div>
        <div>
          <h2 className={sectionTitle}>Sample Output</h2>
          <pre className={monoContent}>{problem.sampleOutput}</pre>
        </div>
      </div>
      {user ? (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Link
              className={twMerge(
                roundButton,
                "bg-emerald-500 font-bold text-neutral-50",
                "px-4 py-2",
                actionToDark
              )}
              href={`/problems/${params.id}/submit`}
            >
              Start Coding!
            </Link>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <DeleteProblemButton problem={problem} />
              <Link
                className={twMerge(
                  roundButton,
                  "bg-violet-500 font-bold text-neutral-50",
                  "px-4 py-2",
                  actionToDark
                )}
                href={`/problems/${params.id}/testcase`}
              >
                Edit Testcase
              </Link>
            </div>
          )}
        </div>
      ) : (
        <SignInButton className="border-2 border-neutral-400" />
      )}
    </div>
  );
};

export default ProblemDetailPage;
