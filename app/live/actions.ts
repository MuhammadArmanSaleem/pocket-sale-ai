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
