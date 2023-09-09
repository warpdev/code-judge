"use client";

import { twJoin } from "tailwind-merge";
import { useTranslations } from "next-intl";

const ProfileDashboard = () => {
  const t = useTranslations("profile");
  return (
    <div
      className={twJoin(
        "h-80 w-full rounded-lg",
        "flex items-center justify-center",
        "bg-neutral-200 dark:bg-neutral-800",
      )}
    >
      <span className="whitespace-pre-line text-center text-neutral-500 dark:text-neutral-400">
        {t.rich("feedback", {
          link: (chunk) => (
            <a
              href="mailto:contact@opencody.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-950 underline dark:text-neutral-50"
            >
              {chunk}
            </a>
          ),
        })}
      </span>
    </div>
  );
};

export default ProfileDashboard;
