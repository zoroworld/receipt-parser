export type ReceiptInput = {
    imageBase64: string;
    mimeType: string;
  };
  
  export type LineItem = {
    name: string;
    amount: number;
  };
  
  export type ReceiptOutput = {
    merchant: string;
    date: string;
    line_items: LineItem[];
    subtotal: number | null;
    tax: number | null;
    tip: number | null;
    total: number;
    confidence: "low" | "medium" | "high";
    notes: string | null;
  };
  
  export interface LLMProvider {
    parseReceipt(input: ReceiptInput): Promise<ReceiptOutput>;
  }