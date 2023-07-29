"use client";
import BaseModal from "@/components/Modal/BaseModal";
import { IProblemFilter } from "@/types/common";
import { useTranslations } from "next-intl";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import { twJoin, twMerge } from "tailwind-merge";
import { actionToDark, miniLabel } from "@/style/baseStyle";
import { useRouter } from "next/navigation";
import useCreateUrl from "@/utils/hooks/useCreateUrl";

const filterItem: IProblemFilter = {
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
  <div
    className={twJoin(
      "h-px w-full rounded bg-gradient-to-r from-neutral-300 to-transparent",
      "dark:from-neutral-600",
    )}
  />
);

const FilterViewRow = ({
  title,
  options,
  currentValue,
  onChange: handleChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  currentValue: string;
  onChange: (value: string) => void;
}) => {
  const t = useTranslations("common");

  return (
    <li className="flex flex-col gap-2">
      <span className={miniLabel}>{title}</span>
      <Divider />
      <RadioGroup.Root
        className="flex gap-4"
        defaultValue={currentValue}
        onValueChange={handleChange}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={twMerge(
              "flex cursor-pointer items-center rounded p-2",
              "bg-neutral-100 dark:bg-neutral-800",
              actionToDark,
              "font-bold text-neutral-400",
              currentValue === option.value && "text-green-500",
            )}
            htmlFor={option.value}
          >
            <RadioGroup.Item
              className="cursor-pointer rounded-full bg-transparent"
              value={option.value}
              id={option.value}
            >
              <RadioGroup.Indicator>
                <Check className="mr-2 h-6 w-6" />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
            <span>{t(option.label as any)}</span>
          </label>
        ))}
      </RadioGroup.Root>
    </li>
  );
};

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
        <FilterViewRow
          title={t("problemLocale")}
          options={filterItem.locale.options}
          currentValue={currentFilter.locale || ""}
          onChange={handleFilterChange("locale")}
        />
      </ul>
    </BaseModal>
  );
};

export default ProblemFilterModal;
