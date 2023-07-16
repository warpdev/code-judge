import { title } from "@/style/baseStyle";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import { getTranslator } from "next-intl/server";
import { getAllSubmissions } from "@/utils/dbUtils";
import Navigator from "@/components/Navigator";
import { getServerUser } from "@/utils/serverUtils";

const SubmissionsPage = async ({
  searchParams,
  params: { locale },
}: {
  searchParams: {
    page?: string;
    locale?: string;
    last?: string;
  };
  params: { locale: string };
}) => {
  const currentPage =
    searchParams.page && +searchParams.page > 0 ? +searchParams.page : 1;
  const t = await getTranslator(locale, "submission");
  const [allSubmissions, totalCount] = await getAllSubmissions({
    pageIndex: currentPage,
    onlyMy: true,
  });

  const user = await getServerUser();

  return (
    <div className="flex flex-col gap-4">
      <h1 className={title}>{t("allSubmissions")}</h1>
      <SubmissionsListPanel
        submissions={allSubmissions}
        userInfo={user}
        onlyMine={true}
      />
      <Navigator totalCount={totalCount} />
    </div>
  );
};

export default SubmissionsPage;
