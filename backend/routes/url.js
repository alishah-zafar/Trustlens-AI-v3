import { Router } from "express";
import { analyzeUrl } from "../lib/url-checker.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    let { url, lang } = req.body;

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return res.status(400).json({ error: "A URL is required." });
    }

    url = url.trim();

    // Auto-prepend https:// if no protocol
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format." });
    }

    const result = await analyzeUrl(url, lang);
    res.json({ inputType: "url", ...result });
  } catch (err) {
    console.error("URL analysis error:", err);
    res.status(500).json({ error: "Failed to analyze URL." });
  }
});

export default router;
