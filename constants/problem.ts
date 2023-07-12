import { IProblemInput } from "@/types/common";

export const problemInputs: IProblemInput[] = [
  {
    id: "title",
    label: "title",
    type: "text",
    options: {
      required: {
        value: true,
        message: "Title is required",
      },
      maxLength: {
        value: 100,
        message: "Title must be less than 100 characters",
      },
    },
  },
  {
    id: "description",
    label: "description",
    type: "editor",
    options: {
      required: {
        value: true,
        message: "Description is required",
      },
    },
  },
  {
    id: "inputFormat",
    label: "inputFormat",
    type: "editor",
    options: {
      required: {
        value: true,
        message: "Input is required",
      },
    },
  },
  {
    id: "outputFormat",
    label: "outputFormat",
    type: "editor",
    options: {
      required: {
        value: true,
        message: "Output is required",
      },
    },
  },
  {
    id: "sampleInput",
    label: "sampleInput",
    type: "multiline",
    options: {
      required: {
        value: true,
        message: "Sample Input is required",
      },
    },
  },
  {
    id: "sampleOutput",
    label: "sampleOutput",
    type: "multiline",
    options: {
      required: {
        value: true,
        message: "Sample Output is required",
      },
    },
  },
  {
    id: "timeLimit",
    label: "timeLimit",
    type: "number",
    inputMode: "numeric",
    options: {
      required: {
        value: true,
        message: "Time Limit is required",
      },
      setValueAs: (value: string | number) => {
        return value ? parseInt(String(value).replace(/\D+/g, "")) : "";
      },
    },
  },
  {
    id: "memoryLimit",
    label: "memoryLimit",
    type: "number",
    inputMode: "numeric",
    options: {
      required: {
        value: true,
        message: "Memory Limit is required",
      },
      setValueAs: (value: string | number) => {
        return value ? parseInt(String(value).replace(/\D+/g, "")) : "";
      },
    },
  },
];
