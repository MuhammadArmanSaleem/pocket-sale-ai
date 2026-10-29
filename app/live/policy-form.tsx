"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { shopPolicySchema } from "@/lib/validation";
import type { ShopPolicyInput } from "@/lib/types";
import { savePolicyAction } from "./actions";

export function PolicyForm({ initial }: { initial: ShopPolicyInput }) {
  const t = useTranslations();
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const form = useFormik({ initialValues: initial, validationSchema: shopPolicySchema, onSubmit: async (values) => {
    setStatus(null);
    const result = await savePolicyAction(values);
    setStatus(result.ok ? "success" : "error");
  }});
  return <form className="surface grid gap-4 p-6" noValidate onSubmit={form.handleSubmit}>
    <h2>{t("policies")}</h2>
    <Field label={t("deliveryTime")} name="deliveryTime" value={form.values.deliveryTime} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("deliveryCharges")} name="deliveryCharge" type="number" min="0" step="0.01" value={form.values.deliveryCharge} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("returns")} name="returnsPolicy" value={form.values.returnsPolicy} onChange={form.handleChange} onBlur={form.handleBlur} />
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("invalid")}</p>}
    {status === "success" && <p role="status">{t("saved")}</p>}
    {status === "error" && <p role="alert">{t("saveFailed")}</p>}
    <Button disabled={form.isSubmitting} type="submit">{t("save")}</Button>
  </form>;
}
