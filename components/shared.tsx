"use client";
import { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
export function Field({ label, id, type, ...props }: FieldProps) {
  const t = useTranslations();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);
  const password = type === "password";
  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input
          {...props}
          id={inputId}
          type={password && revealed ? "text" : type}
          className={
            password ? "pe-12 " + (props.className ?? "") : props.className
          }
        />
        {password && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute end-0 top-0"
            aria-label={t(revealed ? "hidePassword" : "showPassword")}
            aria-controls={inputId}
            aria-pressed={revealed}
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
    </div>
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
