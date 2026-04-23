import { Router } from "express";
import { upload } from "../middleware/upload";
import { parseReceipt } from "../controllers/receipt.controller";

const router = Router();

router.post("/parse-receipt", upload.single("receipt"), parseReceipt);

export default router;