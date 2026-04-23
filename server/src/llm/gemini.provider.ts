import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, ReceiptInput, ReceiptOutput } from "./types";

type AllowedMime = "image/jpeg" | "image/png" | "image/webp";

export class GeminiProvider implements LLMProvider {
  private client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async parseReceipt(input: ReceiptInput): Promise<ReceiptOutput> {
    const model = this.client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const mimeType: AllowedMime =
      input.mimeType === "image/png"
        ? "image/png"
        : input.mimeType === "image/webp"
        ? "image/webp"
        : "image/jpeg";

    const result = await model.generateContent([
      {
        inlineData: {
          data: input.imageBase64,
          mimeType,
        },
      },
      `Return ONLY valid JSON:
      {
        "merchant": string,
        "date": string,
        "line_items": [
          { "name": string, "amount": number }
        ],
        "subtotal": number | null,
        "tax": number | null,
        "tip": number | null,
        "total": number,
        "confidence": "low" | "medium" | "high",
        "notes": string | null
      }`,
    ]);

    const text = result.response.text();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found in response");
    }

    const jsonString = text.slice(start, end + 1);

    try {
      return JSON.parse(jsonString);
    } catch {
      throw new Error("Invalid JSON from Gemini");
    }
  }
}