import "@/app/globals.css";
import "@/style/prosemirror.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { LOCALES } from "@/constants/common";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Start",
  description: "Code Start is a platform for competitive programming.",
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  let messages;
  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
