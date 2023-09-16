import { pageWithOptions } from "@/utils/serverUtils";
import { MDXRemote } from "next-mdx-remote/rsc";
import { z } from "zod";
import { serverGetArticle } from "@/utils/dbUtils/article";
import { twMerge } from "tailwind-merge";
import { baseProse } from "@/style/baseStyle";

const ParamSchema = z.object({
  title: z.string(),
});

const ArticlePage = pageWithOptions({
  paramsSchema: ParamSchema,
})(async ({ locale, params: { title } }) => {
  const article = await serverGetArticle(locale, title);
  return (
    <article className={twMerge(baseProse, "prose")}>
      <MDXRemote source={article} />
    </article>
  );
});

export default ArticlePage;
