import "@/app/globals.css";
import "@/style/prosemirror.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { ILocale } from "@/types/common";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ko" }];
}

export function generateMetadata({
  params,
}: {
  params: { locale: ILocale };
}): Metadata {
  if (params.locale === "en") {
    return {
      metadataBase: new URL("https://www.opencody.com"),
      alternates: {
        canonical: "/en",
        languages: {
          "ko-KR": "/ko",
        },
      },
      title: "OpenCody | Coding Learning with an AI Tutor",
      description:
        "With OpenCody, every problem you solve becomes a new learning experience. Embark on a genuine coding journey with an AI tutor.",
      openGraph: {
        title: "OpenCody | Coding Learning with an AI Tutor",
        description:
          "With OpenCody, every problem you solve becomes a new learning experience. Embark on a genuine coding journey with an AI tutor.",
        type: "website",
        url: "https://www.opencody.com",
        siteName: "OpenCody",
      },
    };
  } else {
    return {
      metadataBase: new URL("https://www.opencody.com"),
      alternates: {
        canonical: "/ko",
        languages: {
          "en-US": "/en",
        },
      },
      title: "OpenCody | AI 선생님과 함께하는 코딩 학습",
      description:
        "OpenCody에서는 어디서든 문제를 풀 때마다 새로운 학습 경험이 시작됩니다. AI 선생님과 함께하는 진정한 코딩 여정을 경험해보세요.",
      openGraph: {
        title: "OpenCody | AI 선생님과 함께하는 코딩 학습",
        description:
          "OpenCody에서는 어디서든 문제를 풀 때마다 새로운 학습 경험이 시작됩니다. AI 선생님과 함께하는 진정한 코딩 여정을 경험해보세요.",
        type: "website",
        url: "https://www.opencody.com",
        siteName: "OpenCody",
      },
    };
  }
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
