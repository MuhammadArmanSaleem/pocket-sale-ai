"use client";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Money } from "@/components/shared";
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
import { IMPORT_HEADERS, MAX_IMPORT_BYTES } from "@/lib/constants";
import type { Product, ImportDialogProps } from "@/lib/types";
import { parseImportRows } from "@/lib/import";
import { readSpreadsheet } from "@/lib/spreadsheet";
export function ImportDialog({ open, setOpen, onImport }: ImportDialogProps) {
  const t = useTranslations();
  const generation = useRef(0);
  function resetAndClose() {
    generation.current++;
    setRows([]);
    setError(false);
    setLoading(false);
    setOpen(false);
  }
  const [rows, setRows] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetAndClose();
        else setOpen(true);
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
              const request = ++generation.current;
              setLoading(true);
              try {
                const values = await readSpreadsheet(file);
                if (generation.current === request)
                  setRows(parseImportRows(values));
              } catch {
                if (generation.current === request) setError(true);
              } finally {
                if (generation.current === request) setLoading(false);
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
              <section key={p.id} className="border-b py-4 last:border-0">
                <h3 className="font-semibold break-words">{p.name}</h3>
                <p className="mb-3 text-xs">
                  {p.category} · {p.variants.length} {t("variants")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {p.variants.map((v) => (
                    <dl
                      key={v.id}
                      className="grid grid-cols-2 gap-2 rounded-lg border bg-background p-3 text-sm"
                    >
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {t("size")}
                        </dt>
                        <dd className="break-words">
                          <bdi>{v.size}</bdi>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {t("colour")}
                        </dt>
                        <dd className="break-words">
                          <bdi>{v.colour}</bdi>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {t("price")}
                        </dt>
                        <dd>
                          <Money value={v.price} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {t("stock")}
                        </dt>
                        <dd>
                          <bdi>{v.stock}</bdi> {t("units")}
                        </dd>
                      </div>
                    </dl>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
        <div className="form-actions">
          <Button variant="outline" onClick={resetAndClose}>
            {t("cancel")}
          </Button>
          <Button
            disabled={!rows.length || loading}
            onClick={() => {
              onImport(rows);
              resetAndClose();
            }}
          >
            {t("importConfirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
