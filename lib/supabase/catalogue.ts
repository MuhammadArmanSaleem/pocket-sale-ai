import "server-only";
import { CATALOGUE_PAGE_SIZE, MAX_CATALOGUE_PAGE, PRODUCT_IMAGE_BUCKET, PRODUCT_IMAGE_URL_SECONDS } from "../constants";
import { createClient } from "./server";
import { getAccountAccess } from "./access";
import { parseCatalogueSearch } from "../pagination";
import { createProductSchema, productVisibilitySchema, productDetailsSchema, variantEditSchema, variantRemoveSchema, variantAddSchema } from "../validation";

// This entry point is not yet connected to the preview catalogue.
// Derive shop scope on the server; do not accept it from the caller.
export async function createProduct(input: unknown): Promise<string> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await createProductSchema.validate(input, { abortEarly: false, stripUnknown: false });
  const client = await createClient();
  const { data, error } = await client.rpc("create_product_with_variants", {
    target_shop: access.shopId,
    product_name: value.name,
    product_category: value.category,
    product_description: value.description,
    product_visible: value.visible,
    variants: value.variants,
  });
  if (error || typeof data !== "string") throw new Error("Unable to save product");
  return data;
}

export async function listProducts(page: number, search = "") {
  if (!Number.isInteger(page) || page < 1 || page > MAX_CATALOGUE_PAGE) throw new Error("Invalid page");
  const offset = (page - 1) * CATALOGUE_PAGE_SIZE;
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const client = await createClient();
  if (parseCatalogueSearch(search) !== search) throw new Error("Invalid search");
  let query = client.from("products")
    .select("id,name,category,description,updated_at,is_visible,product_variants(id,size,colour,unit_price,stock_quantity,updated_at),product_images(id,object_name,sort_order)")
    .eq("shop_id", access.shopId);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + CATALOGUE_PAGE_SIZE);
  if (error || !data) throw new Error("Unable to load products");
  const items = data.slice(0, CATALOGUE_PAGE_SIZE);
  const paths = items.flatMap(product => product.product_images.map(photo => photo.object_name));
  const signed = paths.length ? await client.storage.from(PRODUCT_IMAGE_BUCKET).createSignedUrls(paths, PRODUCT_IMAGE_URL_SECONDS) : null;
  const urls = new Map((signed?.data ?? []).filter(item => item.path && item.signedUrl).map(item => [item.path, item.signedUrl]));
  return { items: items.map(product => ({ ...product, photos: product.product_images.slice().sort((a, b) => a.sort_order - b.sort_order).map(photo => ({ ...photo, url: urls.get(photo.object_name) ?? null })) })), hasNext: data.length > CATALOGUE_PAGE_SIZE && page < MAX_CATALOGUE_PAGE, photoError: Boolean(signed?.error) };
}

export async function setProductVisibility(input: unknown): Promise<void> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await productVisibilitySchema.validate(input, { strict: true, abortEarly: false });
  const client = await createClient();
  const { data, error } = await client.from("products").update({ is_visible: value.visible })
    .eq("shop_id", access.shopId).eq("id", value.productId).eq("is_visible", !value.visible)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("Product not found or changed");
}

export async function updateProductDetails(input: unknown): Promise<void> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await productDetailsSchema.validate(input, { strict: true, abortEarly: false });
  const client = await createClient();
  const { data, error } = await client.from("products")
    .update({ name: value.name.trim(), category: value.category, description: value.description })
    .eq("shop_id", access.shopId).eq("id", value.productId).eq("updated_at", value.version)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("Product not found or changed");
}

export async function updateVariant(input: unknown): Promise<void> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await variantEditSchema.validate(input, { strict: true, abortEarly: false });
  const client = await createClient();
  const { data, error } = await client.from("product_variants")
    .update({ size: value.size.trim(), colour: value.colour.trim(), unit_price: value.price, stock_quantity: value.stock })
    .eq("shop_id", access.shopId).eq("product_id", value.productId).eq("id", value.variantId).eq("updated_at", value.version)
    .select("id").maybeSingle();
  if (error || !data) throw new Error("Variant unavailable or changed");
}

export async function removeVariant(input: unknown): Promise<void> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await variantRemoveSchema.validate(input, { strict: true, abortEarly: false });
  const client = await createClient();
  const { error } = await client.rpc("remove_product_variant", { target_shop: access.shopId, target_product: value.productId, target_variant: value.variantId, expected_version: value.version });
  if (error) throw new Error("Variant cannot be removed");
}

export async function addVariant(input: unknown): Promise<void> {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const value = await variantAddSchema.validate(input, { strict: true, abortEarly: false });
  const client = await createClient();
  const { error } = await client.rpc("add_product_variant", { target_shop: access.shopId, target_product: value.productId, variant_size: value.size.trim(), variant_colour: value.colour.trim(), variant_price: value.price, variant_stock: value.stock });
  if (error) throw new Error("Variant cannot be added");
}
