const BASE = "/api";

/**
 * Analyze pasted text/email content
 */
export async function analyzeText(text) {
  const res = await fetch(`${BASE}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

/**
 * Analyze a URL
 */
export async function analyzeUrl(url) {
  const res = await fetch(`${BASE}/analyze/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

/**
 * Analyze a screenshot (OCR → text → analysis)
 */
export async function analyzeScreenshot(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE}/analyze/screenshot`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

/**
 * Analyze a QR code image (decode → URL → analysis)
 */
export async function analyzeQrCode(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE}/analyze/qrcode`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}
