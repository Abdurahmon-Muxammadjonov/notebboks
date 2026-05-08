import fs from "node:fs";
import path from "node:path";

export function readComponentSource(fileName: string): string {
  const filePath = path.join(process.cwd(), "components", fileName);
  return fs.readFileSync(filePath, "utf8");
}

export function expectExportFunction(fileName: string, exportName: string): void {
  const source = readComponentSource(fileName);
  expect(source.includes(`export function ${exportName}(`)).toBe(true);
}

export function expectSourceLiterals(fileName: string, literals: [string, string]): void {
  const source = readComponentSource(fileName);
  expect(source.includes(literals[0])).toBe(true);
  expect(source.includes(literals[1])).toBe(true);
}
