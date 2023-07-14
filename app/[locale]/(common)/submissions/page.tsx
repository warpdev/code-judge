import { title } from "@/style/baseStyle";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import prisma from "@/lib/prisma";
import { getTranslator } from "next-intl/server";

const SubmissionsPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const t = await getTranslator(locale, "submission");
  const allSubmissions = await prisma.submission.findMany({
    include: {
      user: {
        select: {
          id: true,
        },
      },
      problem: true,
      language: true,
    },
  });

  return (
    <div>
      <h1 className={title}>{t("allSubmissions")}</h1>
      <SubmissionsListPanel submissions={allSubmissions} locale={locale} />
    </div>
  );
};

export default SubmissionsPage;
