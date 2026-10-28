import type { Direction, Locale } from "./types";
export const LOCALE_COOKIE = "pocketsales-locale";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_DIRECTION: Record<Locale, Direction> = {
  en: "ltr",
  ur: "rtl",
};
export const COOKIE_MAX_AGE = 31536000;
export const SHOP_ID = "studio";
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 500;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_PHOTOS = 6;
export const IMPORT_HEADERS = [
  "name",
  "category",
  "size",
  "colour",
  "price",
  "stock",
] as const;
export const isLocale = (value: unknown): value is Locale =>
  value === "en" || value === "ur";

export const PHOTO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
