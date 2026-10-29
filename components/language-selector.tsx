"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Choice } from "@/components/shared";
import { languageOptions } from "@/lib/data";
import { isLocale } from "@/lib/constants";
import { setLocale } from "@/i18n/actions";

export function LanguageSelector() {
  const locale = useLocale(); const t = useTranslations(); const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className="flex items-center gap-2">
    <Choice label={t("language")} value={locale} options={languageOptions} onChange={(value) => {
      if (isLocale(value)) startTransition(async () => { await setLocale(value); router.refresh(); });
    }} />
    {pending && <span role="status" className="sr-only">{t("languageUpdating")}</span>}
  </div>;
}
