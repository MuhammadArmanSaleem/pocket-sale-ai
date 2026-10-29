"use client";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/shared";
import { createProductSchema } from "@/lib/validation";
import { MAX_PRODUCT_VARIANTS } from "@/lib/constants";
import { newVariant } from "@/lib/data";
import { findDuplicateVariant } from "@/lib/variants";
import { createProductAction } from "./actions";

export function ProductForm() {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const [rowIds, setRowIds] = useState<string[]>(["initial"]);
  const form = useFormik({
    initialValues: { name: "", category: "", description: "", visible: true, variants: [{ ...newVariant }] },
    validationSchema: createProductSchema,
    onSubmit: async (value, helpers) => {
      setStatus(null);
      const result = await createProductAction(value);
      if (!result.ok) { setStatus("error"); return; }
      helpers.resetForm();
      setRowIds(["initial"]);
      setStatus("success");
      router.refresh();
    },
  });
  const duplicate = findDuplicateVariant(form.values.variants);
  return <FormikProvider value={form}><form onSubmit={form.handleSubmit} className="surface grid gap-4 p-6" noValidate>
    <h2>{t("addProduct")}</h2>
    <Field label={t("name")} name="name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={Boolean(form.touched.name && form.errors.name)} />
    <Field label={t("category")} name="category" value={form.values.category} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("description")} name="description" value={form.values.description} onChange={form.handleChange} onBlur={form.handleBlur} />
    <label className="flex items-center gap-3"><Switch checked={form.values.visible} onCheckedChange={value => form.setFieldValue("visible", value)} />{t(form.values.visible ? "active" : "hidden")}</label>
    <FieldArray name="variants">{helpers => <div className="grid gap-4">
      <h3>{t("variants")}</h3>
      {form.values.variants.map((variant, index) => <section key={rowIds[index]} className="grid gap-3 rounded-lg border p-4">
        <p>{t("variantNumber", { number: index + 1 })}</p>
        <Field label={t("size")} name={`variants[${index}].size`} value={variant.size} onChange={form.handleChange} onBlur={form.handleBlur} />
        <Field label={t("colour")} name={`variants[${index}].colour`} value={variant.colour} onChange={form.handleChange} onBlur={form.handleBlur} />
        <Field label={t("price")} name={`variants[${index}].price`} type="number" min="0.01" step="0.01" value={variant.price} onChange={form.handleChange} onBlur={form.handleBlur} />
        <Field label={t("stock")} name={`variants[${index}].stock`} type="number" min="0" step="1" value={variant.stock} onChange={form.handleChange} onBlur={form.handleBlur} />
        <Button type="button" variant="outline" disabled={form.values.variants.length === 1 || form.isSubmitting} onClick={() => { helpers.remove(index); setRowIds(ids => ids.filter((_, i) => i !== index)); }}>{t("remove")}</Button>
      </section>)}
      <Button type="button" variant="outline" disabled={form.values.variants.length >= MAX_PRODUCT_VARIANTS || form.isSubmitting} onClick={() => { helpers.push({ ...newVariant }); setRowIds(ids => [...ids, crypto.randomUUID()]); }}>{t("addVariant")}</Button>
    </div>}</FieldArray>
    {form.submitCount > 0 && duplicate && <p role="alert">{t("duplicateVariant", { first: duplicate.first, second: duplicate.second, size: duplicate.size, colour: duplicate.colour })}</p>}
    {form.submitCount > 0 && !form.isValid && !duplicate && <p role="alert">{t("invalid")}</p>}
    {status === "error" && <p role="alert">{t("saveFailed")}</p>}
    {status === "success" && <p role="status">{t("saved")}</p>}
    <Button type="submit" disabled={form.isSubmitting}>{t("save")}</Button>
  </form></FormikProvider>;
}
