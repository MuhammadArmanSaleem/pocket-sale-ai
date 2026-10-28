"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/shared";
import { loginSchema } from "@/lib/validation";
import { signIn } from "./actions";

export function LoginForm({ failed }: { failed: boolean }) {
  const t = useTranslations();
  const form = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const data = new FormData();
      data.set("email", values.email.trim());
      data.set("password", values.password);
      await signIn(data);
    },
  });
  const emailError = Boolean(form.touched.email && form.errors.email);
  const passwordError = Boolean(form.touched.password && form.errors.password);
  return (
    <form noValidate onSubmit={form.handleSubmit} className="grid gap-4">
      <Field label={t("email")} name="email" type="email" autoComplete="username" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={emailError} aria-describedby={emailError ? "auth-email-error" : undefined} />
      {emailError && <p id="auth-email-error" role="alert">{t("invalidEmail")}</p>}
      <Field label={t("password")} name="password" type="password" autoComplete="current-password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={passwordError} aria-describedby={passwordError ? "auth-password-error" : undefined} />
      {passwordError && <p id="auth-password-error" role="alert">{t("requiredPassword")}</p>}
      <Button type="submit" disabled={form.isSubmitting}>{t("login")}</Button>
      {failed && <p role="alert">{t("authFailed")}</p>}
    </form>
  );
}
