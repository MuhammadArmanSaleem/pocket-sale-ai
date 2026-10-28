import {test} from "node:test";
import assert from "node:assert/strict";
import {parseImportRows} from "../.test-build/lib/import.js";
import {IMPORT_HEADERS} from "../.test-build/lib/constants.js";
const valid = ["Cotton shirt", "Shirts", "M", "Black", 1850, 5];
test("groups variants and defaults imported products to hidden", () => {
  const result = parseImportRows([
    [...IMPORT_HEADERS],
    valid,
    ["Cotton shirt", "Shirts", "L", "Black", 1950, 3],
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].variants.length, 2);
  assert.equal(result[0].visible, false);
  assert.equal(result[0].variants[1].price, 1950);
});
test("rejects duplicate combinations ignoring case", () =>
  assert.throws(() =>
    parseImportRows([
      [...IMPORT_HEADERS],
      valid,
      ["cotton shirt", "shirts", "m", "black", 1850, 2],
    ]),
  ));
test("rejects negative or fractional stock", () => {
  assert.throws(() =>
    parseImportRows([[...IMPORT_HEADERS], ["A", "B", "M", "Black", 100, -1]]),
  );
  assert.throws(() =>
    parseImportRows([[...IMPORT_HEADERS], ["A", "B", "M", "Black", 100, 1.5]]),
  );
});
test("rejects missing header and blank price", () => {
  assert.throws(() => parseImportRows([["name"], valid]));
  assert.throws(() =>
    parseImportRows([[...IMPORT_HEADERS], ["A", "B", "M", "Black", "", 2]]),
  );
});
test("rejects empty and oversized imports", () => {
  assert.throws(() => parseImportRows([[...IMPORT_HEADERS]]));
  assert.throws(() =>
    parseImportRows([
      [...IMPORT_HEADERS],
      ...Array.from({ length: 501 }, () => valid),
    ]),
  );
});
test("preserves numeric zero stock", () => {
  const r = parseImportRows([
    [...IMPORT_HEADERS],
    ["A", "B", "M", "Black", 100, 0],
  ]);
  assert.equal(r[0].variants[0].stock, 0);
});
