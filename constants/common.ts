export const PROBLEM_LIST_PAGE_SIZE = 2;

export const JUDGE_API_URL = process.env.JUDGE_HOST || "";

export const NAV_LINKS = [
  {
    name: "problems",
    href: "/problems",
  },
  {
    name: "submissions",
    href: "/submissions",
  },
];

export const LOCALES = ["en", "ko"] as const;

export const LOCALE_MAP: Record<
  (typeof LOCALES)[number],
  {
    id: number;
    name: string;
  }
> = {
  en: {
    id: 0,
    name: "english",
  },
  ko: {
    id: 1,
    name: "korean",
  },
} as const;
