"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus, Upload, Shirt, ImagePlus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Field, Heading, Empty, Money } from "@/components/shared";
import { productFilters, newVariant } from "@/lib/data";
import { MAX_PHOTOS, MAX_PHOTO_BYTES, PHOTO_MIME_TYPES } from "@/lib/constants";
import type {
  Product,
  ProductPhoto,
  VariantDraft,
  CatalogueProps,
  ProductEditorProps,
} from "@/lib/types";
import { findDuplicateVariant } from "@/lib/variants";
import { normalizeLeadingZeroes } from "@/lib/numbers";
import { ImportDialog } from "./import-dialog";
export function Catalogue({
  policies,
  setPolicies,
  products,
  onChange,
  notify,
}: CatalogueProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const dirty = useRef(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  function requestClose() {
    if (dirty.current) setDiscardOpen(true);
    else setOpen(false);
  }
  const filtered = products.filter(
    (p) =>
      (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "active" && p.visible) ||
        (filter === "hidden" && !p.visible) ||
        (filter === "low" && p.variants.some((v) => v.stock <= 3))),
  );
  function edit(p: Product | null) {
    dirty.current = false;
    setDiscardOpen(false);
    setEditing(p);
    setOpen(true);
  }
  return (
    <>
      <Heading
        title={t("catalogueTitle")}
        subtitle={t("catalogueSub")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload />
              {t("importProducts")}
            </Button>
            <Button onClick={() => edit(null)}>
              <Plus />
              {t("addProduct")}
            </Button>
          </div>
        }
      />
      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">{t("products")}</TabsTrigger>
          <TabsTrigger value="policies">{t("policies")}</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="mb-5 flex flex-wrap justify-between gap-4">
            <div className="relative min-w-48 flex-1 md:max-w-xs">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label={t("search")}
                className="ps-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search")}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {productFilters.map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "secondary" : "ghost"}
                  onClick={() => setFilter(f)}
                >
                  {t(f)}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <article className="surface overflow-hidden" key={p.id}>
                <div className="photo-placeholder relative aspect-[16/9] rounded-none">
                  {p.photos[0] ? (
                    <Image
                      unoptimized
                      width={640}
                      height={360}
                      src={p.photos[0].src}
                      alt={p.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Shirt className="size-16 stroke-1" />
                  )}
                  <span className="absolute end-3 top-3 status-pill bg-card">
                    {t(p.visible ? "active" : "hidden")}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {p.category}
                  </div>
                  <h2>{p.name}</h2>
                  <div className="mt-3 flex justify-between gap-2">
                    <span className="font-semibold">
                      <Money
                        value={Math.min(...p.variants.map((v) => v.price))}
                      />
                    </span>
                    <span className="muted">
                      {p.variants.reduce((s, v) => s + v.stock, 0)} {t("units")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.variants.map((v) => (
                      <span
                        key={v.id}
                        className="rounded bg-muted px-2 py-1 text-xs"
                      >
                        <bdi>
                          {v.size} / {v.colour}
                        </bdi>{" "}
                        · {v.stock}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-2 border-t pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => edit(p)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        onChange(
                          products.map((x) =>
                            x.id === p.id ? { ...x, visible: !x.visible } : x,
                          ),
                        )
                      }
                    >
                      {t(p.visible ? "hide" : "show")}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <Empty />}
        </TabsContent>
        <TabsContent value="policies">
          <form
            className="surface grid max-w-2xl gap-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const values = new FormData(e.currentTarget);
              setPolicies({
                deliveryTime: String(values.get("deliveryTime") ?? "").trim(),
                deliveryCharges: Number(values.get("deliveryCharges")),
                returns: String(values.get("returns") ?? "").trim(),
              });
              notify(t("saved"));
            }}
          >
            <Field
              label={t("deliveryTime")}
              name="deliveryTime"
              defaultValue={policies.deliveryTime}
              required
            />
            <Field
              label={t("deliveryCharges")}
              type="number"
              min={0}
              name="deliveryCharges"
              defaultValue={policies.deliveryCharges}
              onBlur={(e) => { e.currentTarget.value = normalizeLeadingZeroes(e.currentTarget.value); }}
              required
            />
            <Label className="field">
              {t("returns")}
              <Textarea
                required
                name="returns"
                defaultValue={policies.returns}
              />
            </Label>
            <Button className="justify-self-start">{t("save")}</Button>
          </form>
        </TabsContent>
      </Tabs>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) requestClose();
          else setOpen(true);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>
              {t(editing ? "editProduct" : "addProduct")}
            </DialogTitle>
            <DialogDescription>{t("productHelp")}</DialogDescription>
          </DialogHeader>
          {open && (
            <ProductEditor
              key={editing?.id ?? "new"}
              product={editing}
              onDirty={() => {
                dirty.current = true;
              }}
              onCancel={requestClose}
              onSave={(p) => {
                onChange(
                  editing
                    ? products.map((x) => (x.id === p.id ? p : x))
                    : [...products, p],
                );
                dirty.current = false;
                setOpen(false);
                notify(t("saved"));
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("unsavedTitle")}</DialogTitle>
            <DialogDescription>{t("unsavedDescription")}</DialogDescription>
          </DialogHeader>
          <div className="form-actions">
            <Button variant="outline" onClick={() => setDiscardOpen(false)}>
              {t("keepEditing")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                dirty.current = false;
                setDiscardOpen(false);
                setOpen(false);
              }}
            >
              {t("discardChanges")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ImportDialog
        open={importOpen}
        setOpen={setImportOpen}
        onImport={(rows) => {
          onChange([...products, ...rows]);
          notify(t("importDone"));
        }}
      />
    </>
  );
}
function ProductEditor({
  product,
  onCancel,
  onSave,
  onDirty,
}: ProductEditorProps) {
  const t = useTranslations();
  const [variants, setVariants] = useState<VariantDraft[]>(
    () =>
      product?.variants.map((v) => ({ ...v, price: String(v.price), stock: String(v.stock) })) ?? [
        { ...newVariant, price: "", stock: "", id: crypto.randomUUID() },
      ],
  );
  const [same, setSame] = useState(false);
  const [commonPrice, setCommonPrice] = useState(
    String(product?.variants[0]?.price ?? ""),
  );
  const [photosLoading, setPhotosLoading] = useState(false);
  const photoReadPending = useRef(false);
  const [photos, setPhotos] = useState<ProductPhoto[]>(product?.photos ?? []);
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [error, setError] = useState("");
  function update(id: string, patch: Partial<VariantDraft>) {
    setError("");
    onDirty();
    setVariants((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }
  return (
    <form
      className="grid gap-5"
      onChangeCapture={() => {
        onDirty();
        setError("");
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") ?? "").trim();
        if (photoReadPending.current) return;
        const common = commonPrice.trim() === "" ? NaN : Number(commonPrice);
        const actual = variants.map((v) => ({
          ...v,
          size: v.size.trim(),
          colour: v.colour.trim(),
          price: same ? common : v.price.trim() === "" ? NaN : Number(v.price),
          stock: v.stock.trim() === "" ? NaN : Number(v.stock),
        }));
        const duplicate = findDuplicateVariant(actual);
        if (duplicate) {
          setError(
            t("duplicateVariant", {
              first: duplicate.first,
              second: duplicate.second,
              size: duplicate.size,
              colour: duplicate.colour,
            }),
          );
          return;
        }
        if (
          !name ||
          actual.some(
            (v) =>
              !v.size ||
              !v.colour ||
              !Number.isFinite(v.price) ||
              v.price <= 0 ||
              !Number.isInteger(v.stock) ||
              v.stock < 0,
          )
        ) {
          setError(t("invalid"));
          return;
        }
        onSave({
          id: product?.id ?? crypto.randomUUID(),
          name,
          category: String(f.get("category") ?? ""),
          description: String(f.get("description") ?? ""),
          visible,
          variants: actual,
          photos,
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("name")}
          name="name"
          defaultValue={product?.name}
          required
          maxLength={100}
        />
        <Field
          label={t("category")}
          name="category"
          defaultValue={product?.category}
          required
          maxLength={60}
        />
        <Label className="field sm:col-span-2">
          {t("description")}
          <Textarea
            name="description"
            defaultValue={product?.description}
            maxLength={2000}
          />
        </Label>
      </div>
      <Label className="flex items-center gap-3">
        <Switch
          checked={same}
          onCheckedChange={(value) => {
            onDirty();
            setSame(value);
          }}
        />
        {t("samePrice")}
      </Label>
      {same && (
        <Field
          label={t("commonPrice")}
          name="common"
          type="number"
          min="0.01"
          step="0.01"
          value={commonPrice}
          onChange={(e) => setCommonPrice(normalizeLeadingZeroes(e.target.value))}
          required
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <h2>{t("variants")}</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onDirty();
            setVariants((v) => [
              ...v,
              { ...newVariant, price: "", stock: "", id: crypto.randomUUID() },
            ]);
          }}
        >
          <Plus />
          {t("addVariant")}
        </Button>
      </div>
      {variants.map((v) => (
        <div
          key={v.id}
          className="grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-5"
        >
          <Field
            label={t("size")}
            value={v.size}
            onChange={(e) => update(v.id, { size: e.target.value })}
            required
          />
          <Field
            label={t("colour")}
            value={v.colour}
            onChange={(e) => update(v.id, { colour: e.target.value })}
            required
          />
          {!same && (
            <Field
              label={t("price")}
              type="number"
              min="0.01"
              step="0.01"
              value={v.price}
              onChange={(e) => update(v.id, { price: normalizeLeadingZeroes(e.target.value) })}
              required
            />
          )}
          <Field
            label={t("stock")}
            type="number"
            min={0}
            step={1}
            value={v.stock}
            onChange={(e) => update(v.id, { stock: normalizeLeadingZeroes(e.target.value) })}
            required
          />
          <Button
            variant="ghost"
            type="button"
            className="self-end"
            disabled={variants.length === 1}
            aria-label={t("remove")}
            onClick={() => {
              onDirty();
              setVariants((vs) => vs.filter((x) => x.id !== v.id));
            }}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Label className="field">
        <span>{t("photos")}</span>
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          disabled={photosLoading}
          onChange={async (e) => {
            if (photoReadPending.current) return;
            const files = Array.from(e.target.files ?? []);
            if (
              files.length + photos.length > MAX_PHOTOS ||
              files.some(
                (f) =>
                  f.size > MAX_PHOTO_BYTES ||
                  !PHOTO_MIME_TYPES.includes(f.type),
              )
            ) {
              setError(t("photoError"));
              return;
            }
            photoReadPending.current = true;
            setPhotosLoading(true);
            const images = await Promise.all(
              files.map(
                (f) =>
                  new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () =>
                      typeof reader.result === "string"
                        ? resolve(reader.result)
                        : reject();
                    reader.onerror = reject;
                    reader.readAsDataURL(f);
                  }),
              ),
            ).catch(() => null);
            photoReadPending.current = false;
            setPhotosLoading(false);
            if (!images) {
              setError(t("photoError"));
              return;
            }
            setPhotos((p) => [
              ...p,
              ...images.map((src) => ({ id: crypto.randomUUID(), src })),
            ]);
          }}
        />
        <span className="muted">{t("photoHint")}</span>
      </Label>
      <div className="flex flex-wrap gap-3">
        {photos.length === 0 ? (
          <div className="icon-tile">
            <ImagePlus />
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="relative">
              <Image
                unoptimized
                width={80}
                height={80}
                src={photo.src}
                alt={t("photos")}
                className="size-20 rounded-lg object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                aria-label={t("remove")}
                onClick={() => {
                  onDirty();
                  setPhotos((p) => p.filter((item) => item.id !== photo.id));
                }}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        )}
      </div>
      <Label className="flex items-center gap-3">
        <Switch
          checked={visible}
          onCheckedChange={(value) => {
            onDirty();
            setVisible(value);
          }}
        />
        {t("visibility")}: {t(visible ? "active" : "hidden")}
      </Label>
      <p className="muted" role="status">
        {t(visible ? "visibleHelp" : "hiddenHelp")} {t("visibilitySaveHint")}
      </p>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {photosLoading && (
        <p role="status" className="muted">
          {t("upload")}…
        </p>
      )}
      <div className="form-actions">
        <Button variant="outline" type="button" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button disabled={photosLoading}>{t("save")}</Button>
      </div>
    </form>
  );
}
