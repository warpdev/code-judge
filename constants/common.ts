export const PROBLEM_LIST_PAGE_SIZE = 10;

export const JUDGE_API_URL = "http://34.64.215.10:2358";

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

export const LOCALES = ["en", "ko"];

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
};
