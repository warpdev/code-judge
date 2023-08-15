import { getTranslator } from "next-intl/server";
import { getPublicLectures, getPublicProblems } from "@/utils/dbUtils";
import { title } from "@/style/baseStyle";
import Navigator from "@/components/Navigator";
import LectureList from "@/components/Lecture/LectureList";
import AddButton from "@/components/Problems/AddButton";
import { getIsAdmin, getServerUser } from "@/utils/serverUtils";

const LectureListPage = async ({
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

  const t = await getTranslator(locale, "lecture.view");
  const [lectures, totalCount] = await getPublicLectures({
    pageIndex: currentPage,
  });

  const user = await getServerUser();
  const isAdmin = await getIsAdmin(user);

  return (
    <div>
      <h1 className={title}>{t("publicLecture")}</h1>
      {isAdmin && (
        <div className="flex justify-end">
          <AddButton href="/lectures/add" buttonText={t("newLecture")} />
        </div>
      )}
      <LectureList lectures={lectures} locale={locale} className="mt-4" />
      <Navigator totalCount={totalCount} className="mt-4" />
    </div>
  );
};

export default LectureListPage;
