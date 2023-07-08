import { NextRequest, NextResponse } from "next/server";
import { fetchJudgeApi } from "@/utils/judgeServerUtils";
import { ILanguage } from "@/types/common";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
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
  });

  return NextResponse.json(languages);
};
