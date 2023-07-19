import { twJoin } from "tailwind-merge";

/** inputs */
export const baseInput = twJoin(
  "rounded border-neutral-400 border",
  "bg-neutral-50 px-2 py-2",
  "dark:bg-neutral-950",
  "leading-snug",
  "transition",
  "focus:outline-none focus:border-emerald-400",
);

/** interactions */
export const actionNeutral = twJoin(
  "transition",
  "hover:bg-neutral-200",
  "active:bg-neutral-300",
  "dark:hover:bg-neutral-800",
  "dark:active:bg-neutral-700",
);

export const actionOpacity = twJoin(
  "transition",
  "hover:opacity-80",
  "active:opacity-60",
);

export const actionToDark = twJoin(
  "transition",
  "hover:brightness-90 dark:hover:brightness-85",
  "active:brightness-80 dark:active:brightness-75",
);

export const actionToLight = twJoin(
  "transition",
  "hover:brightness-110",
  "active:brightness-120",
);

export const actionBorderNeutral = twJoin(
  "transition",
  "border-2 border-transparent",
  "hover:border-neutral-400",
  "active:border-neutral-500",
);

/** texts */
export const title = twJoin("text-2xl font-bold");

export const miniLabel = twJoin(
  "text-sm font-bold text-neutral-600",
  "dark:text-neutral-300",
);

/** buttons */
export const roundButton = twJoin("block rounded px-4 py-2");

export const baseTabButton = twJoin(
  "w-10 h-10 bg-neutral-100",
  "rounded-md border-2 border-neutral-400",
  "dark:bg-neutral-800 dark:border-neutral-600",
  actionToDark,
);

export const baseProse = twJoin("prose-base max-w-full dark:prose-invert");
