import { getRequestConfig } from "next-intl/server";

export const getMessages = async (locale: string) => ({
  common: (await import(`@/messages/${locale}/common.json`)).default,
  error: (await import(`@/messages/${locale}/error.json`)).default,
  header: (await import(`@/messages/${locale}/header.json`)).default,
  home: (await import(`@/messages/${locale}/home.json`)).default,
  lecture: (await import(`@/messages/${locale}/lecture.json`)).default,
  modal: (await import(`@/messages/${locale}/modal.json`)).default,
  problem: (await import(`@/messages/${locale}/problem.json`)).default,
  profile: (await import(`@/messages/${locale}/profile.json`)).default,
  solving: (await import(`@/messages/${locale}/solving.json`)).default,
  submission: (await import(`@/messages/${locale}/submission.json`)).default,
  testcase: (await import(`@/messages/${locale}/testcase.json`)).default,
  toast: (await import(`@/messages/${locale}/toast.json`)).default,
  tooltip: (await import(`@/messages/${locale}/tooltip.json`)).default,
});

export default getRequestConfig(async ({ locale }) => ({
  messages: await getMessages(locale),
}));
