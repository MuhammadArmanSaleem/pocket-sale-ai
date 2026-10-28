import "server-only";
import { createClient } from "./server";
import { parseAccess } from "../access";
import type { AccountAccess } from "../types";

// Call for every protected operation; never trust role claims from the browser.
export async function getAccountAccess(): Promise<AccountAccess | null> {
  const supabase = await createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();
  if (authError || !user.user) return null;
  const { data, error } = await supabase.rpc("current_access");
  if (error) throw new Error("Unable to verify account access");
  return parseAccess(data);
}
