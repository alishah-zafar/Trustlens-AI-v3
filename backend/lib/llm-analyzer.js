import OpenAI from "openai";

const SYSTEM_PROMPT = `You are TrustLens AI, an expert scam and phishing detection system. 
When given text content (from a message, email, SMS, or extracted from an image), analyze it 
thoroughly for signs of fraud, phishing, or scam attempts.

You MUST respond with a valid JSON object in exactly this format:
{
  "riskScore": <number 0-100, where 0 is safe and 100 is certain scam>,
  "explanation": "<2-3 sentence plain-language summary of your assessment>",
  "redFlags": ["<specific red flag 1>", "<specific red flag 2>", ...],
  "tactics": ["<tactic name>", ...],
  "recommendations": ["<actionable safety recommendation 1>", ...]
}

Known scam tactics to detect (include all that apply):
- urgency (pressure to act immediately)
- impersonation (pretending to be a trusted entity like a bank, government, or company)
- fake_links (suspicious or misleading URLs)
- requests_money (asking for payment, wire transfer, gift cards)
- requests_otp (asking for verification codes, OTP, or 2FA codes)
- requests_credentials (asking for passwords, PINs, or login details)
- threats (threatening consequences like account closure, legal action, arrest)
- too_good_to_be_true (unrealistic prizes, lottery wins, huge refunds)
- emotional_manipulation (exploiting fear, greed, or sympathy)
- grammatical_errors (unusual spelling/grammar suggesting non-native or rushed composition)

Guidelines:
- Legitimate messages from real organizations typically do NOT ask for sensitive info via text/email
- Be strict: when in doubt, flag it. It's better to warn than to miss a real scam.
- Keep explanations clear and jargon-free for non-technical users.
- If the text appears completely benign, give a low score with an explanation of why it seems safe.
- Always provide at least one recommendation, even for safe content.`;

let openaiClient = null;

function getClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });
  }
  return openaiClient;
}

/**
 * Analyze text for scam indicators.
 * Falls back to a heuristic mock when no API key is configured.
 */
export async function analyzeText(text) {
  const client = getClient();

  if (!client) {
    return mockAnalyze(text);
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the following text for scam indicators:\n\n${text}` },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return normalizeResult(result);
  } catch (err) {
    console.error("LLM analysis error:", err.message);
    // Fallback to mock on failure
    return mockAnalyze(text);
  }
}

/** Normalize and validate the LLM response shape */
function normalizeResult(raw) {
  return {
    riskScore: Math.min(100, Math.max(0, Number(raw.riskScore) || 0)),
    explanation: String(raw.explanation || "No explanation provided."),
    redFlags: Array.isArray(raw.redFlags) ? raw.redFlags : [],
    tactics: Array.isArray(raw.tactics) ? raw.tactics : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
  };
}

// ---------------------------------------------------------------------------
// Mock analyzer — used when no OPENAI_API_KEY is set (development / demo)
// ---------------------------------------------------------------------------

const SCAM_KEYWORDS = {
  urgency: ["immediately", "urgent", "act now", "right away", "within 24 hours", "expires", "limited time", "hurry"],
  impersonation: ["your bank", "paypal", "apple", "google", "microsoft", "amazon", "irs", "government", "police"],
  fake_links: ["bit.ly", "tinyurl", "shorturl", "bitly", "goo.gl", "is.gd"],
  requests_money: ["wire transfer", "gift card", "bitcoin", "payment", "send money", "bank transfer", "western union"],
  requests_otp: ["verification code", "otp", "one-time", "2fa code", "security code", "confirm code"],
  requests_credentials: ["password", "pin", "login", "ssn", "social security", "credit card number"],
  threats: ["suspended", "terminated", "locked", "legal action", "arrest", "penalty", "fine"],
  too_good_to_be_true: ["won", "winner", "prize", "lottery", "jackpot", "free money", "refund", "cashback"],
  emotional_manipulation: ["dear friend", "help me", "emergency", "please help", "family"],
};

function mockAnalyze(text) {
  const lower = text.toLowerCase();
  const detectedTactics = [];
  const redFlags = [];
  let score = 5; // baseline safe

  for (const [tactic, keywords] of Object.entries(SCAM_KEYWORDS)) {
    const found = keywords.filter((kw) => lower.includes(kw));
    if (found.length > 0) {
      detectedTactics.push(tactic);
      redFlags.push(
        `${tactic.replace(/_/g, " ")}: detected "${found.join('", "')}"`
      );
      score += found.length * 12;
    }
  }

  // URL presence is a mild signal
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = text.match(urlRegex) || [];
  if (urls.length > 0) {
    score += urls.length * 5;
    redFlags.push(`Contains ${urls.length} URL(s) that should be verified`);
  }

  // Excessive punctuation / caps
  if (/[A-Z]{5,}/.test(text)) {
    score += 5;
    redFlags.push("Excessive use of capital letters");
  }
  if (/(!!+|\?\?+)/.test(text)) {
    score += 5;
    redFlags.push("Excessive punctuation suggesting urgency");
  }

  score = Math.min(100, Math.max(0, score));

  const explanation =
    score >= 60
      ? "This message shows multiple indicators commonly found in scam attempts. Exercise extreme caution and do not click any links or share personal information."
      : score >= 30
        ? "This message contains some suspicious elements. While not definitively a scam, proceed with caution and verify the sender's identity."
        : "This message appears to be relatively safe. However, always exercise normal caution when dealing with unsolicited messages.";

  const recommendations =
    score >= 60
      ? [
          "Do NOT click any links or download attachments",
          "Do NOT reply or share any personal information",
          "Report this message to the relevant platform (email provider, social media, etc.)",
          "If it claims to be from a company, contact them directly through their official website",
        ]
      : score >= 30
        ? [
            "Verify the sender's identity through an independent channel",
            "Do not click links — navigate to the claimed website manually",
            "Check for official contact methods on the organization's real website",
          ]
        : [
            "No immediate action needed, but stay vigilant",
            "If anything changes or follow-up messages seem suspicious, re-analyze them",
          ];

  return {
    riskScore: score,
    explanation,
    redFlags,
    tactics: detectedTactics,
    recommendations,
  };
}
