import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createWorker } from "tesseract.js";
import { analyzeText } from "../lib/llm-analyzer.js";
import { analyzeUrl } from "../lib/url-checker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const upload = multer({
  dest: path.join(__dirname, "..", "uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and BMP images are allowed."));
    }
  },
});

/** Map app language to Tesseract OCR language codes */
function getOcrLang(lang) {
  switch (lang) {
    case "urdu":
    case "roman-urdu":
      return "eng+urd"; // English + Urdu for best coverage
    default:
      return "eng";
  }
}

/** Extract URLs, phone numbers, and emails from text */
function extractContacts(text) {
  const contacts = {};

  const urls = text.match(/https?:\/\/[^\s<>"']+/gi) || [];
  if (urls.length > 0) contacts.urls = [...new Set(urls)];

  const phones = (text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g) || [])
    .filter((p) => p.replace(/\D/g, "").length >= 7);
  if (phones.length > 0) contacts.phones = [...new Set(phones)];

  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  if (emails.length > 0) contacts.emails = [...new Set(emails)];

  return contacts;
}

/** Clean up the temp uploaded file */
function cleanup(filePath) {
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to cleanup upload:", err.message);
    });
  }
}

/**
 * POST /api/analyze/screenshot
 * Runs OCR to extract text, analyzes via the text pipeline, and extracts structured contacts.
 */
router.post("/", upload.single("image"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "An image file is required." });
    }

    const lang = req.body?.lang || "en";
    const ocrLang = getOcrLang(lang);

    // Run OCR with tesseract.js (multilingual)
    const worker = await createWorker(ocrLang);
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();

    cleanup(filePath);

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "No readable text could be extracted from this image. Try a clearer screenshot.",
        inputType: "screenshot",
      });
    }

    const trimmedText = text.trim();

    // Analyze the extracted text
    const result = await analyzeText(trimmedText, lang);

    // Extract structured contacts from OCR text
    const contacts = extractContacts(trimmedText);

    // If URLs were found, analyze the first one for additional risk data
    let urlAnalysis = null;
    if (contacts.urls?.length > 0) {
      try {
        urlAnalysis = await analyzeUrl(contacts.urls[0], lang);
      } catch {
        // URL analysis failure is non-fatal
      }
    }

    const response = {
      inputType: "screenshot",
      extractedText: trimmedText,
      ...result,
    };

    if (Object.keys(contacts).length > 0) {
      response.extractedContacts = contacts;
    }

    if (urlAnalysis) {
      // Merge URL analysis risk into the overall result if it's higher
      if (urlAnalysis.riskScore > result.riskScore) {
        response.riskScore = urlAnalysis.riskScore;
        response.explanation = urlAnalysis.explanation;
      }
      response.urlAnalysis = {
        url: contacts.urls[0],
        verdict: urlAnalysis.verdict,
        riskScore: urlAnalysis.riskScore,
        urlDetails: urlAnalysis.urlDetails,
      };
    }

    res.json(response);
  } catch (err) {
    cleanup(filePath);
    console.error("Screenshot analysis error:", err);
    res.status(500).json({ error: "Failed to analyze screenshot." });
  }
});

export default router;
