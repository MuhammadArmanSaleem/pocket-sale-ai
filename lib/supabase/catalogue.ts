import "server-only";
import { createClient } from "./server";
import { getAccountAccess } from "./access";
import { createProductSchema, productVisibilitySchema } from "../validation";

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

export async function listProducts() {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  const client = await createClient();
  const { data, error } = await client.from("products")
    .select("id,name,category,is_visible,product_variants(id,size,colour,unit_price,stock_quantity)")
    .eq("shop_id", access.shopId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) throw new Error("Unable to load products");
  return data;
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
