import type { Variant, DuplicateVariant } from "./types";
export function findDuplicateVariant(
  variants: Variant[],
): DuplicateVariant | null {
  const seen = new Map<string, number>();
  for (let index = 0; index < variants.length; index++) {
    const variant = variants[index];
    const key = JSON.stringify([
      variant.size.trim().toLowerCase(),
      variant.colour.trim().toLowerCase(),
    ]);
    const first = seen.get(key);
    if (first !== undefined)
      return {
        first: first + 1,
        second: index + 1,
        size: variant.size.trim(),
        colour: variant.colour.trim(),
      };
    seen.set(key, index);
  }
  return null;
}
