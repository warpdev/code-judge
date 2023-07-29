import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import { getTranslator } from "next-intl/server";
import { getPublicProblems } from "@/utils/dbUtils";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import Navigator from "@/components/Navigator";
import { redirect } from "next/navigation";

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
  //TODO: remove
  redirect("/my-problems");
  const t = await getTranslator(locale, "problem.view");
  const [problems, totalCount] = await getPublicProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || locale,
  });

  return (
    <div>
      <h1 className={title}>{t("allProblems")}</h1>
      <div className="mt-8 flex justify-between gap-2">
        <ProblemFilterPanel defaultLocal={locale} className="flex-1" />
      </div>
      <ProblemsList
        problems={problems}
        locale={searchParams.locale || locale}
        className="mt-4"
      />
      <Navigator totalCount={totalCount} className="mt-4" />
    </div>
  );
};

export default ProblemListPage;
