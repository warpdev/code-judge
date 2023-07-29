// Use type safe message keys with `next-intl`
interface Messages {
  common: typeof import("@/messages/ko/common.json");
  error: typeof import("@/messages/ko/error.json");
  header: typeof import("@/messages/ko/header.json");
  home: typeof import("@/messages/ko/home.json");
  lecture: typeof import("@/messages/ko/lecture.json");
  modal: typeof import("@/messages/ko/modal.json");
  problem: typeof import("@/messages/ko/problem.json");
  profile: typeof import("@/messages/ko/profile.json");
  solving: typeof import("@/messages/ko/solving.json");
  submission: typeof import("@/messages/ko/submission.json");
  testcase: typeof import("@/messages/ko/testcase.json");
  toast: typeof import("@/messages/ko/toast.json");
  tooltip: typeof import("@/messages/ko/tooltip.json");
}

interface EnMessages {
  common: typeof import("@/messages/en/common.json");
  error: typeof import("@/messages/en/error.json");
  header: typeof import("@/messages/en/header.json");
  home: typeof import("@/messages/en/home.json");
  lecture: typeof import("@/messages/en/lecture.json");
  modal: typeof import("@/messages/en/modal.json");
  problem: typeof import("@/messages/en/problem.json");
  profile: typeof import("@/messages/en/profile.json");
  solving: typeof import("@/messages/en/solving.json");
  submission: typeof import("@/messages/en/submission.json");
  testcase: typeof import("@/messages/en/testcase.json");
  toast: typeof import("@/messages/en/toast.json");
  tooltip: typeof import("@/messages/en/tooltip.json");
}

declare interface IntlMessages extends Messages {}
