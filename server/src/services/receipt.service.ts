import { getLLMProvider } from "../llm/factory";
import { ReceiptOutput } from "../llm/types";

const isMock = () => process.env.USE_MOCK === "true";

type ReceiptFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export const parseReceiptService = async (
  file: ReceiptFile
): Promise<ReceiptOutput> => {
  try {
    // ✅ Validate file
    if (!file?.buffer || file.buffer.length === 0) {
      throw new Error("Invalid file buffer");
    }

    // ✅ MOCK MODE
    if (isMock()) {
      console.log("⚡ Using MOCK mode");

      return {
        merchant: "McDonald's",
        date: "2024-01-15",
        line_items: [
          { name: "Big Mac", amount: 8.99 },
          { name: "Large Fries", amount: 3.49 },
          { name: "Coke", amount: 2.0 },
        ],
        subtotal: 14.48,
        tax: 1.16,
        tip: 2.0,
        total: 17.64,
        confidence: "high",
        notes: null,
      };
    }

    // ✅ REAL MODE (LLM)
    const base64 = file.buffer.toString("base64");

    const llm = getLLMProvider();

    const result = await llm.parseReceipt({
      imageBase64: base64,
      mimeType: file.mimetype,
    });

    // (optional safety log)
    console.log("LLM Result:", result);

    return result;
  } catch (err: any) {
    console.error("parseReceiptService error:", err.message);
    throw new Error("Failed to parse receipt");
  }
};