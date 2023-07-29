import { getTranslator } from "next-intl/server";
import { getLectureInfo } from "@/utils/dbUtils";
import { redirect } from "next/navigation";
import { baseProse, sectionTitle, title } from "@/style/baseStyle";
import { twJoin } from "tailwind-merge";
import { generateHTML } from "@tiptap/html";
import { TiptapExtensions } from "@/lib/editorConfigs";
import dynamic from "next/dynamic";
import { Prisma } from "@prisma/client";

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
    <article className="flex flex-col gap-16">
      <div className="flex flex-row items-center gap-2">
        <h1 className={title}>{lecture.title}</h1>
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
      <div className="flex flex-col gap-2">
        <h2 className={twJoin("self-start", sectionTitle)}>
          {t("relatedProblems")}
        </h2>
        <ul>
          {lecture.problems.map((problem) => (
            <li key={problem.id}>
              <a href={`/problems/${problem.id}`}>{problem.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default LectureDetailPage;
