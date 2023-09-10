import { redirect } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { baseProse, title } from "@/style/baseStyle";
import { getIsAdmin, getIsMyProblem, getServerUser } from "@/utils/serverUtils";
import SignInButton from "@/components/Auth/SignInButton";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import { generateHTML } from "@tiptap/html";
import { TiptapExtensions } from "@/lib/editorConfigs";
import Link from "next-intl/link";
import DeleteProblemButton from "@/components/Problems/DeleteProblemButton";
import { getTranslator } from "next-intl/server";
import { greenButton, violetButton } from "@/style/baseComponent";
import { FileEdit } from "lucide-react";

const sectionTitle = twJoin(
  "mb-4",
  "text-lg font-bold text-neutral-900",
  "dark:text-neutral-100",
);
const monoContent = twJoin(
  "rounded-md border-2 border-neutral-600 p-2",
  "bg-neutral-900 text-neutral-50",
  "font-mono whitespace-pre",
);

const ProblemDetailPage = async ({
  params,
}: {
  params: {
    locale: string;
    id: string;
  };
}) => {
  const problem = await serverGetProblemInfo(params.id);

  const user = await getServerUser();
  const isAdmin = await getIsAdmin(user);

  if (!problem) {
    redirect("/problems");
  }

  const isMine = getIsMyProblem(problem, user);

  const isEditable = isMine || isAdmin;

  const editUrl = `/problems/${params.id}/edit`;

  const t = await getTranslator(params.locale, "problem.view");

  const memoryLimit = t("memoryLimit").split(" ");
  const timeLimit = t("timeLimit").split(" ");

  return (
    <div className="space-y-12">
      <div
        className={twJoin(
          "flex justify-between gap-2",
          "flex-col-reverse md:flex-row",
        )}
      >
        <div className="group flex items-center gap-2">
          <h1 className={twJoin(title)}>{problem.title}</h1>
          {isEditable && (
            <Link
              href={editUrl}
              aria-label={t("editProblem")}
              className={twJoin(
                "text-neutral-500 dark:text-neutral-400",
                "transition",
                "hover:text-neutral-900 dark:hover:text-neutral-100",
              )}
            >
              <FileEdit className="h-8 w-8" />
            </Link>
          )}
        </div>
        <span className="flex gap-4 text-xs md:text-sm">
          <span>
            <span>{memoryLimit[0]}</span>{" "}
            <span className="sr-only md:not-sr-only">{memoryLimit[1]}</span> :{" "}
            {problem.memoryLimit} MiB
          </span>
          <span>
            <span>{timeLimit[0]}</span>{" "}
            <span className="sr-only md:not-sr-only">{timeLimit[1]}</span> :{" "}
            {problem.timeLimit / 1000} {t("seconds")}
          </span>
        </span>
      </div>
      <h2 className="sr-only">Description</h2>
      <div
        className={twJoin(
          "rounded-lg bg-neutral-100 p-4",
          "dark:bg-neutral-800",
          "border-none",
        )}
      >
        <div
          className={baseProse}
          dangerouslySetInnerHTML={{
            __html: generateHTML(problem.description as any, TiptapExtensions),
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>{t("inputFormat")}</h2>
          <div
            className={baseProse}
            dangerouslySetInnerHTML={{
              __html: generateHTML(
                problem.inputFormat as any,
                TiptapExtensions,
              ),
            }}
          />
        </div>
        <div>
          <h2 className={sectionTitle}>{t("sampleInput")}</h2>
          <pre className={monoContent}>{problem.sampleInput}</pre>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className={sectionTitle}>{t("outputFormat")}</h2>
          <div
            className={baseProse}
            dangerouslySetInnerHTML={{
              __html: generateHTML(
                problem.outputFormat as any,
                TiptapExtensions,
              ),
            }}
          />
        </div>
        <div>
          <h2 className={sectionTitle}>{t("sampleOutput")}</h2>
          <pre className={monoContent}>{problem.sampleOutput}</pre>
        </div>
      </div>
      {user ? (
        <div
          className={twJoin(
            "flex justify-between gap-2",
            "flex-col md:flex-row",
          )}
        >
          <Link className={greenButton} href={`/problems/${params.id}/submit`}>
            {t("startCoding")}
          </Link>
          {(isMine || isAdmin) && (
            <div className="flex items-center justify-end gap-2">
              <DeleteProblemButton problem={problem} locale={params.locale} />
              <Link
                className={violetButton}
                href={`/problems/${params.id}/testcase`}
              >
                {t("editTestCases")}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <SignInButton
          className="border-2 border-neutral-400"
          locale={params.locale}
        />
      )}
    </div>
  );
};

export default ProblemDetailPage;
