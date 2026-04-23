import express from "express";
import cors from "cors";
import receiptRoutes from "./routes/receipt.routes";

const app = express();
const PORT = process.env.PORT || 8000;

import dotenv from "dotenv";
dotenv.config();

app.use(cors());
app.use(express.json());

// use routes
app.use("/api", receiptRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});