import { IInputContent } from "@/types/input";
import { LOCALE_MAP, LOCALES } from "@/constants/common";
import { LectureSchema } from "@/types/schema";
import { z } from "zod";

export const lectureInputs: IInputContent<
  keyof z.infer<typeof LectureSchema>
>[][] = [
  [
    {
      id: "title",
      type: "text",
      hasPlaceholder: true,
      hasHint: true,
      options: {
        required: {
          value: true,
          message: "error.required",
        },
        minLength: {
          value: 2,
          message: "error.minLength",
        },
        maxLength: {
          value: 20,
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
      id: "description",
      type: "text",
      hasPlaceholder: true,
      options: {
        required: {
          value: true,
          message: "error.required",
        },
        minLength: {
          value: 20,
          message: "error.minLength",
        },
        maxLength: {
          value: 20,
          message: "error.maxLength",
        },
      },
    },
  ],
  [
    {
      id: "content",
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
      id: "videoUrl",
      type: "text",
      hasPlaceholder: true,
      hasHint: true,
      options: {
        pattern: {
          value:
            /https:\/\/(youtu.be|www.youtube.com)\/([A-z0-9-_]{11}(\?.*)?$|(watch?.*v=[A-z0-9-_]{11}(\&.*)?$))/gm,
          message: "error.url",
        },
      },
    },
  ],
];
