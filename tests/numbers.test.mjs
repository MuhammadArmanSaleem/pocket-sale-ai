import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeLeadingZeroes } from "../.test-build/lib/numbers.js";

test("removes redundant leading zeroes without changing zero or decimals", () => {
  for (const [input, expected] of [["02", "2"], ["020", "20"], ["000", "0"], ["00.25", "0.25"], ["0.25", "0.25"], ["", ""]]) {
    assert.equal(normalizeLeadingZeroes(input), expected);
  }
});
