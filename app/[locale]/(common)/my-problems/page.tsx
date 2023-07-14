import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";
import { getTranslator } from "next-intl/server";
import { getMyProblems } from "@/utils/dbUtils";
import MyProblemList from "@/components/Problems/MyProblemList";

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
  const currentPage = searchParams.page ? +searchParams.page - 1 : 0;
  const t = await getTranslator(locale, "myProblem");
  const problems = await getMyProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || "all",
  });

  return (
    <div>
      <h1 className={title}>{t("myProblems")}</h1>
      <MyProblemList initData={problems} />
      <div className="mt-4 flex justify-end">
        <AddProblemButton />
      </div>
    </div>
  );
};

export default MyProblemPage;
