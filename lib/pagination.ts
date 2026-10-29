import { MAX_CATALOGUE_PAGE } from "./constants";

export function parseCataloguePage(value: unknown): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= MAX_CATALOGUE_PAGE ? page : 1;
}
