import { Router } from "express";
import { analyzeText } from "../lib/llm-analyzer.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text input is required." });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: "Text is too long. Maximum 10,000 characters." });
    }

    const result = await analyzeText(text.trim(), lang);
    res.json({ inputType: "text", ...result });
  } catch (err) {
    console.error("Text analysis error:", err);
    res.status(500).json({ error: "Failed to analyze text." });
  }
});

export default router;
