import { IMPORT_HEADERS, MAX_IMPORT_ROWS } from "./constants";
import type { Product } from "./types";
export function parseImportRows(rows: unknown[][]): Product[] {
  if (rows.length < 2 || rows.length > MAX_IMPORT_ROWS + 1)
    throw new Error("Invalid row count");
  const headers = rows[0].map((v) => String(v).trim().toLowerCase());
  if (
    IMPORT_HEADERS.some((h) => !headers.includes(h)) ||
    new Set(headers).size !== headers.length
  )
    throw new Error("Invalid headers");
  const products = new Map<string, Product>();
  for (const row of rows.slice(1)) {
    if (row.every((v) => String(v).trim() === "")) continue;
    const read = (name: string) =>
      String(row[headers.indexOf(name)] ?? "").trim();
    const name = read("name"),
      category = read("category"),
      size = read("size"),
      colour = read("colour"),
      price = Number(read("price")),
      stock = Number(read("stock"));
    if (
      !name ||
      !category ||
      !size ||
      !colour ||
      !read("price") ||
      !read("stock") ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    )
      throw new Error("Invalid product");
    const key = JSON.stringify([name.toLowerCase(), category.toLowerCase()]);
    const p = products.get(key) ?? {
      id: crypto.randomUUID(),
      name,
      category,
      description: "",
      visible: false,
      variants: [],
      photos: [],
    };
    if (
      p.variants.some(
        (v) =>
          v.size.toLowerCase() === size.toLowerCase() &&
          v.colour.toLowerCase() === colour.toLowerCase(),
      )
    )
      throw new Error("Duplicate variant");
    p.variants.push({ id: crypto.randomUUID(), size, colour, price, stock });
    products.set(key, p);
  }
  if (!products.size) throw new Error("No products");
  return [...products.values()];
}
