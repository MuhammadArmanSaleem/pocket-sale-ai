import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { DirectionProvider } from "@/components/ui/direction";
import { DEFAULT_LOCALE, isLocale, LOCALE_DIRECTION } from "@/lib/constants";
import type { RootLayoutProps } from "@/lib/types";
import "./globals.css";
export const metadata: Metadata = {
  title: "PocketSales AI",
  description: "Bilingual seller and super admin workspace.",
};
export default async function RootLayout({ children }: RootLayoutProps) {
  const value = await getLocale();
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  return (
    <html lang={locale} dir={LOCALE_DIRECTION[locale]}>
      <body>
        <NextIntlClientProvider locale={locale} messages={await getMessages()}>
          <DirectionProvider dir={LOCALE_DIRECTION[locale]}>
            {children}
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
