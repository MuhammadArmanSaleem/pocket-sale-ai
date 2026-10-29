"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { variantEditSchema } from "@/lib/validation";
import { updateVariantAction } from "./actions";

export function VariantEditor(props: { variantId: string; productId: string; version: string; size: string; colour: string; price: number; stock: number }) {
  const t = useTranslations(); const router = useRouter();
  const [open, setOpen] = useState(false); const [failed, setFailed] = useState(false);
  const form = useFormik({ initialValues: props, validationSchema: variantEditSchema, onSubmit: async value => {
    setFailed(false); const result = await updateVariantAction(value);
    if (!result.ok) { setFailed(true); return; }
    setOpen(false); router.refresh();
  }});
  if (!open) return <Button type="button" variant="outline" onClick={() => { form.resetForm({ values: props }); setFailed(false); setOpen(true); }}>{t("edit")}</Button>;
  return <form noValidate onSubmit={form.handleSubmit} className="grid gap-3 rounded-lg border p-4">
    <Field label={t("size")} name="size" value={form.values.size} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("colour")} name="colour" value={form.values.colour} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("price")} name="price" type="number" min="0.01" step="0.01" value={form.values.price} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("stock")} name="stock" type="number" min="0" step="1" value={form.values.stock} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    {failed && <p role="alert">{t("variantEditFailed")}</p>}
    <div className="flex gap-2"><Button type="submit" disabled={form.isSubmitting}>{t("save")}</Button><Button type="button" variant="outline" disabled={form.isSubmitting} onClick={() => setOpen(false)}>{t("cancel")}</Button></div>
  </form>;
}
