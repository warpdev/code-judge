import { IProblemInput } from "@/types/common";

export const problemInputs: IProblemInput[] = [
  {
    id: "title",
    label: "Title",
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
    label: "Description",
    type: "editor",
    options: {
      required: {
        value: true,
        message: "Description is required",
      },
    },
  },
  {
    id: "difficulty",
    label: "Difficulty",
    type: "text",
    options: {
      required: {
        value: true,
        message: "Difficulty is required",
      },
    },
  },
  {
    id: "inputFormat",
    label: "Input",
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
    label: "Output",
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
    label: "Sample Input",
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
    label: "Sample Output",
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
    label: "Time Limit",
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
    label: "Memory Limit",
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
