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

export async function createSupportAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { createSupportTicket } = await import("@/lib/supabase/support");
    await createSupportTicket(input);
    revalidatePath("/live");
    return { ok: true };
  } catch { return { ok: false }; }
}
export async function replySupportAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { replyToSupportTicket } = await import("@/lib/supabase/support");
    await replyToSupportTicket(input);
    revalidatePath("/live");
    return { ok: true };
  } catch { return { ok: false }; }
}

export async function productVisibilityAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { setProductVisibility } = await import("@/lib/supabase/catalogue");
    await setProductVisibility(input);
    revalidatePath("/live");
    return { ok: true };
  } catch { return { ok: false }; }
}

export async function updateProductDetailsAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { updateProductDetails } = await import("@/lib/supabase/catalogue");
    await updateProductDetails(input);
    revalidatePath("/live");
    return { ok: true };
  } catch { return { ok: false }; }
}

export async function updateVariantAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const { updateVariant } = await import("@/lib/supabase/catalogue");
    await updateVariant(input); revalidatePath("/live"); return { ok: true };
  } catch { return { ok: false }; }
}

export async function removeVariantAction(input: unknown): Promise<ProductCreateResult> {
  try { const { removeVariant } = await import("@/lib/supabase/catalogue"); await removeVariant(input); revalidatePath("/live"); return { ok: true }; }
  catch { return { ok: false }; }
}
