import supabase from "@/lib/supabase";

export const serverGetArticle = async (locale: string, title: string) => {
  const result = await supabase.storage
    .from("articles")
    .download(`${locale}/${btoa(title)}.md`);

  if (!result.data) {
    throw new Error("Article not found");
  }

  return result.data.text();
};

export const serverGetArticleList = async (locale: string) => {
  const result = await supabase.storage.from("articles").list(`${locale}/`);

  if (!result.data) {
    throw new Error("Article not found");
  }

  return result.data
    .filter((file) => file.name.endsWith(".md"))
    .map((file) => {
      const fileName = atob(file.name.replace(".md", ""));
      console.log(fileName);
      return {
        name: decodeURIComponent(fileName),
        title: decodeURIComponent(fileName).replace(/-/g, " "),
        updated_at: new Date(file.updated_at),
        created_at: new Date(file.created_at),
      };
    });
};
