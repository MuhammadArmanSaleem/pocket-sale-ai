"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { MAX_PRODUCT_VARIANTS } from "@/lib/constants";
import { newVariant } from "@/lib/data";
import { variantAddSchema } from "@/lib/validation";
import { addVariantAction } from "./actions";

export function AddVariantForm({ productId, variantCount }: { productId: string; variantCount: number }) {
  const t = useTranslations(); const router = useRouter();
  const [open, setOpen] = useState(false); const [failed, setFailed] = useState(false);
  const form = useFormik({ initialValues: { productId, ...newVariant }, validationSchema: variantAddSchema, onSubmit: async (value, helpers) => {
    setFailed(false); const result = await addVariantAction(value);
    if (!result.ok) { setFailed(true); return; }
    helpers.resetForm(); setOpen(false); router.refresh();
  }});
  if (!open) return <Button type="button" variant="outline" disabled={variantCount >= MAX_PRODUCT_VARIANTS} onClick={() => setOpen(true)}>{t("addVariant")}</Button>;
  return <form onSubmit={form.handleSubmit} noValidate className="grid gap-3 rounded-lg border p-4">
    <Field label={t("size")} name="size" value={form.values.size} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("colour")} name="colour" value={form.values.colour} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("price")} name="price" type="number" min="0.01" step="0.01" value={form.values.price} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("stock")} name="stock" type="number" min="0" step="1" value={form.values.stock} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}{failed && <p role="alert">{t("addVariantFailed")}</p>}
    <div className="flex gap-2"><Button disabled={form.isSubmitting} type="submit">{t("save")}</Button><Button disabled={form.isSubmitting} type="button" variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button></div>
  </form>;
}
