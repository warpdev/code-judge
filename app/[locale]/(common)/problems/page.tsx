import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import { getTranslator } from "next-intl/server";
import { getPublicProblems } from "@/utils/dbUtils";
import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import { headers } from "next/headers";

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
  const header = headers();
  const currentPage =
    searchParams.page && +searchParams.page > 0 ? +searchParams.page : 1;
  const t = await getTranslator(locale, "problem");
  const problems = await getPublicProblems({
    pageIndex: currentPage,
    locale: searchParams.locale || locale,
  });

  const nextUrl = "https://" + header.get("host") + "/problems";

  const user = await getServerUser();
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent(nextUrl));
  }

  return (
    <div>
      <h1 className={title}>{t("allProblems")}</h1>
      <div className="mt-8 flex justify-between gap-2">
        <ProblemFilterPanel defaultLocal={locale} className="flex-1" />
      </div>
      <ProblemsList initData={problems} locale={locale} className="mt-4" />
    </div>
  );
};

export default ProblemListPage;
