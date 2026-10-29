"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { productDetailsSchema } from "@/lib/validation";
import { updateProductDetailsAction } from "./actions";

export function ProductDetailsEditor(props: { productId: string; version: string; name: string; category: string; description: string }) {
  const t = useTranslations(); const router = useRouter();
  const [open, setOpen] = useState(false); const [failed, setFailed] = useState(false);
  const form = useFormik({ initialValues: props, enableReinitialize: false, validationSchema: productDetailsSchema, onSubmit: async (value) => {
    setFailed(false);
    const result = await updateProductDetailsAction(value);
    if (!result.ok) { setFailed(true); return; }
    setOpen(false); router.refresh();
  }});
  if (!open) return <Button type="button" variant="outline" onClick={() => { form.resetForm({ values: props }); setFailed(false); setOpen(true); }}>{t("edit")}</Button>;
  return <form noValidate onSubmit={form.handleSubmit} className="grid gap-3 rounded-lg border p-4">
    <p>{t("productEditHint")}</p>
    <Field label={t("name")} name="name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("category")} name="category" value={form.values.category} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("description")} name="description" value={form.values.description} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    {failed && <p role="alert">{t("productEditFailed")}</p>}
    <div className="flex gap-2"><Button type="submit" disabled={form.isSubmitting}>{t("save")}</Button><Button type="button" variant="outline" disabled={form.isSubmitting} onClick={() => setOpen(false)}>{t("cancel")}</Button></div>
  </form>;
}
