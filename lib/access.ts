import type { AccountAccess } from "./types";

// Treat malformed, ambiguous or incomplete authorization data as no access.
export function parseAccess(rows: unknown): AccountAccess {
  if (!Array.isArray(rows) || rows.length !== 1) return { role: "unprovisioned" };
  const value: unknown = rows[0];
  if (typeof value !== "object" || value === null) return { role: "unprovisioned" };
  if (!("account_role" in value) || !("shop_id" in value) || !("shop_active" in value)) return { role: "unprovisioned" };
  if (value.account_role === "admin" && value.shop_id === null && value.shop_active === true) return { role: "admin" };
  if (value.account_role === "owner" && typeof value.shop_id === "string" && value.shop_id.length > 0) {
    if (value.shop_active === false) return { role: "suspended" };
    if (value.shop_active === true) return { role: "owner", shopId: value.shop_id };
  }
  return { role: "unprovisioned" };
}
