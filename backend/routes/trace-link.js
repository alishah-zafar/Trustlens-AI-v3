import { Router } from "express";

const router = Router();
const MAX_HOPS = 5;
const TIMEOUT_MS = 8000;

/**
 * Follow a URL's redirect chain and return each hop.
 * POST /api/analyze/trace-link
 * Body: { url: string }
 */
router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A URL is required." });
  }

  // Validate URL format
  let parsedUrl;
  try {
    parsedUrl = new URL(url.startsWith("http") ? url : `http://${url}`);
  } catch {
    return res.status(400).json({ error: "Invalid URL format." });
  }

  const hops = [];
  let currentUrl = parsedUrl.href;
  let hopCount = 0;

  try {
    while (hopCount < MAX_HOPS) {
      const hopInfo = {
        url: currentUrl,
        domain: getDomain(currentUrl),
        status: null,
        isSuspicious: false,
        flags: [],
      };

      // Check for suspicious patterns
      if (isIpAddress(hopInfo.domain)) {
        hopInfo.flags.push("IP address instead of domain name");
        hopInfo.isSuspicious = true;
      }
      if (!currentUrl.startsWith("https://")) {
        hopInfo.flags.push("Non-HTTPS connection");
        hopInfo.isSuspicious = true;
      }
      if (isUrlShortener(hopInfo.domain)) {
        hopInfo.flags.push("URL shortener service");
      }

      // Make HEAD request to follow redirects one at a time
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(currentUrl, {
          method: "HEAD",
          redirect: "manual",
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TrustLens-Security-Scanner/1.0",
          },
        });
        clearTimeout(timeout);

        hopInfo.status = response.status;

        // Check if this is a redirect (3xx)
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get("location");
          if (location) {
            hops.push(hopInfo);
            // Resolve relative URLs
            currentUrl = new URL(location, currentUrl).href;
            hopCount++;
            continue;
          }
        }

        // Final destination reached
        hops.push(hopInfo);
        break;
      } catch (err) {
        clearTimeout(timeout);
        hopInfo.status = null;
        hopInfo.flags.push(err.name === "AbortError" ? "Request timed out" : "Could not connect");
        hopInfo.isSuspicious = true;
        hops.push(hopInfo);
        break;
      }
    }

    if (hopCount >= MAX_HOPS) {
      hops.push({
        url: "...",
        domain: "...",
        status: null,
        isSuspicious: true,
        flags: [`Redirect chain exceeded ${MAX_HOPS} hops — possible redirect loop`],
      });
    }

    // Compare first and last domain for brand mismatch
    if (hops.length > 1) {
      const firstDomain = hops[0].domain;
      const lastDomain = hops[hops.length - 1].domain;
      if (firstDomain !== lastDomain && !isUrlShortener(firstDomain)) {
        hops[hops.length - 1].flags.push(`Domain changed from ${firstDomain} to ${lastDomain}`);
        hops[hops.length - 1].isSuspicious = true;
      }
    }

    res.json({
      originalUrl: url,
      hops,
      finalDestination: hops[hops.length - 1]?.url || url,
      totalHops: hops.length,
      hasRedirects: hops.length > 1,
      isSuspicious: hops.some((h) => h.isSuspicious),
    });
  } catch (err) {
    console.error("Link trace error:", err.message);
    res.status(500).json({ error: "Failed to trace link." });
  }
});

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function isIpAddress(domain) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(domain) || domain.includes(":"); // IPv4 or IPv6
}

function isUrlShortener(domain) {
  const shorteners = [
    "bit.ly", "tinyurl.com", "goo.gl", "is.gd", "t.co", "ow.ly",
    "buff.ly", "rebrand.ly", "short.io", "cutt.ly", "tiny.cc",
    "rb.gy", "bl.ink", "shorturl.at",
  ];
  return shorteners.some((s) => domain.endsWith(s));
}

export default router;
