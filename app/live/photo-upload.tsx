"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_PHOTOS, PRODUCT_IMAGE_BUCKET } from "@/lib/constants";
import { validPhotoHeader } from "@/lib/photo-validation";
import { createClient } from "@/lib/supabase/client";

export function PhotoUpload({ shopId, productId, photoCount }: { shopId: string; productId: string; photoCount: number }) {
  const t = useTranslations(); const router = useRouter();
  const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"invalid" | "failed" | "review" | "success" | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!file || busy || photoCount >= MAX_PHOTOS) return;
    setBusy(true); setStatus(null);
    try {
      const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      if (!validPhotoHeader(header, file.type, file.size)) { setStatus("invalid"); return; }
      const client = createClient();
      const name = `${shopId}/${productId}/${crypto.randomUUID()}`;
      const uploaded = await client.storage.from(PRODUCT_IMAGE_BUCKET).upload(name, file, { contentType: file.type, upsert: false });
      if (uploaded.error) { setStatus("review"); return; }
      const result = await client.from("product_images").insert({ shop_id: shopId, product_id: productId, object_name: name, sort_order: photoCount, alt_text: "" });
      if (result.error) {
        if (result.status >= 400 && result.status < 500) {
          const cleanup = await client.storage.from(PRODUCT_IMAGE_BUCKET).remove([name]);
          setStatus(cleanup.error ? "review" : "failed");
        } else setStatus("review");
        return;
      }
      setFile(null); setStatus("success"); router.refresh();
    } catch { setStatus("review"); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="grid gap-2 rounded-lg border p-4">
    <Label htmlFor={`photo-${productId}`}>{t("photoUploadLabel")}</Label>
    <Input id={`photo-${productId}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || status === "review" || photoCount >= MAX_PHOTOS} onChange={event => { setFile(event.target.files?.[0] ?? null); setStatus(null); }} />
    <p className="muted">{t("photoUploadHint")}</p>
    {status === "invalid" && <p role="alert">{t("photoInvalid")}</p>}
    {status === "failed" && <p role="alert">{t("photoSaveFailed")}</p>}
    {status === "review" && <p role="alert">{t("photoReview")}</p>}
    {status === "success" && <p role="status">{t("photoSaved")}</p>}
    <Button type="submit" variant="outline" disabled={!file || busy || status === "review" || photoCount >= MAX_PHOTOS}>{busy ? t("photoSaving") : t("upload")}</Button>
  </form>;
}
