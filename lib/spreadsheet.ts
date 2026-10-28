import { MAX_IMPORT_ROWS } from "./constants";
export async function readSpreadsheet(file: File): Promise<unknown[][]> {
  if (file.name.toLowerCase().endsWith(".csv")) {
    const Papa = await import("papaparse");
    const result = Papa.default.parse<string[]>(await file.text(), {
      skipEmptyLines: "greedy",
    });
    if (result.errors.length || result.data.length > MAX_IMPORT_ROWS + 1)
      throw new Error("Invalid CSV");
    return result.data;
  }
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const sheet = workbook.worksheets[0];
  if (!sheet || sheet.rowCount > MAX_IMPORT_ROWS + 1)
    throw new Error("Invalid worksheet");
  const rows: unknown[][] = [];
  sheet.eachRow({ includeEmpty: true }, (row) => {
    const cells: unknown[] = [];
    for (let index = 1; index <= sheet.columnCount; index++) {
      const value = row.getCell(index).value;
      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
      )
        throw new Error("Only plain cells are accepted");
      cells.push(value ?? "");
    }
    rows.push(cells);
  });
  return rows;
}
