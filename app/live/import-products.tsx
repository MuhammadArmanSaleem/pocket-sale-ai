"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ImportDialog } from "@/features/catalogue/import-dialog";
import { prepareLiveImport, saveLiveImport } from "@/lib/import-batch";
import type { Product } from "@/lib/types";
import { createProductAction } from "./actions";

export function ImportProducts() {
  const t = useTranslations(); const router = useRouter();
  const [open, setOpen] = useState(false); const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"invalid" | "success" | "partial" | null>(null);
  const [count, setCount] = useState(0);
  async function submit(products: Product[]) {
    setPending(true); setStatus(null); setCount(0);
    try {
      const items = await prepareLiveImport(products);
      if (!items) { setStatus("invalid"); return; }
      const result = await saveLiveImport(items, createProductAction);
      setCount(result.saved); setStatus(result.ok ? "success" : "partial");
      router.refresh();
    } catch { setStatus("partial"); }
    finally { setPending(false); }
  }
  return <section className="surface grid gap-3 p-6">
    <h2>{t("importTitle")}</h2><p>{t("liveImportHint")}</p>
    <Button type="button" variant="outline" disabled={pending || status === "partial"} onClick={() => setOpen(true)}>{t("importTitle")}</Button>
    {pending && <p role="status">{t("liveImportPending")}</p>}
    {status === "invalid" && <p role="alert">{t("liveImportInvalid")}</p>}
    {status === "success" && <p role="status">{t("liveImportSuccess", { count })}</p>}
    {status === "partial" && <p role="alert">{t("liveImportPartial", { count })}</p>}
    <ImportDialog open={open} setOpen={setOpen} onImport={(products) => { void submit(products); }} />
  </section>;
}
