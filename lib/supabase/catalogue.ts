import "server-only";
import { createClient } from "./server";
import { getAccountAccess } from "./access";
import { createProductSchema } from "../validation";

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
