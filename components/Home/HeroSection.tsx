import { getTranslator } from "next-intl/server";
import Link from "next/link";
import { twJoin, twMerge } from "tailwind-merge";
import { getServerUser } from "@/utils/serverUtils";
import { ctaButton } from "@/style/baseComponent";
import { GraduationCap, Sparkles, Sticker } from "lucide-react";

const iconCircle = twJoin(
  "h-16 w-16 rounded-full p-4 overflow-visible",
  "shadow-[inset_0_2px_0_0_#fff3]",
);

const circlePanel = twJoin("flex flex-col items-center gap-2 absolute");

const HeroSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslator(locale, "main.hero");
  const user = await getServerUser();

  return (
    <section className="flex h-content-screen min-h-[300px] items-center">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col gap-8">
          <h2
            className={twJoin(
              "whitespace-pre-line leading-relaxed",
              "text-4xl font-black",
            )}
          >
            {t("title")}
          </h2>
          <p className={twJoin("text-xl text-neutral-500")}>{t("subTitle")}</p>
          <div className="flex gap-4">
            {user ? (
              <Link
                href="/my-problems"
                title={t("dashboard")}
                className={twMerge(ctaButton, "px-6 py-3 text-lg")}
              >
                {t("dashboard")}
              </Link>
            ) : (
              <Link
                href="/my-problems"
                title={t("try")}
                className={twMerge(ctaButton, "px-6 py-3 text-lg")}
              >
                {t("try")}
              </Link>
            )}
          </div>
        </div>
        <div className="relative flex h-96 w-96">
          <div className={twJoin(circlePanel, "left-0 top-0")}>
            <Sparkles className={twJoin(iconCircle, "bg-blue-400")} />
            <span className="font-bold">{t("aiTutor")}</span>
          </div>
          <div className={twJoin(circlePanel, "right-0 top-0")}>
            <Sticker className={twJoin(iconCircle, "bg-pink-400")} />
            <span className="font-bold">{t("detailFeedback")}</span>
          </div>
          <div
            className={twJoin(
              circlePanel,
              "bottom-0 left-1/2 -translate-x-1/2 transform",
            )}
          >
            <GraduationCap className={twJoin(iconCircle)} />
            <span className="font-bold">{t("completeLearning")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
