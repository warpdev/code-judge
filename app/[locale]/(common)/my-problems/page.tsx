import { title } from "@/style/baseStyle";
import AddButton from "@/components/Problems/AddButton";
import { getTranslator } from "next-intl/server";
import { getMyProblems } from "@/utils/dbUtils";
import MyProblemList from "@/components/Problems/MyProblemList";
import Navigator from "@/components/Navigator";
import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";

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
  const t = await getTranslator(locale, "problem.view");
  const user = await getServerUser();
  if (!user) {
    redirect("/api/auth/signin");
  }

  const [problems, totalCount] = await getMyProblems({
    pageIndex: currentPage,
    user: user,
    locale: searchParams.locale || "all",
  });

  return (
    <div className="flex flex-col">
      <h1 className={title}>{t("myProblems")}</h1>
      <div className="mt-8 flex justify-end gap-2">
        <AddButton
          href="/problems/add"
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
