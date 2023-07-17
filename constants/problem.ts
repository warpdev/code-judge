import { LOCALE_MAP, LOCALES } from "@/constants/common";
import { IProblemInput } from "@/types/input";

export const problemInputs: IProblemInput[][] = [
  [
    {
      id: "title",
      label: "title",
      type: "text",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
        maxLength: {
          value: 100,
          message: "error.maxLength",
        },
      },
    },
    {
      id: "locale",
      label: "language",
      type: "select",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
      selectOptions: LOCALES.map((locale) => ({
        label: `common.${LOCALE_MAP[locale].name}`,
        value: locale,
      })),
    },
  ],
  [
    {
      id: "timeLimit",
      label: "timeLimit",
      type: "number",
      inputMode: "numeric",
      placeholder: "placeholder.timeLimitRange",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
        min: {
          value: 0.01,
          message: "error.min",
        },
        max: {
          value: 5,
          message: "error.max",
        },
        setValueAs: (value: string | number) => {
          return value ? parseInt(String(value).replace(/[^\d.]/g, "")) : "";
        },
      },
      allowDecimal: true,
    },
    {
      id: "memoryLimit",
      label: "memoryLimit",
      type: "number",
      inputMode: "numeric",
      placeholder: "placeholder.memoryLimitRange",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
        min: {
          value: 2,
          message: "error.min",
        },
        max: {
          value: 512,
          message: "error.max",
        },
        setValueAs: (value: string | number) => {
          return value ? parseInt(String(value).replace(/\D+/g, "")) : "";
        },
      },
      allowDecimal: false,
    },
  ],
  [
    {
      id: "description",
      label: "description",
      type: "editor",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
    },
  ],
  [
    {
      id: "inputFormat",
      label: "inputFormat",
      type: "editor",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
    },
  ],
  [
    {
      id: "outputFormat",
      label: "outputFormat",
      type: "editor",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
    },
  ],
  [
    {
      id: "sampleInput",
      label: "sampleInput",
      type: "multiline",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
      className: "font-mono",
    },
    {
      id: "sampleOutput",
      label: "sampleOutput",
      type: "multiline",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
      className: "font-mono",
    },
  ],
];
