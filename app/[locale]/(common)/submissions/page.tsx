import { title } from "@/style/baseStyle";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import { getTranslator } from "next-intl/server";
import { getAllSubmissions } from "@/utils/dbUtils";
import Navigator from "@/components/Navigator";

const SubmissionsPage = async ({
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
  const t = await getTranslator(locale, "submission");
  const allSubmissions = await getAllSubmissions({
    pageIndex: currentPage,
  });

  return (
    <div>
      <h1 className={title}>{t("allSubmissions")}</h1>
      <SubmissionsListPanel submissions={allSubmissions} locale={locale} />
      <Navigator />
    </div>
  );
};

export default SubmissionsPage;
