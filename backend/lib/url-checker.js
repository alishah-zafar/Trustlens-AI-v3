import dns from "dns";
import { lookup as whoisLookup } from "whois";
import { analyzeText } from "./llm-analyzer.js";

// ---------------------------------------------------------------------------
// URL analysis — combines structural heuristics, DNS/WHOIS checks, and LLM
// ---------------------------------------------------------------------------

/** Localized labels for URL heuristic patterns (user-facing red flags) */
const URL_PATTERNS = {
  en: {
    invalidUrl: "Invalid URL format",
    ipAddress: "Uses IP address instead of domain name",
    shortener: (h) => `URL shortener detected (${h})`,
    riskyTld: (t) => `Uses high-risk TLD: .${t}`,
    excessiveSubs: (n) => `Excessive subdomains (${n} levels)`,
    brandSubdomain: (b) => `Brand name "${b}" in subdomain (not the actual domain)`,
    typosquat: (b, d, r) => `Possible typosquat of "${b}" (${d} \u2192 ${r})`,
    typosquatNear: (b, d, r) => `Possible typosquat of "${b}" (${d} looks like ${r})`,
    phishingPath: (w) => `Phishing keywords in path: ${w}`,
    longUrl: "Unusually long URL (possible obfuscation)",
    punycode: "Uses Punycode encoding (potential homograph attack)",
    atSymbol: "Contains @ symbol (URL redirect trick)",
    numericDomain: "Numeric domain name",
    multiHyphens: "Multiple hyphens in domain name",
    nonStdPort: (p) => `Non-standard port: ${p}`,
    dnsNotResolve: "Domain does not resolve in DNS (possibly fake)",
    domainVeryNew: (d) => `Domain is very new (${d} days old)`,
    domainLessYear: (d) => `Domain is less than 1 year old (${d} days)`,
  },
  "roman-urdu": {
    invalidUrl: "URL ka format ghalat hai",
    ipAddress: "Domain ki jagah IP address use ho raha hai",
    shortener: (h) => `URL shortener mila (${h})`,
    riskyTld: (t) => `Khatarnaak TLD use ho rahi hai: .${t}`,
    excessiveSubs: (n) => `Bohat zyada subdomains (${n} levels)`,
    brandSubdomain: (b) => `Subdomain mein brand "${b}" ka naam (asli domain nahi hai)`,
    typosquat: (b, d, r) => `"${b}" ka mumkin typosquat (${d} \u2192 ${r})`,
    typosquatNear: (b, d, r) => `"${b}" ka mumkin typosquat (${d}, ${r} jaisa lagta hai)`,
    phishingPath: (w) => `URL ke path mein phishing alfaaz: ${w}`,
    longUrl: "Bohat lamba URL (chupanay ki koshish)",
    punycode: "Punycode encoding use ho rahi hai (homograph hamla mumkin)",
    atSymbol: "URL mein @ nishaan hai (redirect ka tareeqa)",
    numericDomain: "Domain ka naam sirf adad par mushtamil hai",
    multiHyphens: "Domain mein bohat se hyphens hain",
    nonStdPort: (p) => `Ghair-meyari port: ${p}`,
    dnsNotResolve: "Domain DNS mein resolve nahi hota (shayad jaali ho)",
    domainVeryNew: (d) => `Domain bohat nayi hai (${d} din purani)`,
    domainLessYear: (d) => `Domain 1 saal se kam purani hai (${d} din)`,
  },
  urdu: {
    invalidUrl: "URL کا فارمیٹ غلط ہے",
    ipAddress: "ڈومین کی جگہ IP ایڈریس استعمال ہو رہا ہے",
    shortener: (h) => `URL شارٹنر ملا (${h})`,
    riskyTld: (t) => `خطرناک TLD استعمال ہو رہی ہے: .${t}`,
    excessiveSubs: (n) => `بہت زیادہ سب ڈومینز (${n} سطحیں)`,
    brandSubdomain: (b) => `سب ڈومین میں برانڈ "${b}" کا نام (اصلی ڈومین نہیں)` ,
    typosquat: (b, d, r) => `"${b}" کا ممکنہ ٹائپواسکواٹ (${d} \u2192 ${r})`,
    typosquatNear: (b, d, r) => `"${b}" کا ممکنہ ٹائپواسکواٹ (${d}، ${r} جیسا لگتا ہے)`,
    phishingPath: (w) => `URL کے path میں فشنگ الفاظ: ${w}`,
    longUrl: "بہت لمبا URL (چھپانے کی کوشش)",
    punycode: "Punycode انکوڈنگ استعمال ہو رہی ہے (homograph حملہ ممکن)",
    atSymbol: "URL میں @ نشان ہے (ری ڈائریکٹ کا طریقہ)",
    numericDomain: "ڈومین کا نام صرف اعداد پر مشتمل ہے",
    multiHyphens: "ڈومین میں بہت سے hyphens ہیں",
    nonStdPort: (p) => `غیر معیاری پورٹ: ${p}`,
    dnsNotResolve: "ڈومین DNS میں رساول نہیں ہوتا (شاید جعلی ہو)",
    domainVeryNew: (d) => `ڈومین بہت نیا ہے (${d} دن پرانا)`,
    domainLessYear: (d) => `ڈومین 1 سال سے کم پرانا ہے (${d} دن)`,
  },
};

function getP(lang) {
  return URL_PATTERNS[lang] || URL_PATTERNS.en;
}

export async function analyzeUrl(url, lang) {
  const p = getP(lang);
  const heuristics = runHeuristics(url, p);

  // Run async enrichment checks in parallel (with timeouts)
  const [dnsResult, whoisResult] = await Promise.all([
    checkDns(url).catch(() => null),
    checkWhois(url).catch(() => null),
  ]);

  // Add DNS/WHOIS signals to heuristic score
  let enrichedScore = heuristics.score;
  const enrichedPatterns = [...heuristics.suspiciousPatterns];

  if (dnsResult) {
    if (!dnsResult.resolves) {
      enrichedScore += 20;
      enrichedPatterns.push(p.dnsNotResolve);
    }
  }

  if (whoisResult) {
    if (whoisResult.ageDays !== null && whoisResult.ageDays < 90) {
      enrichedScore += 25;
      enrichedPatterns.push(p.domainVeryNew(whoisResult.ageDays));
    } else if (whoisResult.ageDays !== null && whoisResult.ageDays < 365) {
      enrichedScore += 10;
      enrichedPatterns.push(p.domainLessYear(whoisResult.ageDays));
    }
    if (whoisResult.registrar) {
      whoisResult.registrar = whoisResult.registrar.substring(0, 80);
    }
  }

  enrichedScore = Math.min(100, enrichedScore);

  // Build a text description for the LLM/mock analyzer
  const urlContext = `Analyze this URL for scam/phishing indicators:
URL: ${url}
Domain: ${heuristics.domain}
TLD: ${heuristics.tld}
Subdomain count: ${heuristics.subdomainCount}
Path depth: ${heuristics.pathDepth}
Contains IP address: ${heuristics.isIp}
URL length: ${url.length} characters
DNS resolves: ${dnsResult ? dnsResult.resolves : "unknown"}
${whoisResult?.ageDays != null ? `Domain age: ${whoisResult.ageDays} days` : ""}
Suspicious patterns found: ${heuristics.suspiciousPatterns.length > 0 ? "yes (see red flags)" : "none"}

Consider the URL structure, domain characteristics, and common phishing URL patterns.`;

  const llmResult = await analyzeText(urlContext, lang);

  // Strip extractedContacts — the mock finds the URL in the context text
  delete llmResult.extractedContacts;

  // Combine heuristic score with LLM/mock score (55% LLM, 45% heuristic)
  const combinedScore = Math.round(llmResult.riskScore * 0.55 + enrichedScore * 0.45);

  // Merge red flags (deduplicate)
  const redFlags = [
    ...enrichedPatterns,
    ...llmResult.redFlags.filter((f) => !f.toLowerCase().includes("url")),
  ];

  // Determine verdict
  let verdict;
  if (combinedScore >= 70) verdict = "high_risk";
  else if (combinedScore >= 35) verdict = "suspicious";
  else verdict = "safe";

  return {
    ...llmResult,
    riskScore: Math.min(100, Math.max(0, combinedScore)),
    redFlags: [...new Set(redFlags)],
    verdict,
    urlDetails: {
      domain: heuristics.domain,
      tld: heuristics.tld,
      isIp: heuristics.isIp,
      urlLength: url.length,
      dnsResolves: dnsResult ? dnsResult.resolves : null,
      domainAgeDays: whoisResult?.ageDays ?? null,
      registrar: whoisResult?.registrar ?? null,
      isShortener: heuristics.isShortener,
      isTyposquat: heuristics.isTyposquat,
      typosquatTarget: heuristics.typosquatTarget,
    },
  };
}

// ---------------------------------------------------------------------------
// DNS check — does the domain actually resolve?
// ---------------------------------------------------------------------------

function checkDns(url, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return resolve(null);
    }

    // Skip IP addresses
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      return resolve({ resolves: true });
    }

    const timer = setTimeout(() => resolve({ resolves: null }), timeoutMs);

    dns.lookup(hostname, (err) => {
      clearTimeout(timer);
      if (err && (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN")) {
        resolve({ resolves: false });
      } else {
        resolve({ resolves: true });
      }
    });
  });
}

// ---------------------------------------------------------------------------
// WHOIS check — domain age and registrar
// ---------------------------------------------------------------------------

function checkWhois(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return resolve(null);
    }

    // Strip www. prefix
    const domain = hostname.replace(/^www\./, "");

    // Skip IP addresses
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      return resolve(null);
    }

    const timer = setTimeout(() => resolve(null), timeoutMs);

    whoisLookup(domain, (err, data) => {
      clearTimeout(timer);
      if (err || !data) return resolve(null);

      try {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        const result = { ageDays: null, registrar: null };

        // Try to find creation date
        const creationMatch = text.match(/Creat(?:ed|ion)\s*Date[:\s]+(\d{4}[-/]\d{2}[-/]\d{2})/i)
          || text.match(/Registered\s*on[:\s]+(\d{4}[-/]\d{2}[-/]\d{2})/i)
          || text.match(/Domain\s*Date[:\s]+(\d{4}[-/]\d{2}[-/]\d{2})/i);

        if (creationMatch) {
          const created = new Date(creationMatch[1]);
          if (!isNaN(created.getTime())) {
            result.ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          }
        }

        // Try to find registrar
        const registrarMatch = text.match(/Registrar[:\s]+([^\n\r]+)/i);
        if (registrarMatch) {
          result.registrar = registrarMatch[1].trim();
        }

        resolve(result);
      } catch {
        resolve(null);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Structural heuristics
// ---------------------------------------------------------------------------

const KNOWN_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", "ow.ly",
  "shorturl.at", "bitly.com", "rebrand.ly", "cutt.ly", "rb.gy", "shrturi.com",
  "tiny.cc", "short.io", "bl.ink", "lnk.to",
];

const COMMON_BRANDS = [
  { name: "google", domains: ["google.com"] },
  { name: "facebook", domains: ["facebook.com", "fb.com", "meta.com"] },
  { name: "apple", domains: ["apple.com"] },
  { name: "amazon", domains: ["amazon.com"] },
  { name: "microsoft", domains: ["microsoft.com"] },
  { name: "netflix", domains: ["netflix.com"] },
  { name: "paypal", domains: ["paypal.com"] },
  { name: "instagram", domains: ["instagram.com"] },
  { name: "whatsapp", domains: ["whatsapp.com"] },
  { name: "twitter", domains: ["twitter.com", "x.com"] },
  { name: "linkedin", domains: ["linkedin.com"] },
  { name: "youtube", domains: ["youtube.com"] },
];

// Common character substitutions for typosquatting
const CHAR_SWAPS = {
  "0": "o", "1": "l", "3": "e", "4": "a", "5": "s",
  "@": "a", "$": "s", "\u0131": "i", "\u0261": "g",
};

function runHeuristics(url, p) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return {
      score: 50,
      domain: "unknown",
      tld: "unknown",
      subdomainCount: 0,
      pathDepth: 0,
      isIp: false,
      isShortener: false,
      isTyposquat: false,
      typosquatTarget: null,
      suspiciousPatterns: [p.invalidUrl],
    };
  }

  const hostname = parsed.hostname;
  const parts = hostname.split(".");
  const tld = parts[parts.length - 1];
  const domain = parts.length >= 2 ? parts[parts.length - 2] + "." + tld : hostname;
  const subdomainCount = Math.max(0, parts.length - 2);
  const pathDepth = parsed.pathname.split("/").filter(Boolean).length;
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

  const suspiciousPatterns = [];
  let score = 0;

  // IP address instead of domain name — high risk
  if (isIp) {
    suspiciousPatterns.push(p.ipAddress);
    score += 30;
  }

  // URL shortener detection
  const isShortener = KNOWN_SHORTENERS.some((s) => hostname === s || hostname.endsWith("." + s));
  if (isShortener) {
    suspiciousPatterns.push(p.shortener(hostname));
    score += 15;
  }

  // Suspicious TLDs commonly used by scammers
  const riskyTlds = [
    "xyz", "top", "buzz", "club", "work", "gq", "ml", "cf", "tk",
    "cam", "rest", "icu", "monster", "quest", "surf",
  ];
  if (riskyTlds.includes(tld.toLowerCase())) {
    suspiciousPatterns.push(p.riskyTld(tld));
    score += 15;
  }

  // Excessive subdomains (e.g., paypal.secure.login.phishingsite.com)
  if (subdomainCount >= 3) {
    suspiciousPatterns.push(p.excessiveSubs(subdomainCount));
    score += 20;
  }

  // Brand impersonation in subdomain
  const brands = ["paypal", "apple", "google", "microsoft", "amazon", "netflix", "facebook", "instagram", "whatsapp"];
  const subdomainPart = parts.slice(0, -2).join(".");
  for (const brand of brands) {
    if (subdomainPart.toLowerCase().includes(brand) && !domain.toLowerCase().includes(brand)) {
      suspiciousPatterns.push(p.brandSubdomain(brand));
      score += 25;
      break;
    }
  }

  // Typosquatting detection
  let isTyposquat = false;
  let typosquatTarget = null;
  const domainName = parts[parts.length - 2] || "";
  const domainNameLower = domainName.toLowerCase();

  for (const brand of COMMON_BRANDS) {
    for (const realDomain of brand.domains) {
      const realName = realDomain.split(".")[0];
      if (domainNameLower === realName) continue; // exact match, skip to next
  
      // Check character substitutions (single-pass to avoid interference)
      let normalized = "";
      for (const ch of domainNameLower) {
        normalized += CHAR_SWAPS[ch] || ch;
      }
      // Also check multi-char swaps (vv→w, rn→m, cl→d)
      normalized = normalized.replace(/vv/g, "w").replace(/rn/g, "m").replace(/cl/g, "d");
      if (normalized === realName && domainNameLower !== realName) {
        isTyposquat = true;
        typosquatTarget = brand.name;
        suspiciousPatterns.push(p.typosquat(brand.name, domainName, realName));
        score += 30;
        break;
      }
  
      // Check edit distance = 1 (one character different, added, or removed)
      if (!isTyposquat && domainNameLower !== realName) {
        const dist = levenshteinDistance(domainNameLower, realName);
        if (dist === 1 && domainNameLower.length >= realName.length - 1) {
          isTyposquat = true;
          typosquatTarget = brand.name;
          suspiciousPatterns.push(p.typosquatNear(brand.name, domainName, realName));
          score += 25;
          break;
        }
      }
    }
    if (isTyposquat) break;
  }

  // URL contains "secure", "verify", "login", "update" in path
  const phishingPathWords = ["secure", "verify", "confirm", "update-account", "login", "signin", "wallet", "account-suspended"];
  const pathLower = parsed.pathname.toLowerCase();
  const matchedPathWords = phishingPathWords.filter((w) => pathLower.includes(w));
  if (matchedPathWords.length > 0) {
    suspiciousPatterns.push(p.phishingPath(matchedPathWords.join(", ")));
    score += 15;
  }

  // Very long URLs (URL obfuscation)
  if (url.length > 150) {
    suspiciousPatterns.push(p.longUrl);
    score += 10;
  }

  // Punycode / internationalized domain (potential homograph attack)
  if (hostname.startsWith("xn--")) {
    suspiciousPatterns.push(p.punycode);
    score += 25;
  }

  // @ in URL (can redirect)
  if (url.includes("@")) {
    suspiciousPatterns.push(p.atSymbol);
    score += 20;
  }

  // Numeric domain
  if (/^\d+$/.test(parts[0])) {
    suspiciousPatterns.push(p.numericDomain);
    score += 15;
  }

  // Hyphens in domain (e.g., paypal-secure-login.com)
  if (domainName.includes("-") && domainName.split("-").length > 2) {
    suspiciousPatterns.push(p.multiHyphens);
    score += 10;
  }

  // Non-standard port
  if (parsed.port && !["80", "443", ""].includes(parsed.port)) {
    suspiciousPatterns.push(p.nonStdPort(parsed.port));
    score += 10;
  }

  return {
    score: Math.min(100, score),
    domain,
    tld,
    subdomainCount,
    pathDepth,
    isIp,
    isShortener,
    isTyposquat,
    typosquatTarget,
    suspiciousPatterns,
  };
}

/** Simple Levenshtein distance for typosquatting detection */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
