"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { passwordChangeSchema } from "@/lib/validation";
import { changePasswordAction } from "./actions";

export function PasswordForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const form = useFormik({ initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" }, validationSchema: passwordChangeSchema, onSubmit: async (value, helpers) => {
    setStatus(null); const result = await changePasswordAction(value); setStatus(result.ok ? "success" : "error"); if (result.ok) helpers.resetForm();
  }});
  return <form onSubmit={form.handleSubmit} noValidate className="surface grid gap-4 p-6">
    <Field label={t("currentPassword")} name="currentPassword" type="password" autoComplete="current-password" value={form.values.currentPassword} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("newPassword")} name="newPassword" type="password" autoComplete="new-password" value={form.values.newPassword} onChange={form.handleChange} onBlur={form.handleBlur} />
    <Field label={t("confirmPassword")} name="confirmPassword" type="password" autoComplete="new-password" value={form.values.confirmPassword} onChange={form.handleChange} onBlur={form.handleBlur} />
    <p>{t("passwordRequirements")}</p>
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("passwordInvalid")}</p>}
    {status === "error" && <p role="alert">{t("passwordChangeFailed")}</p>}
    {status === "success" && <p role="status">{t("passwordChanged")}</p>}
    <Button disabled={form.isSubmitting} type="submit">{t("save")}</Button>
  </form>;
}
