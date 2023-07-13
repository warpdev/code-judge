import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";
import { getTranslator } from "next-intl/server";
import { getProblems } from "@/utils/dbUtils";

const ProblemListPage = async ({
  searchParams,
  params: { locale },
}: {
  searchParams: {
    page?: string;
    locale?: string;
  };
  params: { locale: string };
}) => {
  const currentPage = searchParams.page ? +searchParams.page - 1 : 0;
  const t = await getTranslator(locale, "problem");
  const problems = await getProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || locale,
  });

  return (
    <div>
      <h1 className={title}>{t("allProblems")}</h1>
      <ProblemsList initData={problems} locale={locale} />
      <div className="mt-4 flex justify-end">
        <AddProblemButton />
      </div>
    </div>
  );
};

export default ProblemListPage;
