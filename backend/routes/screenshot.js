import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

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

/**
 * POST /api/analyze/screenshot
 * Accepts an image upload, runs OCR to extract text, then analyzes via the text pipeline.
 *
 * STUB: OCR integration (tesseract.js) is not yet implemented.
 * TODO: Use tesseract.js to extract text from the uploaded image, then pass to analyzeText().
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "An image file is required." });
    }

    // --- STUB: OCR not yet implemented ---
    // const { createWorker } = await import("tesseract.js");
    // const worker = await createWorker("eng");
    // const { data: { text } } = await worker.recognize(req.file.path);
    // await worker.terminate();
    //
    // if (!text.trim()) {
    //   return res.status(400).json({ error: "No readable text found in the image." });
    // }
    //
    // const { analyzeText } = await import("../lib/llm-analyzer.js");
    // const result = await analyzeText(text);
    // res.json({ inputType: "screenshot", extractedText: text, ...result });

    res.status(501).json({
      error: "Screenshot analysis is not yet implemented. OCR integration coming soon.",
      inputType: "screenshot",
      uploadedFile: req.file.filename,
    });
  } catch (err) {
    console.error("Screenshot analysis error:", err);
    res.status(500).json({ error: "Failed to analyze screenshot." });
  }
});

export default router;
