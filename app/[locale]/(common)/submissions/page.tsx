import { title } from "@/style/baseStyle";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import { getTranslator } from "next-intl/server";
import { getAllSubmissions } from "@/utils/dbUtils";

const SubmissionsPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const t = await getTranslator(locale, "submission");
  const allSubmissions = await getAllSubmissions({
    pageIndex: 0,
  });

  return (
    <div>
      <h1 className={title}>{t("allSubmissions")}</h1>
      <SubmissionsListPanel submissions={allSubmissions} locale={locale} />
    </div>
  );
};

export default SubmissionsPage;
