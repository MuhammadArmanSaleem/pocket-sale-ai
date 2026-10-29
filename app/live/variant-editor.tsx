"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { variantEditSchema } from "@/lib/validation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { removeVariantAction } from "./actions";
import { updateVariantAction } from "./actions";

export function VariantEditor(props: { variantCount: number; variantId: string; productId: string; version: string; size: string; colour: string; price: number; stock: number }) {
  const t = useTranslations(); const router = useRouter();
  const [open, setOpen] = useState(false); const [failed, setFailed] = useState(false);
  const [confirm, setConfirm] = useState(false); const [removing, setRemoving] = useState(false); const [removeFailed, setRemoveFailed] = useState(false);
  const { variantCount, ...variantValues } = props;
  const form = useFormik({ initialValues: variantValues, validationSchema: variantEditSchema, onSubmit: async value => {
    setFailed(false); const result = await updateVariantAction(value);
    if (!result.ok) { setFailed(true); return; }
    setOpen(false); router.refresh();
  }});
  if (!open) return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => { form.resetForm({ values: variantValues }); setFailed(false); setOpen(true); }}>{t("edit")}</Button>
    <Button type="button" variant="outline" disabled={variantCount <= 1} onClick={() => { setRemoveFailed(false); setConfirm(true); }}>{t("remove")}</Button>
    <Dialog open={confirm} onOpenChange={value => { if (!removing) setConfirm(value); }}><DialogContent><DialogHeader><DialogTitle>{t("removeVariantTitle")}</DialogTitle><DialogDescription>{t("removeVariantDescription")}</DialogDescription></DialogHeader>
      {removeFailed && <p role="alert">{t("removeVariantFailed")}</p>}
      <div className="flex gap-2"><Button type="button" variant="outline" disabled={removing} onClick={() => setConfirm(false)}>{t("cancel")}</Button><Button type="button" variant="destructive" disabled={removing} onClick={async () => { setRemoving(true); setRemoveFailed(false); try { const result = await removeVariantAction({ variantId: props.variantId, productId: props.productId, version: props.version }); if (!result.ok) { setRemoveFailed(true); return; } setConfirm(false); router.refresh(); } catch { setRemoveFailed(true); } finally { setRemoving(false); } }}>{t("remove")}</Button></div>
    </DialogContent></Dialog>
  </div>;
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
