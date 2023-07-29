import { getTranslator } from "next-intl/server";
import Link from "next/link";
import { twJoin, twMerge } from "tailwind-merge";
import { getServerUser } from "@/utils/serverUtils";
import { ctaButton } from "@/style/baseComponent";
import { GraduationCap, Sparkles, Sticker } from "lucide-react";

const iconCircle = twJoin(
  "h-16 w-16 rounded-full p-4 overflow-visible",
  "dark:shadow-[inset_0_2px_0_0_#fff3] text-neutral-50",
);

const circlePanel = twJoin(
  "flex flex-col items-center gap-2 opacity-0",
  "static md:absolute",
  "animate-fadeIn",
);

const HeroSection = async ({ locale }: { locale: string }) => {
  const t = await getTranslator(locale, "home.hero");
  const user = await getServerUser();

  return (
    <section className="flex h-content-screen min-h-[450px] items-center">
      <div
        className={twJoin(
          "flex w-full items-center justify-between",
          "flex-col md:flex-row",
        )}
      >
        <div className="flex flex-col gap-8">
          <h1
            className={twJoin(
              "whitespace-pre-line leading-relaxed",
              "text-2xl font-black md:text-4xl",
              "text-center md:text-left",
            )}
          >
            {t("title")}
          </h1>
          <p
            className={twJoin(
              "text-neutral-500",
              "text-base md:text-xl",
              "text-center md:text-left",
              "whitespace-pre-line md:whitespace-normal",
            )}
          >
            {t("subTitle")}
          </p>
          <div className="flex justify-center gap-4 md:justify-start">
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
        <ul
          className={twJoin(
            "relative grid md:flex",
            "grid-cols-3 text-center text-sm md:text-base",
            "md:mt-0 md:h-96 md:w-96",
            "mt-16 w-full gap-4",
          )}
        >
          <li className={twJoin(circlePanel, "left-0 top-0")}>
            <Sparkles className={twJoin(iconCircle, "bg-blue-400")} />
            <span className="font-bold">{t("aiTutor")}</span>
          </li>
          <li
            className={twJoin(
              circlePanel,
              "right-0 top-0",
              "animation-delay-500",
            )}
          >
            <Sticker className={twJoin(iconCircle, "bg-pink-400")} />
            <span className="font-bold">{t("detailFeedback")}</span>
          </li>
          <li
            className={twMerge(
              circlePanel,
              "bottom-0 left-1/2 md:-translate-x-1/2 md:transform",
              "animate-[fadeIn_0.8s_ease-out_forwards]",
              "animation-delay-1000",
            )}
          >
            <GraduationCap className={twJoin(iconCircle, "bg-neutral-950")} />
            <span className="font-bold">{t("completeLearning")}</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
