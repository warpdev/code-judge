import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";
import { getTranslator } from "next-intl/server";
import { getPublicProblems } from "@/utils/dbUtils";
import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";

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
  const currentPage =
    searchParams.page && +searchParams.page > 0 ? +searchParams.page : 1;
  const t = await getTranslator(locale, "problem");
  const problems = await getPublicProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || locale,
  });

  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div>
      <h1 className={title}>{t("allProblems")}</h1>
      <div className="mt-8 flex justify-between gap-2">
        <ProblemFilterPanel defaultLocal={locale} className="flex-1" />
        <AddProblemButton className="h-max min-w-max" />
      </div>
      <ProblemsList initData={problems} locale={locale} className="mt-4" />
    </div>
  );
};

export default ProblemListPage;
