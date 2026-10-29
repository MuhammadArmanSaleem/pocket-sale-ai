import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { provisionOwner } = require("../.test-build/lib/provision-owner.js");
const { ownerProvisionSchema } = require("../.test-build/lib/validation.js");
const input = { email: "owner@example.com", password: "long-password-123", ownerName: "Owner", shopName: "Shop", phone: "03001234567" };

test("owner inputs require email, phone and bounded password", async () => {
  assert.equal(await ownerProvisionSchema.isValid(input), true);
  for (const field of [{ email: "invalid" }, { phone: "02" }, { password: "short" }, { ownerName: "   " }, { password: "é".repeat(37) }]) {
    assert.equal(await ownerProvisionSchema.isValid({ ...input, ...field }), false);
  }
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
