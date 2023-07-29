export const PROBLEM_LIST_PAGE_SIZE = 10;

export const JUDGE_API_URL = process.env.JUDGE_HOST || "";

//TODO: merge my submission and problem
export const NAV_LINKS = [
  //TODO: add problems page
  // {
  //   name: "problems",
  //   href: "/problems",
  //   requiredAuth: false,
  // },
  {
    name: "lectures",
    href: "/lectures",
    requiredAuth: false,
  },
  {
    name: "myProblems",
    href: "/my-problems",
    requiredAuth: true,
  },
  {
    name: "mySubmissions",
    href: "/submissions",
    requiredAuth: true,
  },
  {
    name: "profile",
    href: "/profile",
    requiredAuth: true,
  },
  {
    name: "signIn",
    href: "/api/auth/signin",
    requiredAuth: false,
    onlyNoAuth: true,
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
