import { twJoin } from "tailwind-merge";
import { actionToDark, baseInput, roundButton } from "@/style/baseStyle";

export const violetButton = twJoin(
  roundButton,
  "bg-violet-500 font-bold text-neutral-50",
  actionToDark,
);

export const redButton = twJoin(
  roundButton,
  "bg-red-500 font-bold text-neutral-50",
  actionToDark,
);

export const greenButton = twJoin(
  roundButton,
  "bg-emerald-500 font-bold text-neutral-50",
  actionToDark,
);

export const baseSelect = twJoin(
  "rounded px-2 py-2",
  "border-2 border-neutral-600",
  "bg-neutral-100 outline-none dark:bg-neutral-800",
  actionToDark,
);

export const defaultEditor = twJoin(
  baseInput,
  "prose-base prose-headings:font-display font-default focus:outline-none max-w-full selection:bg-blue-500/30",
  "dark:prose-invert",
);

export const ctaButton = twJoin(
  roundButton,
  "bg-emerald-500 font-bold text-neutral-50",
  actionToDark,
);

export const baseCard = twJoin(
  "rounded-lg p-4",
  "bg-white dark:bg-neutral-950",
  "border-neutral-200 dark:border-neutral-800 border",
  "transition duration-300",
  "hover:shadow-lg",
  "hover:bg-neutral-100 dark:hover:bg-neutral-900",
  "hover:-translate-y-1",
);
