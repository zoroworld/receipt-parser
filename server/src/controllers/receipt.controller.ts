import { Response } from "express";
import { MulterRequest } from "../types/express";
import { parseReceiptService } from "../services/receipt.service";

export const parseReceipt = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await parseReceiptService(req.file);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};