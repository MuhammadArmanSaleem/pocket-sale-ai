"use server";

import { createClient as createPrivilegedClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getAccountAccess } from "@/lib/supabase/access";
import { ownerProvisionSchema } from "@/lib/validation";
import { classifyIdentityError, provisionOwner } from "@/lib/provision-owner";
import type { OwnerProvisionResult } from "@/lib/types";

export async function provisionOwnerAction(input: unknown): Promise<OwnerProvisionResult> {
  let access;
  try { access = await getAccountAccess(); } catch { return { status: "unavailable" }; }
  if (access?.role !== "admin") return { status: "unauthorized" };
  let value;
  try { value = await ownerProvisionSchema.validate(input, { abortEarly: false, stripUnknown: true }); }
  catch { return { status: "invalid" }; }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return { status: "unavailable" };
  const admin = createPrivilegedClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  let identityFailure: ReturnType<typeof classifyIdentityError> = null;
  const result = await provisionOwner(value, async (v) => {
    const { data, error } = await admin.auth.admin.createUser({ email: v.email, password: v.password, email_confirm: true });
    if (error) { identityFailure = classifyIdentityError(error.code, error.status); console.error("Owner identity creation failed", { code: error.code ?? "unknown", status: error.status ?? null }); return null; }
    if (!data.user) return null;
    return data.user.id;
  }, async (userId, v) => {
    const { error } = await admin.rpc("provision_owner_records", { owner_id: userId, owner_name: v.ownerName, shop_name: v.shopName, business_phone: v.phone });
    if (error) console.error("Owner record creation failed", { code: error.code ?? "unknown" });
    return !error;
  });
  if (result.status === "review" && identityFailure) return { status: identityFailure };
  if (result.status === "success") revalidatePath("/admin");
  return result;
}
