import express from "express";
import cors from "cors";

import textRouter from "./routes/text.js";
import urlRouter from "./routes/url.js";
import screenshotRouter from "./routes/screenshot.js";
import qrcodeRouter from "./routes/qrcode.js";
import traceLinkRouter from "./routes/trace-link.js";

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true; // allow all in development

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
  mode: process.env.GEMINI_API_KEY ? "gemini" : "mock",
  });
});

// Routes
app.use("/api/analyze/text", textRouter);
app.use("/api/analyze/url", urlRouter);
app.use("/api/analyze/screenshot", screenshotRouter);
app.use("/api/analyze/qrcode", qrcodeRouter);
app.use("/api/analyze/trace-link", traceLinkRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  const textMode = process.env.GEMINI_API_KEY ? "GEMINI" : "MOCK";
  console.log(`TrustLens AI backend running on port ${PORT}`);
  console.log(`  Text analysis: ${textMode} mode`);
});
