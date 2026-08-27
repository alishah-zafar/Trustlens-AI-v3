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
 * POST /api/analyze/qrcode
 * Accepts a QR code image, decodes the embedded URL, then analyzes it via the URL pipeline.
 *
 * STUB: QR decoding (jsQR + jimp) is not yet implemented.
 * TODO: Decode the QR code with jsQR, extract the URL, then pass to analyzeUrl().
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A QR code image is required." });
    }

    // --- STUB: QR decoding not yet implemented ---
    // import Jimp from "jimp";
    // import jsQR from "jsqr";
    //
    // const image = await Jimp.read(req.file.path);
    // const { data, width, height } = image.bitmap;
    // const code = jsQR(new Uint8ClampedArray(data.buffer), width, height);
    //
    // if (!code) {
    //   return res.status(400).json({ error: "Could not decode a QR code from this image." });
    // }
    //
    // const extractedUrl = code.data;
    // const { analyzeUrl } = await import("../lib/url-checker.js");
    // const result = await analyzeUrl(extractedUrl);
    // res.json({ inputType: "qrcode", extractedUrl, ...result });

    res.status(501).json({
      error: "QR code analysis is not yet implemented. jsQR integration coming soon.",
      inputType: "qrcode",
      uploadedFile: req.file.filename,
    });
  } catch (err) {
    console.error("QR code analysis error:", err);
    res.status(500).json({ error: "Failed to analyze QR code." });
  }
});

export default router;
