import type { OwnerProvisionInput, OwnerProvisionResult } from "./types";

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
