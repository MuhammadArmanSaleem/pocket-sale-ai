"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function EntryError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();
  return <main className="mx-auto grid max-w-xl gap-4 p-6" role="alert"><h1>{t("accountUnavailableTitle")}</h1><p>{t("accountCheckFailed")}</p><Button onClick={reset}>{t("retryAccount")}</Button></main>;
}
