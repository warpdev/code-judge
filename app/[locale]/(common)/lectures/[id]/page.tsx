import { getTranslator } from "next-intl/server";
import { getLectureInfo } from "@/utils/dbUtils";
import { redirect } from "next/navigation";
import { baseProse, sectionTitle, title } from "@/style/baseStyle";
import { twJoin } from "tailwind-merge";
import { generateHTML } from "@tiptap/html";
import { TiptapExtensions } from "@/lib/editorConfigs";
import dynamic from "next/dynamic";
import { Prisma } from "@prisma/client";
import Link from "next-intl/link";
import RelatedProblemCard from "@/components/Lecture/RelatedProblemCard";

const VideoPanel = dynamic(() => import("@/components/Shared/VideoPanel"), {
  ssr: false,
});

const LectureDetailPage = async ({
  params: { locale, id },
}: {
  params: {
    locale: string;
    id: string;
  };
}) => {
  const t = await getTranslator(locale, "lecture.view");
  const lecture = (await getLectureInfo(id, {
    include: {
      problems: true,
    },
  })) as Prisma.LectureGetPayload<{
    include: {
      problems: true;
    };
  }>;

  //TODO: add permission check

  if (!lecture) {
    redirect("/lectures");
  }

  return (
    <article className="flex flex-col gap-8 md:gap-16">
      <div className="flex flex-row items-end gap-2">
        <h1 className={twJoin(title, "leading-none")}>{lecture.title}</h1>
        <p className={twJoin("text-sm font-medium", "text-neutral-500")}>
          {lecture.description}
        </p>
      </div>
      {lecture.videoUrl && <VideoPanel url={lecture.videoUrl} />}
      <div>
        <h2 className="sr-only">{t("content")}</h2>
        <div
          className={baseProse}
          dangerouslySetInnerHTML={{
            __html: generateHTML(lecture.content as any, TiptapExtensions),
          }}
        />
      </div>
      {lecture.problems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className={twJoin("self-start", sectionTitle)}>
            {t("relatedProblems")}
          </h2>
          <ul
            className={twJoin(
              "grid grid-cols-1 gap-4",
              "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {lecture.problems.map((problem) => (
              <li key={problem.id}>
                <Link href={`/problems/${problem.id}`}>
                  <RelatedProblemCard problem={problem} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default LectureDetailPage;
