import fs from "fs";
import path from "path";
import { parseReceiptService } from "../services/receipt.service";
import dotenv from "dotenv";
dotenv.config();


const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type FakeFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

async function runTests() {
  
  const imagesDir = path.join(__dirname, "../../../receipt_images");

  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ receipt_images folder not found at ${imagesDir}`);
    return;
  }

  const files = fs.readdirSync(imagesDir);

  for (const fileName of files) {
    const filePath = path.join(imagesDir, fileName);

    const buffer = fs.readFileSync(filePath);

    // ❌ Skip large files
    if (buffer.length > MAX_SIZE) {
      console.log(
        `❌ Skipping ${fileName} (Too large: ${(buffer.length / 1024 / 1024).toFixed(2)} MB)`
      );
      continue;
    }

    // ✅ REAL file type detection (IMPORTANT FIX)
    const fileTypeModule: any = await import("file-type");
    const type = await fileTypeModule.fileTypeFromBuffer(buffer);

    if (!type || !["image/png", "image/jpeg"].includes(type.mime)) {
      console.log(`⏭ Skipping invalid image: ${fileName}`);
      continue;
    }

    const fakeFile: FakeFile = {
      originalname: fileName,
      mimetype: type.mime,
      buffer,
      size: buffer.length,
    };

    console.log("\n==============================================");
    console.log(`🧪 Testing: ${fileName}`);
    console.log(`📦 Size: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`🧾 MIME: ${type.mime}`);
    console.log("==============================================\n");

    try {
      const result = await parseReceiptService(fakeFile);
      console.log("✅ Result:", JSON.stringify(result, null, 2));
    } catch (err: any) {
      console.error("❌ Error:", err?.message || err);
    }
  }
}

runTests();