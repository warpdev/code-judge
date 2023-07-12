import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";
import { getTranslator } from "next-intl/server";

const ProblemListPage = async ({
  searchParams,
  params: { locale },
}: {
  searchParams: {
    page?: string;
  };
  params: { locale: string };
}) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) - 1 : 0;
  const t = await getTranslator(locale, "problem");

  return (
    <div>
      <h1 className={title}>{t("allProblems")}</h1>
      <ProblemsList initIndex={currentPage} />
      <div className="mt-4 flex justify-end">
        <AddProblemButton />
      </div>
    </div>
  );
};

export default ProblemListPage;
