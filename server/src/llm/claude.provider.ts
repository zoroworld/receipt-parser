import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, ReceiptInput, ReceiptOutput } from "./types";
import { extractJSON } from "./utils";

export class ClaudeProvider implements LLMProvider {
  private client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY!,
  });

  

  async parseReceipt(input: ReceiptInput): Promise<ReceiptOutput> {
    const res = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: input.mimeType as "image/jpeg" | "image/png",
                data: input.imageBase64,
              },
            },
            {
              type: "text",
              text: `Return ONLY valid JSON:
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
            },
          ],
        },
      ],
    });

    const text = res.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");

    return extractJSON(text);
  }
}