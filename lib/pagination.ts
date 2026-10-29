import { MAX_CATALOGUE_PAGE, MAX_CATALOGUE_SEARCH_LENGTH } from "./constants";

export function parseCataloguePage(value: unknown): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= MAX_CATALOGUE_PAGE ? page : 1;
}

export function parseCatalogueSearch(value: unknown): string {
  if (typeof value !== "string" || value.length > MAX_CATALOGUE_SEARCH_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) return "";
  return value.trim();
}

export function cataloguePageHref(page: number, search: string): string {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("q", search);
  return `/live?${params.toString()}#products`;
}
