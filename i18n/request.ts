import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/lib/constants";
import en from "@/messages/en";
import ur from "@/messages/ur";
export default getRequestConfig(async () => {
  const candidate = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(candidate) ? candidate : DEFAULT_LOCALE;
  return { locale, messages: locale === "ur" ? ur : en };
});
