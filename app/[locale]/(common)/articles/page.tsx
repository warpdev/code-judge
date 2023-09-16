import { pageWithOptions } from "@/utils/serverUtils";
import { serverGetArticleList } from "@/utils/dbUtils/article";
import Link from "next-intl/link";
import { twJoin } from "tailwind-merge";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Skeleton from "@/components/Shared/Skeleton";

const TimeText = dynamic(() => import("@/components/TimeText"), {
  ssr: false,
  loading: (loadingProps) => <Skeleton $as="span" className="max-w-xs" />,
});

const ArticleListPage = pageWithOptions({})(async ({ locale }) => {
  const articleList = await serverGetArticleList(locale);

  return (
    <ol className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {articleList.map((article) => (
        <li key={article.name}>
          <Link
            href={`/articles/${article.name}`}
            className={twJoin(
              "flex flex-col p-2",
              "rounded-md",
              "transition hover:bg-neutral-600",
            )}
          >
            <span className={twJoin("text-xl font-bold")}>{article.title}</span>
            <TimeText time={article.created_at} />
          </Link>
        </li>
      ))}
    </ol>
  );
});

export default ArticleListPage;
