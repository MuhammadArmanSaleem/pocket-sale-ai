"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { supportTicketSchema, supportReplySchema } from "@/lib/validation";
import { createSupportAction, replySupportAction } from "./actions";

export function SupportForm({ ticketId }: { ticketId?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const create = useFormik({ initialValues: { subject: "", body: "" }, validationSchema: supportTicketSchema, onSubmit: async (value, helpers) => {
    setStatus(null); const result = await createSupportAction(value); setStatus(result.ok ? "success" : "error");
    if (result.ok) { helpers.resetForm(); router.refresh(); }
  }});
  const reply = useFormik({ initialValues: { ticketId: ticketId ?? "", body: "" }, validationSchema: supportReplySchema, onSubmit: async (value, helpers) => {
    setStatus(null); const result = await replySupportAction(value); setStatus(result.ok ? "success" : "error");
    if (result.ok) { helpers.resetForm(); router.refresh(); }
  }});
  const form = ticketId ? reply : create;
  return <form className="grid gap-3" noValidate onSubmit={form.handleSubmit}>
    {!ticketId && <Field label={t("subject")} name="subject" value={create.values.subject} onChange={create.handleChange} onBlur={create.handleBlur} />}
    <Field label={t("message")} name="body" value={form.values.body} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    {status === "error" && <p role="alert">{t("saveFailed")}</p>}
    {status === "success" && <p role="status">{t("saved")}</p>}
    <Button type="submit" disabled={form.isSubmitting}>{t(ticketId ? "send" : "newQuery")}</Button>
  </form>;
}
