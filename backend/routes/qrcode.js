import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import jsQR from "jsqr";
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

/** Clean up the temp uploaded file */
function cleanup(filePath) {
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to cleanup upload:", err.message);
    });
  }
}

/**
 * POST /api/analyze/qrcode
 * Decodes a QR code from the uploaded image, then analyzes the extracted URL.
 */
router.post("/", upload.single("image"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A QR code image is required." });
    }

    const lang = req.body?.lang || "en";

    // Read the image and decode QR code
    let code;
    try {
      const { Jimp } = await import("jimp");
      const image = await Jimp.read(filePath);
      const { data, width, height } = image.bitmap;
      code = jsQR(new Uint8ClampedArray(data.buffer), width, height);
    } catch (jimpErr) {
      console.error("Image processing error:", jimpErr.message);
      cleanup(filePath);
      return res.status(400).json({
        error: "Could not process this image. Make sure it's a valid image file.",
        inputType: "qrcode",
      });
    }

    cleanup(filePath);

    if (!code) {
      return res.status(400).json({
        error: "Could not decode a QR code from this image. Make sure the QR code is clearly visible.",
        inputType: "qrcode",
      });
    }

    const extractedUrl = code.data;

    // Validate that it looks like a URL
    let urlToAnalyze = extractedUrl;
    if (!/^https?:\/\//i.test(urlToAnalyze)) {
      urlToAnalyze = "https://" + urlToAnalyze;
    }

    // Analyze the extracted URL
    const result = await analyzeUrl(urlToAnalyze, lang);

    res.json({
      inputType: "qrcode",
      extractedUrl: extractedUrl,
      ...result,
    });
  } catch (err) {
    cleanup(filePath);
    console.error("QR code analysis error:", err);
    res.status(500).json({ error: "Failed to analyze QR code." });
  }
});

export default router;
