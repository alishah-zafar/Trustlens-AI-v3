// Data-first layer: known scam patterns + near-duplicates of known scam examples.
// It can only RAISE risk. If nothing matches it returns null and the AI decides.
import { readFileSync } from "fs";

const AR = "\\u0600-\\u06FF";

const has = (t, re) => re.test(t);

const URL_RE = /https?:\/\/|www\.|bit\.ly|tinyurl|cutt\.ly|rb\.gy|is\.gd|\b[a-z0-9-]+\.(xyz|top|tk|icu|cc|link|click|buzz|club|work|cam|rest)\b/i;
const PHONE_RE = /\b0\d[\dx]{1,2}[- ]?[\dx]{6,}\b/i;

const ASK_RE = new RegExp(
  "\\b(send|share|enter|give|provide|tell|bata|batayen|bata dein|bhej|bhejo|bhejein|bhejna|dein|do|likhein|submit)\\b|[" + AR + "]*(بھیج|بتا|دیں|شیئر)[" + AR + "]*"
);
const SENSITIVE_RE = new RegExp(
  "\\b(otp|pin|cnic|password|passcode|card number|account number|cvv)\\b|شناختی کارڈ|پاس ورڈ|(^|[^\\u0600-\\u06FF])پن([^\\u0600-\\u06FF]|$)|کوڈ|اکاؤنٹ نمبر|کارڈ نمبر"
);
const PRESSURE_RE = new RegExp(
  "block|suspend|locked|band ho|verify|foran|abhi|urgent|immediately|24 |ghantay|hours|warna|or else|otherwise|mat batana|don't tell|do not tell|nadra|fia\\b|hbl|jazzcash|easypaisa|bank|بلاک|بند|فوراً|فوری|ابھی|ورنہ|مت بتانا|نادرا|بینک|ایزی پیسہ|جاز کیش"
);
const FEE_RE = new RegExp(
  "(processing|clearance|registration|delivery|shipping|redelivery|training|advance|release|customs?)\\s*(fee|fees|charges?|payment)|fee\\s*(jama|bhej|pay)|(فیس)\\s*(جمع|بھیج)|کلیئرنس فیس|رجسٹریشن فیس|پروسیسنگ فیس"
);
const PAYVERB_RE = new RegExp("\\b(send|pay|bhej\\w*|jama|deposit)\\b|بھیج|جمع");

const RULES = [
  { id: "otp_pin", score: 92, tactics: ["requests_credentials", "urgency"], critical: false,
    test: (t) => has(t, SENSITIVE_RE) && has(t, ASK_RE) && has(t, PRESSURE_RE) },
  { id: "harm_strong", score: 95, tactics: ["threat_of_harm", "extortion"], critical: true,
    test: (t) => has(t, /(kill|hurt|harm|murder)\s+(you|u)\b|jaan se (maar|mar)|i know where you live|maar d(oo|u)nga|جان سے/) },
  { id: "harm_soft", score: 90, tactics: ["threat_of_harm", "threats"], critical: true,
    test: (t) => has(t, /bura hoga|you will regret|will regret it|tumhara address|پچھتانا/) &&
                 has(t, new RegExp("warna|or |paisay|money|pay|1 lakh|send|bhej|ورنہ|پیسے|do\\b")) },
  { id: "blackmail", score: 95, tactics: ["extortion", "threat_of_harm"], critical: true,
    test: (t) => has(t, new RegExp("(photos?|pictures?|tasveer\\w*|video|تصویر[" + AR + "]*|ویڈیو).*(expose|viral|bhej d|sab ko|everyone|بھیج دوں|وائرل|سب کو)|will expose|expose your")) },
  { id: "money_or_else", score: 90, tactics: ["requests_money", "threats"], critical: true,
    test: (t) => has(t, new RegExp("(paisay|paise|money|payment|pay|rupay|bhej|پیسے).*(warna|or else|ورنہ)|warna dekh lena|ورنہ")) &&
                 has(t, new RegExp("paisay|paise|money|pay|rupay|bhej|پیسے|payment")) },
  { id: "fee_scam", score: 90, tactics: ["requests_money", "fake_links"], critical: false,
    test: (t) => has(t, FEE_RE) && has(t, PAYVERB_RE) },
  { id: "prize", score: 90, tactics: ["too_good_to_be_true", "requests_money"], critical: false,
    test: (t) => has(t, new RegExp("inaam|lottery|prize|jackpot|you won|lucky draw|free (laptop|iphone)|لاٹری|انعام")) &&
                 has(t, new RegExp("fee|pay|bhej|card number|\\bpin\\b|claim|http|link|فیس|کارڈ نمبر|پن|جمع")) },
  { id: "account_problem", score: 90, tactics: ["impersonation", "fake_links", "urgency"], critical: false,
    test: (t) => (has(t, new RegExp("(account|card|sim|subscription|اکاؤنٹ|کارڈ|سم)[^.!?]*(block|suspend|band ho|hold|locked|بلاک|بند)")) ||
                  has(t, /(block|suspend)\w*[^.!?]*(account|card|sim)/)) &&
                 (has(t, URL_RE) || has(t, PHONE_RE) || (has(t, SENSITIVE_RE) && has(t, ASK_RE))) },
  { id: "govt_scheme", score: 92, tactics: ["impersonation", "requests_credentials"], critical: false,
    test: (t) => has(t, new RegExp("bisp|benazir|income support|ehsaas|بے نظیر|احساس")) &&
                 has(t, new RegExp("cnic|account number|http|link|fee|bhej|شناختی|اکاؤنٹ نمبر|بھیج|لنک")) },
  { id: "authority", score: 92, tactics: ["impersonation", "threats", "requests_money"], critical: false,
    test: (t) => has(t, new RegExp("\\b(nadra|fia|police|tax authority|customs|court)\\b|نادرا|ایف آئی اے|عدالت")) &&
                 has(t, new RegExp("arrest|giraftari|case|fine|warna|pay|bhej|gift card|otp|cnic|code|بتائیں|کوڈ|شناختی|گرفتار")) },
  { id: "secrecy_money", score: 90, tactics: ["emotional_manipulation", "requests_money"], critical: false,
    test: (t) => has(t, new RegExp("kisi ko mat batana|don't tell anyone|do not tell anyone|mat batana|مت بتانا|کسی کو نہ بتا")) &&
                 has(t, new RegExp("paisay|money|send|bhej|rupay|easypaisa|jazzcash|\\$|\\d{4,}|بھیج|ایزی پیسہ|روپے")) },
  { id: "romance_money", score: 88, tactics: ["romance_scam", "requests_money"], critical: false,
    test: (t) => has(t, /my love|my dear|soldier|stuck abroad|stranded|overseas/) && has(t, /send|money|dollars|western union/) },
  { id: "investment", score: 85, tactics: ["investment_scam"], critical: false,
    test: (t) => has(t, /guaranteed (\d+% )?(monthly |weekly )?returns?|double your money|\d+% (monthly|weekly|daily) return|no risk/) },
  { id: "utility_threat", score: 88, tactics: ["impersonation", "fake_links", "urgency"], critical: false,
    test: (t) => has(t, /bijli|electricity|gas|bill/) && has(t, /kat jayega|disconnect|connection kat|will be cut/) && has(t, URL_RE) },
];

// --- near-duplicate match against known scam examples (examples.json) ---
let SCAM_EXAMPLES = [];
try {
  const all = JSON.parse(readFileSync(new URL("./examples.json", import.meta.url), "utf-8"));
  SCAM_EXAMPLES = all.filter((e) => e.score >= 80).map((e) => ({ words: wordSet(e.text) }));
} catch { /* optional */ }

function wordSet(s) {
  return new Set(String(s).toLowerCase().match(new RegExp("[a-z0-9]+|[" + AR + "]+", "g")) || []);
}
function jaccard(a, b) {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

/** Returns { score, tactics, critical, reasons } or null (= ask the AI). */
export function matchKnown(text) {
  const t = String(text).toLowerCase();
  const hits = RULES.filter((r) => r.test(t));
  let nearDup = false;
  const words = wordSet(text);
  if (words.size >= 4) nearDup = SCAM_EXAMPLES.some((e) => jaccard(words, e.words) >= 0.8);

  if (hits.length === 0 && !nearDup) return null;

  const tactics = [...new Set(hits.flatMap((h) => h.tactics))];
  let score = hits.length ? Math.max(...hits.map((h) => h.score)) : 88;
  score = Math.min(98, score + Math.max(0, hits.length - 1) * 2);
  return {
    score,
    tactics,
    critical: hits.some((h) => h.critical),
    reasons: [...hits.map((h) => h.id), ...(nearDup ? ["near_duplicate"] : [])],
  };
}
