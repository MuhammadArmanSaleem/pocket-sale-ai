"use server";
import { createClient as createIsolatedClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getAccountAccess } from "@/lib/supabase/access";
import { passwordChangeSchema } from "@/lib/validation";
import type { ProductCreateResult } from "@/lib/types";

export async function changePasswordAction(input: unknown): Promise<ProductCreateResult> {
  try {
    const value = await passwordChangeSchema.validate(input, { strict: true, abortEarly: false });
    const access = await getAccountAccess();
    if (!access || (access.role !== "owner" && access.role !== "admin")) return { ok: false };
    const client = await createClient();
    const { data: current, error: userError } = await client.auth.getUser();
    if (userError || !current.user?.email) return { ok: false };
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { ok: false };
    // Separate client never writes its session into the caller's cookies.
    const verifier = createIsolatedClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    const { data: verified, error: verifyError } = await verifier.auth.signInWithPassword({ email: current.user.email, password: value.currentPassword });
    if (verifyError || verified.user?.id !== current.user.id) return { ok: false };
    const { error: revokeError } = await verifier.auth.signOut({ scope: "local" });
    if (revokeError) return { ok: false };
    const { error } = await client.auth.updateUser({ password: value.newPassword, current_password: value.currentPassword });
    return { ok: !error };
  } catch { return { ok: false }; }
}
