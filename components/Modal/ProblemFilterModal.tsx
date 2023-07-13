"use client";
import BaseModal from "@/components/Modal/BaseModal";
import { IProblemFilter } from "@/types/common";
import { useTranslations } from "next-intl";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { actionToDark } from "@/style/baseStyle";
import { useRouter } from "next/navigation";
import useCreateUrl from "@/utils/hooks/useCreateUrl";

const FilterItem: IProblemFilter = {
  locale: {
    title: "language",
    options: [
      {
        value: "all",
        label: "all",
      },
      {
        value: "ko",
        label: "korean",
      },
      {
        value: "en",
        label: "english",
      },
    ],
  },
};

const Divider = () => (
  <div className="h-px w-full rounded bg-gradient-to-r from-neutral-300 to-transparent" />
);

const ProblemFilterModal = ({
  currentFilter,
  onClose,
}: {
  currentFilter: Record<keyof IProblemFilter, string | null>;
  onClose: () => void;
}) => {
  const t = useTranslations("common");
  const router = useRouter();
  const createUrl = useCreateUrl();

  const handleFilterChange = (key: keyof IProblemFilter) => (value: string) => {
    router.replace(createUrl(key, value));
  };

  return (
    <BaseModal className="max-w-2xl" onClose={onClose}>
      <ul className="flex flex-col">
        <li className="flex flex-col gap-2">
          <span className="text-sm font-bold text-neutral-600">
            {t("language")}
          </span>
          <Divider />
          <RadioGroup.Root
            className="flex gap-4"
            defaultValue={currentFilter.locale || ""}
            onValueChange={handleFilterChange("locale")}
          >
            {FilterItem.locale.options.map((option) => (
              <label
                key={option.value}
                className={twMerge(
                  "flex cursor-pointer items-center rounded bg-neutral-100 p-2",
                  actionToDark,
                  "font-bold text-neutral-400",
                  currentFilter.locale === option.value && "text-green-500",
                )}
                htmlFor={option.value}
              >
                <RadioGroup.Item
                  className="cursor-pointer rounded-full bg-transparent"
                  value={option.value}
                  id={option.value}
                >
                  <RadioGroup.Indicator>
                    <Check className="h-6 w-6" />
                  </RadioGroup.Indicator>
                </RadioGroup.Item>
                <span>{t(option.label as any)}</span>
              </label>
            ))}
          </RadioGroup.Root>
        </li>
      </ul>
    </BaseModal>
  );
};

export default ProblemFilterModal;
