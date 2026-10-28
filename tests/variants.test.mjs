import { test } from "node:test";
import assert from "node:assert/strict";
import { findDuplicateVariant } from "../.test-build/lib/variants.js";
const variant = (id, size, colour, stock) => ({
  id,
  size,
  colour,
  stock,
  price: 300,
});
test("identifies the exact repeated rows regardless of stock", () => {
  const result = findDuplicateVariant([
    variant("1", "l", "blue", 4),
    variant("2", "m", "white", 58),
    variant("3", "l", "blue", 5),
  ]);
  assert.deepEqual(result, { first: 1, second: 3, size: "l", colour: "blue" });
});
test("normalizes case/whitespace and allows distinct combinations", () => {
  assert.equal(
    findDuplicateVariant([
      variant("1", "L", "Blue", 4),
      variant("2", "M", "Blue", 5),
    ]),
    null,
  );
  assert.equal(
    findDuplicateVariant([
      variant("1", "L", "Blue", 4),
      variant("2", " l ", "blue ", 5),
    ]).second,
    2,
  );
});
