"use client";
import { IProblemFilter } from "@/types/common";
import { twJoin } from "tailwind-merge";
import { roundButton } from "@/style/baseStyle";
import { LOCALE_MAP } from "@/constants/common";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Check, X } from "lucide-react";
import useCreateUrl from "@/utils/hooks/useCreateUrl";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const ProblemFilterView = ({
  currentFilter,
}: {
  currentFilter: Record<keyof IProblemFilter, string | null>;
}) => {
  const t = useTranslations();
  const lang = useMemo(() => {
    if (currentFilter.locale) {
      return LOCALE_MAP[currentFilter.locale]?.name;
    }
  }, [currentFilter.locale]);

  const createUrl = useCreateUrl();
  const router = useRouter();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {lang && (
        <motion.span
          initial={{ opacity: 0.4, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className={twJoin(
              roundButton,
              "relative rounded-full",
              "border border-blue-200",
              "bg-blue-100 text-blue-500",
              "flex items-center gap-2 overflow-hidden",
              "transition duration-300",
              "group",
              "hover:grayscale",
            )}
            onClick={() => {
              router.replace(createUrl("locale", "all"));
            }}
          >
            <Check className="relative h-6 w-6" />
            <span>{t(`common.${lang}` as any)}</span>
            <div
              className={twJoin(
                "absolute inset-0 text-center opacity-0 backdrop-blur-sm",
                "flex items-center justify-center",
                "transition duration-300",
                "group-hover:opacity-100",
              )}
            >
              <X className="h-6 w-6" />
            </div>
          </motion.button>
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default ProblemFilterView;
