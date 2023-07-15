import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ILanguage } from "@/types/common";
import SubmitPagePanel from "@/components/Problems/SubmitProblem/SubmitPagePanel";
import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import { getProblemInfo } from "@/utils/dbUtils";
import ProblemInfoPanel from "@/components/Problems/SubmitProblem/ProblemInfoPanel";
import prisma from "@/lib/prisma";

const SubmitPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const user = await getServerUser();
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=" + window.location.href);
  }

  const problemInfo = await getProblemInfo(params.id);
  if (!problemInfo) {
    redirect("/problems");
  }

  const savedHints = await prisma.hint.findMany({
    where: {
      problemId: problemInfo.id,
      userId: user.id,
    },
  });

  const availableLanguages = (
    await fetchJudgeApi<any>("/languages", {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }).catch(() => {
      return [];
    })
  ).map((lang: Omit<ILanguage, "monacoLanguage">) => {
    return {
      ...lang,
      monacoLanguage: lang.name
        .split(" (")[0]
        .toLowerCase()
        .replaceAll("+", "p")
        .replaceAll("#", "sharp"),
    };
  });

  return (
    <>
      <ProblemInfoPanel problem={problemInfo} />
      <SubmitPagePanel
        availableLangs={availableLanguages}
        savedHints={savedHints}
      />
    </>
  );
};

export default SubmitPage;
