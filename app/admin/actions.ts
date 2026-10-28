"use server";
import { revalidatePath } from "next/cache";
import { adminReply, setAdminTicketStatus } from "@/lib/supabase/admin-support";
import type { ProductCreateResult } from "@/lib/types";

export async function adminReplyAction(input: unknown): Promise<ProductCreateResult> {
  try { await adminReply(input); revalidatePath("/admin"); return { ok: true }; }
  catch { return { ok: false }; }
}
export async function adminStatusAction(input: unknown): Promise<ProductCreateResult> {
  try { await setAdminTicketStatus(input); revalidatePath("/admin"); return { ok: true }; }
  catch { return { ok: false }; }
}
