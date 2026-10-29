/** Remove redundant leading zeroes while keeping a single zero and decimals. */
export function normalizeLeadingZeroes(value: string): string {
  return value.replace(/^0+(?=\d)/, "");
}
