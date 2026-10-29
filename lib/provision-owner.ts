import type { OwnerProvisionInput, OwnerProvisionResult } from "./types";

export function classifyIdentityError(code: string | undefined, status: number | undefined): "duplicate" | "weak_password" | "rate_limited" | null {
  if (code === "email_exists" || code === "user_already_exists") return "duplicate";
  if (code === "weak_password") return "weak_password";
  if (code === "over_request_rate_limit" || status === 429) return "rate_limited";
  return null;
}

// Auth and Postgres are separate operations. A failed or lost response can
// leave an identity or shop behind, so do not delete or retry automatically.
export async function provisionOwner(
  input: OwnerProvisionInput,
  createIdentity: (input: OwnerProvisionInput) => Promise<string | null>,
  createRecords: (id: string, input: OwnerProvisionInput) => Promise<boolean>,
): Promise<OwnerProvisionResult> {
  let userId: string | null;
  try { userId = await createIdentity(input); }
  catch { return { status: "review" }; }
  if (!userId) return { status: "review" };
  try {
    if (await createRecords(userId, input)) return { status: "success" };
  } catch { /* The transaction may have committed despite a lost response. */ }
  return { status: "partial", userId };
}
