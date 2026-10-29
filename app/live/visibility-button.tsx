"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { productVisibilityAction } from "./actions";

export function VisibilityButton({ productId, visible }: { productId: string; visible: boolean }) {
  const t = useTranslations(); const router = useRouter();
  const [pending, setPending] = useState(false); const [failed, setFailed] = useState(false);
  async function change() {
    setPending(true); setFailed(false);
    try {
      const result = await productVisibilityAction({ productId, visible: !visible });
      if (!result.ok) { setFailed(true); router.refresh(); return; }
      router.refresh();
    } catch { setFailed(true); }
    finally { setPending(false); }
  }
  return <div className="grid gap-2"><Button type="button" variant="outline" disabled={pending} onClick={change}>{t(visible ? "hide" : "show")}</Button>{failed && <p role="alert">{t("visibilityFailed")}</p>}</div>;
}
