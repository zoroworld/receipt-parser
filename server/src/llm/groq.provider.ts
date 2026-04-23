import { LLMProvider, ReceiptInput, ReceiptOutput } from "./types";

export class GroqProvider implements LLMProvider {
  async parseReceipt(input: ReceiptInput): Promise<ReceiptOutput> {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `
Extract receipt data from this image base64 and return ONLY JSON:

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
}

IMAGE (base64):
${input.imageBase64}
                  `,
                },
              ],
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const data = await response.json();

    const text = data.choices[0].message.content;

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("No JSON found");

    return JSON.parse(match[0]);
  }
}