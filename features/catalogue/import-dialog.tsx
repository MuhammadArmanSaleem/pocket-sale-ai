"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  IMPORT_HEADERS,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_ROWS,
} from "@/lib/constants";
import type { Product, ImportDialogProps } from "@/lib/types";
import { parseImportRows } from "@/lib/import";
export function ImportDialog({ open, setOpen, onImport }: ImportDialogProps) {
  const t = useTranslations();
  const [rows, setRows] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setRows([]);
          setError(false);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[90dvh] overflow-auto sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{t("importTitle")}</DialogTitle>
          <DialogDescription>{t("importHint")}</DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob(
              [
                IMPORT_HEADERS.join(",") +
                  "\nCotton shirt,Shirts,M,Black,1850,5\n",
              ],
              { type: "text/csv" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "pocketsales-template.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          {t("downloadTemplate")}
        </Button>
        <Label className="field">
          {t("chooseFile")}
          <Input
            type="file"
            accept=".csv,.xlsx"
            disabled={loading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              setError(false);
              setRows([]);
              if (!file) return;
              if (
                file.size > MAX_IMPORT_BYTES ||
                !/\.(csv|xlsx)$/i.test(file.name)
              ) {
                setError(true);
                return;
              }
              setLoading(true);
              try {
                const XLSX = await import("xlsx");
                const workbook = XLSX.read(await file.arrayBuffer(), {
                  type: "array",
                  sheetRows: MAX_IMPORT_ROWS + 2,
                });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const values = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
                  header: 1,
                  defval: "",
                });
                setRows(parseImportRows(values));
              } catch {
                setError(true);
              } finally {
                setLoading(false);
              }
            }}
          />
        </Label>
        <h2>{t("mapping")}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {IMPORT_HEADERS.map((h) => (
            <span
              className="rounded border bg-muted p-2 text-sm"
              dir="ltr"
              key={h}
            >
              {h} → {h}
            </span>
          ))}
        </div>
        <p className="muted">{t("mappingHint")}</p>
        {loading && <p role="status">{t("upload")}…</p>}
        {error && (
          <p className="text-destructive" role="alert">
            {t("importError")}
          </p>
        )}
        {rows.length > 0 && (
          <div className="surface p-4">
            <h2>{t("importPreview")}</h2>
            <p>
              {t("importCount", {
                count: rows.reduce((s, p) => s + p.variants.length, 0),
              })}
            </p>
            {rows.map((p) => (
              <div key={p.id} className="border-b py-2 text-sm">
                {p.name} · {p.variants.length} {t("variants")}
              </div>
            ))}
          </div>
        )}
        <div className="form-actions">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            disabled={!rows.length || loading}
            onClick={() => {
              onImport(rows);
              setRows([]);
              setOpen(false);
            }}
          >
            {t("importConfirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
