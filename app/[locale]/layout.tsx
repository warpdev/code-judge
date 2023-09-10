import "@/app/globals.css";
import "@/style/prosemirror.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OpenCody",
  description: "OpenCody is a platform for competitive programming.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ko" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages(locale);
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
