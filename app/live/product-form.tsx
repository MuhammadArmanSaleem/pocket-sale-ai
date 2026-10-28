"use client";
import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/shared";
import { createProductSchema } from "@/lib/validation";
import { createProductAction } from "./actions";

export function ProductForm() {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const form = useFormik({
    initialValues: { name: "", category: "", description: "", visible: true, variants: [{ size: "", colour: "", price: 0, stock: 0 }] },
    validationSchema: createProductSchema,
    onSubmit: async (value, helpers) => {
      setStatus(null);
      const result = await createProductAction(value);
      if (!result.ok) { setStatus("error"); return; }
      helpers.resetForm();
      setStatus("success");
      router.refresh();
    },
  });
  return <form onSubmit={form.handleSubmit} className="surface grid gap-4 p-6" noValidate>
    <h2>{t("addProduct")}</h2>
    <Field label={t("name")} name="name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={Boolean(form.touched.name && form.errors.name)} />
    <Field label={t("category")} name="category" value={form.values.category} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("description")} name="description" value={form.values.description} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("size")} name="variants[0].size" value={form.values.variants[0].size} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("colour")} name="variants[0].colour" value={form.values.variants[0].colour} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("price")} name="variants[0].price" type="number" min="0.01" step="0.01" value={form.values.variants[0].price} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("stock")} name="variants[0].stock" type="number" min="0" step="1" value={form.values.variants[0].stock} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    {status === "error" && <p role="alert">{t("saveFailed")}</p>}
    {status === "success" && <p role="status">{t("saved")}</p>}
    <Button type="submit" disabled={form.isSubmitting}>{t("save")}</Button>
  </form>;
}
