import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { validPhotoHeader } = require("../.test-build/lib/photo-validation.js");

test("photo headers must match a supported format and size limit", () => {
  assert.equal(validPhotoHeader(Uint8Array.from([255,216,255]), "image/jpeg", 10), true);
  assert.equal(validPhotoHeader(Uint8Array.from([137,80,78,71,13,10,26,10]), "image/png", 20), true);
  assert.equal(validPhotoHeader(new TextEncoder().encode("RIFF0000WEBP"), "image/webp", 20), true);
  assert.equal(validPhotoHeader(new TextEncoder().encode("not an image"), "image/png", 12), false);
  assert.equal(validPhotoHeader(Uint8Array.from([255,216,255]), "image/jpeg", 5242881), false);
  assert.equal(validPhotoHeader(Uint8Array.from([255,216,255]), "image/svg+xml", 3), false);
});
