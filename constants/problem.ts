import { LOCALE_MAP, LOCALES } from "@/constants/common";
import { IInputContent } from "@/types/input";

export const problemInputs: IInputContent[][] = [
  [
    {
      id: "title",
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
      type: "number",
      inputMode: "numeric",
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
      type: "number",
      inputMode: "numeric",
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
