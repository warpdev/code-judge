import { IInputContent } from "@/types/input";

export const lectureInputs: IInputContent[][] = [
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
          value: 20,
          message: "error.maxLength",
        },
      },
    },
  ],
  [
    {
      id: "description",
      type: "text",
      options: {
        required: {
          value: true,
          message: "error.required",
        },
      },
    },
  ],
];
