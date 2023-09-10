import { PrismaClient } from "@prisma/client";

const JUDGE_API_URL = process.env.JUDGE_HOST || "";
const prisma = new PrismaClient();

const JUDGE_HEADER = {
  "Content-Type": "application/json",
  "X-Auth-Token": process.env.JUDGE_SECRET || "",
};

const fetchJudgeApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(JUDGE_API_URL + url, {
    headers: JUDGE_HEADER,
  });
  return response.json();
};

async function main() {
  const availableLanguages = (await fetchJudgeApi<any>("/languages")).map(
    (lang: Omit<any, "monacoLanguage">) => {
      return {
        ...lang,
        monacoLanguage: lang.name
          .split(" (")[0]
          .toLowerCase()
          .replaceAll("+", "p")
          .replaceAll("#", "sharp"),
      };
    },
  );

  const languages = await prisma.language.createMany({
    data: availableLanguages,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
