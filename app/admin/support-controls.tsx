"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { supportReplySchema } from "@/lib/validation";
import { adminReplyAction, adminStatusAction } from "./actions";

export function AdminSupportControls({ ticketId }: { ticketId: string }) {
  const t = useTranslations(); const router = useRouter();
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [pending, setPending] = useState(false);
  const form = useFormik({ initialValues: { ticketId, body: "" }, validationSchema: supportReplySchema, onSubmit: async (value, helpers) => {
    setStatus(null); const result = await adminReplyAction(value); setStatus(result.ok ? "success" : "error");
    if (result.ok) { helpers.resetForm(); router.refresh(); }
  }});
  async function resolve() {
    setPending(true); setStatus(null);
    try { const result = await adminStatusAction({ ticketId, status: "resolved" }); setStatus(result.ok ? "success" : "error"); if (result.ok) router.refresh(); }
    finally { setPending(false); }
  }
  return <div className="grid gap-3"><form onSubmit={form.handleSubmit} noValidate className="grid gap-3">
    <Field label={t("message")} name="body" value={form.values.body} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    <Button type="submit" disabled={form.isSubmitting || pending}>{t("send")}</Button>
  </form><Button type="button" variant="outline" onClick={resolve} disabled={pending || form.isSubmitting}>{t("resolved")}</Button>
    {status === "success" && <p role="status">{t("saved")}</p>}{status === "error" && <p role="alert">{t("saveFailed")}</p>}
  </div>;
}
