import { redirect } from "next/navigation";
import { getTranslator } from "next-intl/server";
import { getPublicLectures, getPublicProblems } from "@/utils/dbUtils";
import { title } from "@/style/baseStyle";
import ProblemFilterPanel from "@/components/Problems/Filter/ProblemFilterPanel";
import ProblemsList from "@/components/Problems/ProblemsList";
import Navigator from "@/components/Navigator";
import LectureList from "@/components/Lecture/LectureList";

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

  return (
    <div>
      <h1 className={title}>{t("publicLecture")}</h1>
      <LectureList lectures={lectures} locale={locale} className="mt-4" />
      <Navigator totalCount={totalCount} className="mt-4" />
    </div>
  );
};

export default LectureListPage;
