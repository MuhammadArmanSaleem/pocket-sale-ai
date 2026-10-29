import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { provisionOwner, classifyIdentityError } = require("../.test-build/lib/provision-owner.js");
const { ownerProvisionSchema, previewOwnerSchema } = require("../.test-build/lib/validation.js");
const input = { email: "owner@example.com", password: "long-password-123", ownerName: "Owner", shopName: "Shop", phone: "03001234567" };

test("owner inputs require email, phone and bounded password", async () => {
  assert.equal(await ownerProvisionSchema.isValid(input), true);
  for (const field of [{ email: "invalid" }, { phone: "02" }, { password: "short" }, { ownerName: "   " }, { password: "é".repeat(37) }]) {
    assert.equal(await ownerProvisionSchema.isValid({ ...input, ...field }), false);
  }
});

test("preview also rejects empty names and malformed emails", async () => {
  const preview = { email: input.email, password: input.password, ownerName: input.ownerName, shopName: input.shopName };
  assert.equal(await previewOwnerSchema.isValid(preview), true);
  assert.equal(await previewOwnerSchema.isValid({ ...preview, shopName: "  " }), false);
  assert.equal(await previewOwnerSchema.isValid({ ...preview, email: "invalid" }), false);
  assert.equal(await previewOwnerSchema.isValid({ ...preview, password: "short" }), false);
});

test("only known definitive Auth failures receive specific messages", () => {
  assert.equal(classifyIdentityError("email_exists", 422), "duplicate");
  assert.equal(classifyIdentityError("user_already_exists", 422), "duplicate");
  assert.equal(classifyIdentityError("weak_password", 422), "weak_password");
  assert.equal(classifyIdentityError(undefined, 429), "rate_limited");
  assert.equal(classifyIdentityError("unexpected_failure", 500), null);
});

test("reports success only when identity and records both succeed", async () => {
  let calls = 0;
  const ok = await provisionOwner(input, async () => "user-id", async id => { calls++; assert.equal(id, "user-id"); return true; });
  assert.deepEqual(ok, { status: "success" });
  const partial = await provisionOwner(input, async () => "user-id", async () => { throw new Error("connection lost"); });
  assert.deepEqual(partial, { status: "partial", userId: "user-id" });
  const unknown = await provisionOwner(input, async () => { throw new Error("connection lost"); }, async () => { calls++; return true; });
  assert.deepEqual(unknown, { status: "review" });
  assert.equal(calls, 1);
});
