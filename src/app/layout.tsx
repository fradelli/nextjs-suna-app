import { Inter } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { activeBrandVariantId } from "@/config/brand";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { I18nClientProvider } from "@/i18n/i18n-client-provider";
import messages from "@/i18n/messages/pt-BR.json";
import { getSeoLocalization } from "@/lib/seo/seo-localization";
import { createRootMetadata } from "@/lib/seo/seo-metadata";
import { AppProviders } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata() {
  return createRootMetadata(await getSeoLocalization());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setRequestLocale(DEFAULT_LOCALE);

  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${inter.variable} dark h-full antialiased`}
      data-brand-variant={activeBrandVariantId}
    >
      <body className="flex min-h-dvh flex-col">
        <I18nClientProvider locale={DEFAULT_LOCALE} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </I18nClientProvider>
      </body>
    </html>
  );
}
