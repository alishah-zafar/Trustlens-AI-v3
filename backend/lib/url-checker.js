import { analyzeText } from "./llm-analyzer.js";

/**
 * Analyze a URL for scam indicators.
 * Combines structural heuristics with LLM pattern analysis.
 */
export async function analyzeUrl(url) {
  const heuristics = runHeuristics(url);

  // Build a text description of the URL for the LLM to analyze
  const urlContext = `Analyze this URL for scam/phishing indicators:
URL: ${url}
Domain: ${heuristics.domain}
TLD: ${heuristics.tld}
Subdomain count: ${heuristics.subdomainCount}
Path depth: ${heuristics.pathDepth}
Contains IP address: ${heuristics.isIp}
URL length: ${url.length} characters
Suspicious patterns found: ${heuristics.suspiciousPatterns.join(", ") || "none"}

Consider the URL structure, domain characteristics, and common phishing URL patterns.`;

  const llmResult = await analyzeText(urlContext);

  // Combine heuristic score with LLM score (60% LLM, 40% heuristic)
  const combinedScore = Math.round(llmResult.riskScore * 0.6 + heuristics.score * 0.4);

  // Merge red flags
  const redFlags = [
    ...heuristics.suspiciousPatterns,
    ...llmResult.redFlags.filter((f) => !f.toLowerCase().includes("url")), // dedupe
  ];

  return {
    ...llmResult,
    riskScore: Math.min(100, Math.max(0, combinedScore)),
    redFlags: [...new Set(redFlags)],
    urlDetails: {
      domain: heuristics.domain,
      tld: heuristics.tld,
      isIp: heuristics.isIp,
      urlLength: url.length,
    },
  };
}

function runHeuristics(url) {
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
      suspiciousPatterns: ["Invalid URL format"],
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
    suspiciousPatterns.push("Uses IP address instead of domain name");
    score += 30;
  }

  // Suspicious TLDs commonly used by scammers
  const riskyTlds = [
    "xyz", "top", "buzz", "club", "work", "gq", "ml", "cf", "tk",
    "cam", "rest", "icu", "monster", "quest", "surf",
  ];
  if (riskyTlds.includes(tld.toLowerCase())) {
    suspiciousPatterns.push(`Uses high-risk TLD: .${tld}`);
    score += 15;
  }

  // Excessive subdomains (e.g., paypal.secure.login.phishingsite.com)
  if (subdomainCount >= 3) {
    suspiciousPatterns.push(`Excessive subdomains (${subdomainCount} levels)`);
    score += 20;
  }

  // Brand impersonation in subdomain
  const brands = ["paypal", "apple", "google", "microsoft", "amazon", "netflix", "facebook", "instagram"];
  const subdomainPart = parts.slice(0, -2).join(".");
  for (const brand of brands) {
    if (subdomainPart.toLowerCase().includes(brand) && !domain.toLowerCase().includes(brand)) {
      suspiciousPatterns.push(`Brand name "${brand}" in subdomain (not the actual domain)`);
      score += 25;
      break;
    }
  }

  // URL contains "secure", "verify", "login", "update" in path — common phishing patterns
  const phishingPathWords = ["secure", "verify", "confirm", "update-account", "login", "signin", "wallet"];
  const pathLower = parsed.pathname.toLowerCase();
  const matchedPathWords = phishingPathWords.filter((w) => pathLower.includes(w));
  if (matchedPathWords.length > 0) {
    suspiciousPatterns.push(`Phishing keywords in path: ${matchedPathWords.join(", ")}`);
    score += 15;
  }

  // Very long URLs (URL obfuscation)
  if (url.length > 150) {
    suspiciousPatterns.push("Unusually long URL (possible obfuscation)");
    score += 10;
  }

  // Punycode / internationalized domain (potential homograph attack)
  if (hostname.startsWith("xn--")) {
    suspiciousPatterns.push("Uses Punycode encoding (potential homograph attack)");
    score += 25;
  }

  // @ in URL (can redirect)
  if (url.includes("@")) {
    suspiciousPatterns.push("Contains @ symbol (URL redirect trick)");
    score += 20;
  }

  // Numeric domain
  if (/^\d+$/.test(parts[0])) {
    suspiciousPatterns.push("Numeric domain name");
    score += 15;
  }

  // Hyphens in domain (e.g., paypal-secure.com)
  const domainName = parts[parts.length - 2] || "";
  if (domainName.includes("-") && domainName.split("-").length > 2) {
    suspiciousPatterns.push("Multiple hyphens in domain name");
    score += 10;
  }

  // Non-standard port
  if (parsed.port && !["80", "443", ""].includes(parsed.port)) {
    suspiciousPatterns.push(`Non-standard port: ${parsed.port}`);
    score += 10;
  }

  return {
    score: Math.min(100, score),
    domain,
    tld,
    subdomainCount,
    pathDepth,
    isIp,
    suspiciousPatterns,
  };
}
