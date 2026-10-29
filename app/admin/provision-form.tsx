"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ownerProvisionSchema } from "@/lib/validation";
import type { OwnerProvisionResult } from "@/lib/types";
import { provisionOwnerAction } from "./provision-action";

export function ProvisionForm() {
  const t = useTranslations(); const router = useRouter();
  const [result, setResult] = useState<OwnerProvisionResult | null>(null);
  const form = useFormik({
    initialValues: { email: "", password: "", ownerName: "", shopName: "", phone: "" },
    validationSchema: ownerProvisionSchema,
    onSubmit: async (values, helpers) => {
      setResult(null);
      try {
        const response = await provisionOwnerAction(values); setResult(response);
        helpers.setFieldValue("password", "", false);
        if (response.status === "success") { helpers.resetForm(); router.refresh(); }
      } catch { helpers.setFieldValue("password", "", false); setResult({ status: "review" }); }
    },
  });
  const blocked = result?.status === "partial" || result?.status === "review";
  return <form className="surface grid gap-3 p-6" onSubmit={form.handleSubmit} noValidate>
    <h2>{t("provisionOwnerTitle")}</h2><p>{t("provisionOwnerHint")}</p>
    <Field label={t("email")} name="email" type="email" autoComplete="off" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={!!(form.touched.email && form.errors.email)} aria-describedby={form.touched.email && form.errors.email ? "owner-email-error" : undefined} />
    {form.touched.email && form.errors.email && <p id="owner-email-error" role="alert">{t("ownerEmailError")}</p>}
    <Field label={t("owner")} name="ownerName" value={form.values.ownerName} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={!!(form.touched.ownerName && form.errors.ownerName)} aria-describedby={form.touched.ownerName && form.errors.ownerName ? "owner-name-error" : undefined} />
    {form.touched.ownerName && form.errors.ownerName && <p id="owner-name-error" role="alert">{t("ownerNameError")}</p>}
    <Field label={t("shopName")} name="shopName" value={form.values.shopName} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={!!(form.touched.shopName && form.errors.shopName)} aria-describedby={form.touched.shopName && form.errors.shopName ? "owner-shop-error" : undefined} />
    {form.touched.shopName && form.errors.shopName && <p id="owner-shop-error" role="alert">{t("ownerShopError")}</p>}
    <Field label={t("phone")} name="phone" type="tel" autoComplete="off" value={form.values.phone} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={!!(form.touched.phone && form.errors.phone)} aria-describedby={form.touched.phone && form.errors.phone ? "owner-phone-error" : undefined} />
    {form.touched.phone && form.errors.phone && <p id="owner-phone-error" role="alert">{t("ownerPhoneError")}</p>}
    <Field label={t("provisionPassword")} name="password" type="password" autoComplete="new-password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} aria-invalid={!!(form.touched.password && form.errors.password)} aria-describedby={form.touched.password && form.errors.password ? "owner-password-error" : undefined} />
    {form.touched.password && form.errors.password && <p id="owner-password-error" role="alert">{t("ownerPasswordError")}</p>}
    <p>{t("provisionRequirements")}</p>
    {form.submitCount > 0 && !form.isValid && <p role="alert">{t("provisionInvalid")}</p>}
    {result?.status === "success" && <p role="status">{t("provisionSuccess")}</p>}
    {result?.status === "partial" && <p role="alert">{t("provisionPartial")} <bdi>{result.userId}</bdi></p>}
    {result?.status === "review" && <p role="alert">{t("provisionReview")}</p>}
    {result?.status === "duplicate" && <p role="alert">{t("provisionDuplicate")}</p>}
    {result?.status === "weak_password" && <p role="alert">{t("provisionWeakPassword")}</p>}
    {result?.status === "rate_limited" && <p role="alert">{t("provisionRateLimited")}</p>}
    {(result?.status === "invalid" || result?.status === "unauthorized" || result?.status === "unavailable") && <p role="alert">{t("provisionUnavailable")}</p>}
    <Button type="submit" disabled={form.isSubmitting || blocked}>{t("provisionOwnerTitle")}</Button>
  </form>;
}
