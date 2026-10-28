"use client";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  FieldProps,
  HeadingProps,
  ChoiceProps,
  MoneyProps,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function Field({ label, ...props }: FieldProps) {
  return (
    <Label className="field">
      <span>{label}</span>
      <Input {...props} />
    </Label>
  );
}
export function Heading({ title, subtitle, action }: HeadingProps) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">PocketSales AI</div>
        <h1>{title}</h1>
        <p className="mt-3 max-w-xl">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
export function Empty() {
  const t = useTranslations();
  return (
    <div className="empty">
      <h2>{t("noResults")}</h2>
      <p>{t("noResultsSub")}</p>
    </div>
  );
}
export function Choice({ label, value, onChange, options }: ChoiceProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="min-h-10 w-auto min-w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function Money({ value }: MoneyProps) {
  return <bdi>Rs {value.toLocaleString("en-PK")}</bdi>;
}
