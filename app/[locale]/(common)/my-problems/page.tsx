import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";
import { getTranslator } from "next-intl/server";
import { getMyProblems } from "@/utils/dbUtils";
import MyProblemList from "@/components/Problems/MyProblemList";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import Navigator from "@/components/Navigator";

const MyProblemPage = async ({
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
  const t = await getTranslator(locale, "myProblem");
  const [problems, totalCount] = await getMyProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || "all",
  });

  return (
    <div className="flex flex-col">
      <h1 className={title}>{t("myProblems")}</h1>
      <div className="mt-8 flex justify-between gap-2">
        <ProblemFilterPanel defaultLocal="all" className="flex-1" />
        <AddProblemButton
          className="h-max min-w-max"
          buttonText={t("newProblem")}
        />
      </div>
      <MyProblemList
        problems={problems}
        className="mt-4"
        locale={searchParams.locale || "all"}
      />
      <Navigator totalCount={totalCount} className="mt-4" />
    </div>
  );
};

export default MyProblemPage;
