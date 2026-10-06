/** Shape of the analysis result returned by the backend */
export interface AnalysisResult {
  inputType: "text" | "url" | "screenshot" | "qrcode";
  riskScore: number;
  confidence: "low" | "medium" | "high";
  explanation: string;
  redFlags: string[];
  tactics: string[];
  recommendations: string[];
  scamCategory?: string;
  extractedText?: string;
  extractedUrl?: string;
  detectedLanguage?: string;
  containsUrl?: boolean;
  verdict?: "high_risk" | "suspicious" | "safe";
  urlDetails?: {
    domain: string;
    tld: string;
    isIp: boolean;
    urlLength: number;
    dnsResolves: boolean | null;
    domainAgeDays: number | null;
    registrar: string | null;
    isShortener: boolean;
    isTyposquat: boolean;
    typosquatTarget: string | null;
  };
  extractedContacts?: {
    urls?: string[];
    phones?: string[];
    emails?: string[];
  };
}

/** Link redirect chain trace result */
export interface LinkTraceResult {
  originalUrl: string;
  hops: Array<{
    url: string;
    domain: string;
    status: number | null;
    isSuspicious: boolean;
    flags: string[];
  }>;
  finalDestination: string;
  totalHops: number;
  hasRedirects: boolean;
  isSuspicious: boolean;
}

const BASE = "https://trustlens-ai-production-2644.up.railway.app/api";

export async function analyzeText(text: string, lang = "en"): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

export async function analyzeUrl(url: string, lang = "en"): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, lang }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

export async function analyzeScreenshot(file: File, lang = "en"): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("lang", lang);
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

export async function analyzeQrCode(file: File, lang = "en"): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("lang", lang);
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

/** Trace a URL's redirect chain — the signature Link Destination Preview feature */
export async function traceLink(url: string): Promise<LinkTraceResult> {
  const res = await fetch(`${BASE}/analyze/trace-link`, {
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
