import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ILanguage } from "@/types/common";
import SubmitPagePanel from "@/components/Problems/SubmitProblem/SubmitPagePanel";

const SubmitPage = async () => {
  const availableLanguages = (
    await fetchJudgeApi("/languages", {
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

  return <SubmitPagePanel availableLangs={availableLanguages} />;
};

export default SubmitPage;
