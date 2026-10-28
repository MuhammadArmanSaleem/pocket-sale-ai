import { test } from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { readSpreadsheet } from "../.test-build/lib/spreadsheet.js";
import { parseImportRows } from "../.test-build/lib/import.js";
import { IMPORT_HEADERS } from "../.test-build/lib/constants.js";
test("reads quoted CSV with embedded comma", async () => {
  const file = new File(
    [
      'name,category,size,colour,price,stock\n"Cotton, soft",Shirts,M,Black,100,2\n',
    ],
    "products.csv",
  );
  const rows = await readSpreadsheet(file);
  assert.equal(parseImportRows(rows)[0].name, "Cotton, soft");
});
test("reads an actual XLSX workbook and validates variants", async () => {
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet("Products");
  sheet.addRow([...IMPORT_HEADERS]);
  sheet.addRow(["Shirt", "Shirts", "M", "Black", 100, 2]);
  const buffer = await book.xlsx.writeBuffer();
  const rows = await readSpreadsheet(new File([buffer], "products.xlsx"));
  assert.equal(parseImportRows(rows)[0].variants[0].stock, 2);
});
test("rejects formula cells rather than trusting cached values", async () => {
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet("Products");
  sheet.addRow([...IMPORT_HEADERS]);
  sheet.addRow([
    "Shirt",
    "Shirts",
    "M",
    "Black",
    { formula: "50+50", result: 100 },
    2,
  ]);
  const buffer = await book.xlsx.writeBuffer();
  await assert.rejects(() =>
    readSpreadsheet(new File([buffer], "products.xlsx")),
  );
});
test("rejects malformed quoted CSV", async () => {
  await assert.rejects(() =>
    readSpreadsheet(new File(['name,category\n"unclosed'], "products.csv")),
  );
});
