import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { prepareLiveImport, saveLiveImport } = require("../.test-build/lib/import-batch.js");
const product = { id: "preview-id", name: "Shirt", category: "Shirts", description: "", visible: true, photos: [], variants: [{ id: "v1", size: "M", colour: "Black", price: 12.50, stock: 2 }] };

test("prepares hidden products and validates the entire batch before saving", async () => {
  const [item] = await prepareLiveImport([product]);
  assert.equal(item.visible, false);
  assert.equal("id" in item, false);
  assert.equal("id" in item.variants[0], false);
  assert.equal(await prepareLiveImport([product, { ...product, variants: [{ ...product.variants[0], stock: -1 }] }]), null);
  assert.equal(await prepareLiveImport(Array(26).fill(product)), null);
});

test("stops at the first uncertain result without sending later products", async () => {
  const items = await prepareLiveImport([product, product, product]);
  let calls = 0;
  const result = await saveLiveImport(items, async () => { calls++; if (calls === 2) throw new Error("connection lost"); return { ok: true }; });
  assert.deepEqual(result, { ok: false, saved: 1 });
  assert.equal(calls, 2);
});
