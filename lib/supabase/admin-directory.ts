import "server-only";
import { getAccountAccess } from "./access";
import { createClient } from "./server";

export async function listAdminShops() {
  const access = await getAccountAccess();
  if (!access || access.role !== "admin") throw new Error("Access denied");
  const client = await createClient();
  const { data, error } = await client.from("shops").select("id,name,business_phone,is_active,profiles(display_name)").order("created_at", { ascending: false }).limit(50);
  if (error || !data) throw new Error("Unable to load shops");
  return data;
}

export function ownerDisplayName(value: unknown): string {
  if (Array.isArray(value)) return ownerDisplayName(value[0]);
  if (typeof value === "object" && value !== null && "display_name" in value && typeof value.display_name === "string") return value.display_name;
  return "—";
}
