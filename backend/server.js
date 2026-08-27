import express from "express";
import cors from "cors";
import { config } from "dotenv";

import textRouter from "./routes/text.js";
import urlRouter from "./routes/url.js";
import screenshotRouter from "./routes/screenshot.js";
import qrcodeRouter from "./routes/qrcode.js";

config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true; // allow all in development

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: process.env.OPENAI_API_KEY ? "llm" : "mock" });
});

// Routes
app.use("/api/analyze/text", textRouter);
app.use("/api/analyze/url", urlRouter);
app.use("/api/analyze/screenshot", screenshotRouter);
app.use("/api/analyze/qrcode", qrcodeRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  const mode = process.env.OPENAI_API_KEY ? "LLM" : "MOCK";
  console.log(`TrustLens AI backend running on port ${PORT} [${mode} mode]`);
});
