import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../data/receipts.json");

export function saveReceipt(data: any) {
  let existing: any[] = [];

  // 1. read old data
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    existing = JSON.parse(raw || "[]");
  }

  // 2. add new record
  const newEntry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  existing.push(newEntry);

  // 3. write back
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  return newEntry;
}