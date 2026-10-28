"use server";

import { revalidatePath } from "next/cache";
import { createProduct } from "@/lib/supabase/catalogue";
import type { ProductCreateInput, ProductCreateResult } from "@/lib/types";

export async function createProductAction(input: ProductCreateInput): Promise<ProductCreateResult> {
  try {
    await createProduct(input);
    revalidatePath("/live");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function savePolicyAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { saveShopPolicy } = await import("@/lib/supabase/policies");
    await saveShopPolicy(input);
    revalidatePath("/live");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
