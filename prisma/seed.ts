import { PrismaClient } from "@prisma/client";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ILanguage } from "@/types/common";

const prisma = new PrismaClient();

async function main() {
  const availableLanguages = (
    await fetchJudgeApi<any>("/languages", {
      next: {
        revalidate: 60 * 60 * 24,
      },
    })
  ).map((lang: Omit<ILanguage, "monacoLanguage">) => {
    return {
      ...lang,
      monacoLanguage: lang.name
        .split(" (")[0]
        .toLowerCase()
        .replaceAll("+", "p")
        .replaceAll("#", "sharp"),
    };
  });

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
