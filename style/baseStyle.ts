import { twJoin } from "tailwind-merge";

export const baseInput = twJoin(
  "rounded border-neutral-400 border-2",
  "bg-neutral-50 px-2 py-1",
  "transition",
  "focus:outline-none focus:border-emerald-400",
);

export const roundButton = twJoin("block rounded px-4 py-2");

export const actionNeutral = twJoin(
  "transition",
  "hover:bg-neutral-200",
  "active:bg-neutral-300",
);

export const actionOpacity = twJoin(
  "transition",
  "hover:opacity-80",
  "active:opacity-60",
);

export const title = twJoin("text-2xl font-bold");

export const actionToDark = twJoin(
  "transition",
  "hover:brightness-90",
  "active:brightness-80",
);
