import { MAX_LIVE_IMPORT_PRODUCTS } from "./constants";
import { createProductSchema } from "./validation";
import type { Product, ProductCreateInput, ProductCreateResult } from "./types";

export async function prepareLiveImport(products: Product[]): Promise<ProductCreateInput[] | null> {
  if (!products.length || products.length > MAX_LIVE_IMPORT_PRODUCTS) return null;
  const input = products.map(product => ({
    name: product.name, category: product.category, description: product.description, visible: false,
    variants: product.variants.map(({ size, colour, price, stock }) => ({ size, colour, price, stock })),
  }));
  for (const product of input) if (!await createProductSchema.isValid(product, { strict: true })) return null;
  return input;
}

export async function saveLiveImport(products: ProductCreateInput[], save: (product: ProductCreateInput) => Promise<ProductCreateResult>) {
  let saved = 0;
  for (const product of products) {
    try { if (!(await save(product)).ok) return { ok: false as const, saved }; }
    catch { return { ok: false as const, saved }; }
    saved++;
  }
  return { ok: true as const, saved };
}
