"use client";
import { Problem } from "@prisma/client";
import { twJoin, twMerge } from "tailwind-merge";
import { actionNeutral } from "@/style/baseStyle";
import Link from "next/link";
import { Badge } from "@/components/BaseComponents";
import { Lock, Unlock } from "lucide-react";
import PageNavigator from "@/components/Navigator";
import { BaseProps } from "@/types/common";
import { useTranslations } from "next-intl";

const BaseProblemList = ({
  className,
  problems,
  showBadge = false,
}: BaseProps & {
  problems?: Problem[];
  showBadge?: boolean;
}) => {
  const t = useTranslations();

  return (
    <section className={twMerge("flex flex-col gap-4", className)}>
      <ul className="flex flex-col">
        {problems?.map((problem) => (
          <li
            key={problem.id}
            className={twJoin(
              "px-1 py-2",
              "border-b border-neutral-400 first:border-t",
              "dark:border-neutral-600",
              actionNeutral,
              "hover:opacity-80",
            )}
          >
            <Link
              className={twJoin(
                //TODO: grid
                "flex justify-between",
                "block w-full",
              )}
              href={`/problems/${problem.id}`}
            >
              <span>{problem.title}</span>
              {showBadge && (
                <Badge
                  className={
                    problem.isPublic
                      ? "bg-emerald-500 text-emerald-500"
                      : "bg-amber-600 text-amber-600"
                  }
                >
                  {problem.isPublic ? (
                    <Unlock className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  <span>
                    {problem.isPublic
                      ? t("common.public")
                      : t("common.private")}
                  </span>
                </Badge>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <PageNavigator />
    </section>
  );
};

export default BaseProblemList;
