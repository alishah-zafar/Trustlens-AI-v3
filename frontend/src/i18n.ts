export interface Language {
  code: string;
  label: string;
  name: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "roman-urdu", label: "RU", name: "Roman Urdu" },
  { code: "urdu", label: "اردو", name: "Urdu", rtl: true },
];

interface CardStrings {
  title: string;
  desc: string;
}

interface TacticInfoMap {
  urgency: string;
  impersonation: string;
  fake_links: string;
  requests_money: string;
  requests_otp: string;
  requests_credentials: string;
  threats: string;
  too_good_to_be_true: string;
  emotional_manipulation: string;
  threat_of_harm: string;
  extortion: string;
  romance_scam: string;
  investment_scam: string;
  language_signals: string;
  grammatical_errors: string;
}

export interface Strings {
  tabs: { text: string; url: string; screenshot: string; qrcode: string };
  desc: { text: string; url: string; screenshot: string; qrcode: string };
  placeholders: { text: string; url: string };
  analyze: string;
  analyzing: string;
  analyzingTitle: string;
  analyzingSub: string;
  animTransport: string;
  animEnRoute: string;
  animArrived: string;
  animInvestigating: string;
  uploadClick: string;
  uploadOr: string;
  uploadFormats: string;
  uploadReplace: string;
  analysisComplete: string;
  highConfidence: string;
  mediumConfidence: string;
  lowConfidence: string;
  redFlags: string;
  whatToDo: string;
  analysisFailed: string;
  howItWorks: string;
  footer: string;
  extractedText: string;
  extractedUrl: string;
  foundInImage: string;
  verdictHighRisk: string;
  verdictSuspicious: string;
  verdictSafe: string;
  domainDetails: string;
  domain: string;
  domainAge: string;
  days: string;
  dnsResolves: string;
  dnsNotResolves: string;
  urlType: string;
  shortener: string;
  typosquat: string;
  heroHeadline: string;
  heroSub: string;
  heroCta: string;
  cards: { message: CardStrings; url: CardStrings; screenshot: CardStrings; qrcode: CardStrings };
  analyzeAnother: string;
  removeFile: string;
  imagePreview: string;
  scanSteps: string[];
  riskLabels: { high: string; medium: string; low: string };
  tacticInfo: TacticInfoMap;
  nav: { home: string; analyze: string; history: string; about: string };
  landing: {
    tagline: string;
    subtitle: string;
    featAiTitle: string;
    featAiDesc: string;
    featRiskTitle: string;
    featRiskDesc: string;
    featLangTitle: string;
    featLangDesc: string;
    sigTitle: string;
    sigBadge: string;
    sigDesc: string;
    sigCta: string;
  };
  analyzePage: {
    title: string;
    subtitle: string;
    tabs: { message: string; website: string; screenshot: string; qrcode: string };
    characters: string;
    maxChars: string;
    tryExample: string;
    submit: string;
    submitting: string;
    errText: string;
    errUrl: string;
    errImage: string;
    errQr: string;
    errGeneric: string;
  };
  resultsPage: {
    riskLevels: { severe: string; high: string; moderate: string; low: string };
    verdicts: { scam: string; suspicious: string; mild: string; safe: string };
    detected: string;
    whyFlagged: string;
    originalContent: string;
    disclaimer: string;
    downloadReport: string;
    noResult: string;
    linkPreview: {
      title: string;
      badge: string;
      loading: string;
      unverifiedTitle: string;
      unverifiedDesc: string;
      original: string;
      final: string;
      hop: string;
      suspiciousChain: string;
      redirectsSafe: string;
      noRedirects: string;
    };
  };
  historyPage: {
    title: string;
    subtitle: string;
    clear: string;
    empty: string;
    start: string;
    justNow: string;
    minAgo: string;
    hoursAgo: string;
    daysAgo: string;
    riskLevels: { severe: string; high: string; moderate: string; low: string };
  };
  aboutPage: {
    tagline: string;
    whatTitle: string;
    whatP1: string;
    whatP2: string;
    whyTitle: string;
    whyP: string;
    capTitle: string;
    capAiTitle: string;
    capAiDesc: string;
    capLangTitle: string;
    capLangDesc: string;
    capLinkTitle: string;
    capLinkDesc: string;
    capMultiTitle: string;
    capMultiDesc: string;
  };
  footerLinks: { about: string; history: string; privacy: string; terms: string };
  rights: string;
}

const STRINGS: Record<string, Strings> = {
  en: {
    tabs: { text: "Text / Email", url: "URL", screenshot: "Screenshot", qrcode: "QR Code" },
    desc: {
      text: "Paste the suspicious message, email, or SMS content below.",
      url: "Enter the URL you want to check for phishing or scam indicators.",
      screenshot: "Upload a screenshot of the suspicious message or webpage.",
      qrcode: "Upload an image of a QR code to decode and analyze the embedded link.",
    },
    placeholders: {
      text: "Paste the suspicious message here...",
      url: "https://suspicious-site.com/...",
    },
    analyze: "Analyze",
    analyzing: "Analyzing...",
    analyzingTitle: "Analyzing threat indicators\u2026",
    analyzingSub: "Scanning for scams, phishing & manipulation",
    animTransport: "Transporting data to TrustLens\u2026",
    animEnRoute: "En route to TrustLens HQ\u2026",
    animArrived: "Arrived at TrustLens HQ",
    animInvestigating: "The detective is on the case\u2026",
    uploadClick: "Click to upload",
    uploadOr: "or drag and drop",
    uploadFormats: "PNG, JPG, WebP, or BMP (max 10 MB)",
    uploadReplace: "Click or drop to replace",
    analysisComplete: "Analysis Complete",
    highConfidence: "High confidence",
    mediumConfidence: "Medium confidence",
    lowConfidence: "Low confidence",
    redFlags: "Red Flags Detected",
    whatToDo: "What Should You Do",
    analysisFailed: "Analysis failed",
    howItWorks: "How it works",
    footer: "Helping you stay safe from scams and phishing",
    extractedText: "Extracted Text (OCR)",
    extractedUrl: "Extracted URL (QR)",
    foundInImage: "Found in image",
    verdictHighRisk: "High Risk",
    verdictSuspicious: "Suspicious",
    verdictSafe: "Safe",
    domainDetails: "Domain Details",
    domain: "Domain",
    domainAge: "Domain age",
    days: "days",
    dnsResolves: "Resolves",
    dnsNotResolves: "Does NOT resolve",
    urlType: "URL type",
    shortener: "URL shortener",
    typosquat: "Typosquat",
    heroHeadline: "See Beyond the Scam",
    heroSub: "AI-powered analysis of messages, URLs, and screenshots to detect scams, phishing, and threats.",
    heroCta: "Analyze Now",
    cards: {
      message: { title: "Analyze Message", desc: "Detect threats, blackmail, urgency tactics, and scam patterns in any text." },
      url: { title: "Analyze URL", desc: "Check for phishing, typosquatting, fake domains, and malicious links." },
      screenshot: { title: "Analyze Screenshot", desc: "Extract and analyze text from images, emails, and social media posts." },
      qrcode: { title: "Scan QR Code", desc: "Decode and analyze QR codes to check for hidden malicious links." },
    },
    analyzeAnother: "Analyze Another",
    removeFile: "Remove",
    imagePreview: "Image preview",
    scanSteps: ["Reading content", "Detecting suspicious patterns", "Analyzing risk indicators", "Generating AI safety report"],
    riskLabels: { high: "High Risk", medium: "Medium Risk", low: "Low Risk" },
    tacticInfo: {
      urgency: "Pressure to act immediately without time to think",
      impersonation: "Pretending to be a trusted brand, bank, or government",
      fake_links: "Suspicious, shortened, or misleading URLs",
      requests_money: "Asking for payment, wire transfer, or gift cards",
      requests_otp: "Asking for verification codes or 2FA tokens",
      requests_credentials: "Asking for passwords, PINs, or login details",
      threats: "Threatening consequences like account closure or arrest",
      too_good_to_be_true: "Unrealistic prizes, lottery wins, or refunds",
      emotional_manipulation: "Exploiting fear, greed, sympathy, or love",
      threat_of_harm: "Direct threats of physical violence or death",
      extortion: "Blackmail, ransom, or pay-or-else coercion",
      romance_scam: "Fake romantic interest to extract money or info",
      investment_scam: "Guaranteed returns or get-rich-quick schemes",
      language_signals: "Non-English threatening or suspicious language",
      grammatical_errors: "Unusual spelling or grammar patterns",
    },
    nav: { home: "Home", analyze: "Analyze", history: "History", about: "About" },
    landing: {
      tagline: "Know Before You Trust.",
      subtitle: "AI-powered scam detection for messages, websites, screenshots, and QR codes. Protecting English, Urdu, and Roman Urdu speakers.",
      featAiTitle: "AI-Powered Analysis",
      featAiDesc: "Advanced AI understands context, urgency tactics, and manipulation — not just keywords.",
      featRiskTitle: "Clear Risk Scoring",
      featRiskDesc: "0–100 risk score with color-coded severity, red flags, and plain-language explanations.",
      featLangTitle: "Multi-Language",
      featLangDesc: "Detects scams in English, Urdu, and Roman Urdu — including mixed-language messages.",
      sigTitle: "Link Destination Preview",
      sigBadge: "Signature Feature",
      sigDesc: "Scam links hide behind shorteners and redirect chains. TrustLens follows every hop — showing you the actual final destination before you click. No other scam detector visualizes the full redirect chain.",
      sigCta: "Try it with a link",
    },
    analyzePage: {
      title: "Analyze",
      subtitle: "Paste a message, enter a URL, or upload an image for instant AI analysis.",
      tabs: { message: "Message", website: "Website", screenshot: "Screenshot", qrcode: "QR Code" },
      characters: "characters",
      maxChars: "Max 10,000 characters",
      tryExample: "Try an example:",
      submit: "Analyze with TrustLens",
      submitting: "Analyzing...",
      errText: "Please enter some text to analyze.",
      errUrl: "Please enter a URL to analyze.",
      errImage: "Please upload a screenshot.",
      errQr: "Please upload a QR code image.",
      errGeneric: "Something went wrong. Please try again.",
    },
    resultsPage: {
      riskLevels: { severe: "Severe", high: "High Risk", moderate: "Moderate", low: "Low Risk" },
      verdicts: { scam: "Likely Scam", suspicious: "Suspicious", mild: "Mildly Suspicious", safe: "Likely Safe" },
      detected: "Detected:",
      whyFlagged: "Why TrustLens Flagged This",
      originalContent: "Original Content",
      disclaimer: "This is an AI assessment, not definitive proof. Always verify through official channels.",
      downloadReport: "Download Report",
      noResult: "No analysis result found.",
      linkPreview: {
        title: "Link Destination Preview",
        badge: "Signature Feature",
        loading: "Tracing redirect chain...",
        unverifiedTitle: "Link could not be verified",
        unverifiedDesc: "This link failed to resolve or timed out — treat with extreme caution.",
        original: "Original",
        final: "Final",
        hop: "Hop",
        suspiciousChain: "Suspicious redirect chain detected",
        redirectsSafe: "redirects — destination appears safe",
        noRedirects: "No redirects — direct link",
      },
    },
    historyPage: {
      title: "History",
      subtitle: "Your past analyses",
      clear: "Clear",
      empty: "No analyses yet.",
      start: "Start Analyzing",
      justNow: "Just now",
      minAgo: "m ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
      riskLevels: { severe: "Severe", high: "High", moderate: "Moderate", low: "Low" },
    },
    aboutPage: {
      tagline: "Know Before You Trust.",
      whatTitle: "What TrustLens Does",
      whatP1: "TrustLens AI is a scam detection platform that analyzes messages, websites, screenshots, and QR codes to identify fraud, phishing, and manipulation. It returns a clear risk score with plain-language explanations so you can make informed decisions before trusting suspicious content.",
      whatP2: "The system understands English, Urdu, and Roman Urdu — including mixed-language messages commonly used in South Asian scam campaigns. It detects urgency tactics, impersonation patterns, financial requests, and emotional manipulation across all supported languages.",
      whyTitle: "Why It Matters",
      whyP: "Scams are becoming increasingly sophisticated, targeting vulnerable populations through WhatsApp, SMS, email, and social media. In Pakistan and similar markets, scams frequently use local languages and hidden redirect links — attack vectors that most detection tools miss entirely. TrustLens fills this gap with multi-modal, multi-language analysis and full redirect-chain visualization.",
      capTitle: "Capabilities",
      capAiTitle: "AI Analysis",
      capAiDesc: "Deep context understanding, not just keyword matching",
      capLangTitle: "Multi-Language",
      capLangDesc: "English, Urdu, and Roman Urdu support",
      capLinkTitle: "Link Destination Preview",
      capLinkDesc: "Follow redirect chains to reveal the real destination",
      capMultiTitle: "Multi-Modal",
      capMultiDesc: "Text, URLs, screenshots, and QR codes",
    },
    footerLinks: { about: "About", history: "History", privacy: "Privacy", terms: "Terms" },
    rights: "TrustLens AI. All rights reserved.",
  },
  "roman-urdu": {
    tabs: { text: "Text / Email", url: "URL", screenshot: "Screenshot", qrcode: "QR Code" },
    desc: {
      text: "Neechay mashkook message, email ya SMS paste karein.",
      url: "Wo URL likhein jis ko aap phishing ya scam ke liye check karna chahte hain.",
      screenshot: "Mashkook message ya webpage ka screenshot upload karein.",
      qrcode: "QR code ki tasveer upload karein taake us ka link check ho sake.",
    },
    placeholders: {
      text: "Mashkook message yahan paste karein...",
      url: "https://mashkook-website.com/...",
    },
    analyze: "Check karein",
    analyzing: "Check ho raha hai...",
    analyzingTitle: "Khatre ki nishaniyaan check ho rahi hain\u2026",
    analyzingSub: "Scam, phishing aur dhoka-dehi ki jaanch",
    animTransport: "Data TrustLens ko bheja ja raha hai\u2026",
    animEnRoute: "TrustLens HQ ki taraf\u2026",
    animArrived: "TrustLens HQ pohonch gaye",
    animInvestigating: "Detective case par lag gaya hai\u2026",
    uploadClick: "Upload ke liye click karein",
    uploadOr: "ya drag and drop karein",
    uploadFormats: "PNG, JPG, WebP, ya BMP (zyada se zyada 10 MB)",
    uploadReplace: "Badalne ke liye click ya drop karein",
    analysisComplete: "Jaanch mukammal",
    highConfidence: "Zyada yaqeen",
    mediumConfidence: "Darmiyana yaqeen",
    lowConfidence: "Kam yaqeen",
    redFlags: "Khatre ki nishaniyaan",
    whatToDo: "Ab kya karein",
    analysisFailed: "Jaanch fail ho gayi",
    howItWorks: "Kaise kaam karta hai",
    footer: "Scam aur phishing se mehfooz rahein",
    extractedText: "Tasveer se nikla hua matn (OCR)",
    extractedUrl: "QR se nikla hua URL",
    foundInImage: "Tasveer mein mila",
    verdictHighRisk: "Zyada khatra",
    verdictSuspicious: "Mashkook",
    verdictSafe: "Mehfooz",
    domainDetails: "Domain ki tafseelat",
    domain: "Domain",
    domainAge: "Domain kitni purani hai",
    days: "din",
    dnsResolves: "Resolve hota hai",
    dnsNotResolves: "Resolve nahi hota",
    urlType: "URL ki type",
    shortener: "URL shortener",
    typosquat: "Typosquat",
    heroHeadline: "Scam Ko Pehchanein",
    heroSub: "Messages, URLs aur screenshots ki AI jaanch \u2014 scam, phishing aur khatron ka pata lagayein.",
    heroCta: "Abhi Check Karein",
    cards: {
      message: { title: "Message Check", desc: "Kisi bhi text mein dhamkiyan, blackmail, jaldi ka dabao aur scam ka pata lagayein." },
      url: { title: "URL Check", desc: "Phishing, typosquatting, fake domains aur khatarnaak links ki jaanch karein." },
      screenshot: { title: "Screenshot Check", desc: "Tasveeron, emails aur social media posts se text nikaal kar check karein." },
      qrcode: { title: "QR Code Scan", desc: "QR codes decode kar ke chupay huye khatarnaak links ka pata lagayein." },
    },
    analyzeAnother: "Dobara check karein",
    removeFile: "Hata dein",
    imagePreview: "Tasveer ka preview",
    scanSteps: ["Matn parha ja raha hai", "Mashkook patterns ki jaanch", "Khatre ki nishaniyaan check ho rahi hain", "AI report tayyar ho rahi hai"],
    riskLabels: { high: "Zyada Khatra", medium: "Darmiyana Khatra", low: "Kam Khatra" },
    tacticInfo: {
      urgency: "Fori kaam karne ka dabao, sochne ka waqt nahi diya ja raha",
      impersonation: "Kisi mashhoor brand, bank ya sarkari idaray ka naam le kar dhoka",
      fake_links: "Mashkook, shortened ya gumrah-kun URLs",
      requests_money: "Paisay, wire transfer ya gift cards maange ja rahe hain",
      requests_otp: "Verification code ya 2FA code maanga ja raha hai",
      requests_credentials: "Password, PIN ya login details maangi ja rahi hain",
      threats: "Account band, qanooni karwai ya giraftari ki dhamki",
      too_good_to_be_true: "Bada inaam, lottery ya refund ka jhooota waada",
      emotional_manipulation: "Darr, lalach, humdardi ya mohabbat ka faida uthaya ja raha hai",
      threat_of_harm: "Jismani nuqsan ya jaan se maarne ki seedhi dhamki",
      extortion: "Blackmail, ransom ya paise do warna dhamki",
      romance_scam: "Jhooti mohabbat ka izhaar kar ke paisay ya maloomaat lena",
      investment_scam: "Munafa ki guaranteed promise ya jaldi ameer banane ki scheme",
      language_signals: "Ghair-Angrezi mein dhamki ya mashkook zaban",
      grammatical_errors: "Ajeeb spelling ya grammar ki ghaltiyan",
    },
    nav: { home: "Home", analyze: "Jaanch", history: "History", about: "About" },
    landing: {
      tagline: "Bharosa karne se pehle jaanch lein.",
      subtitle: "Messages, websites, screenshots aur QR codes ki AI scam detection — English, Urdu aur Roman Urdu bolne walon ki hifazat ke liye.",
      featAiTitle: "AI se Jaanch",
      featAiDesc: "AI context, jaldi ka dabao aur dhoka-dehi samajhta hai — sirf keywords nahi.",
      featRiskTitle: "Saaf Risk Score",
      featRiskDesc: "0–100 risk score, rangon se khatre ki level, red flags aur aasan zaban mein wajah ke saath.",
      featLangTitle: "Multi-Language",
      featLangDesc: "English, Urdu aur Roman Urdu mein scam pakarta hai — mixed messages bhi.",
      sigTitle: "Link Destination Preview",
      sigBadge: "Khaas Feature",
      sigDesc: "Scam links shorteners aur redirect chains ke peeche chhupe hote hain. TrustLens har hop ka pata lagata hai aur click karne se pehle asli destination dikha deta hai. Koi aur scam detector poora redirect chain nahi dikhata.",
      sigCta: "Link ke saath try karein",
    },
    analyzePage: {
      title: "Jaanch",
      subtitle: "Message paste karein, URL likhein ya tasveer upload karein — fori AI analysis ke liye.",
      tabs: { message: "Message", website: "Website", screenshot: "Screenshot", qrcode: "QR Code" },
      characters: "characters",
      maxChars: "Zyada se zyada 10,000 characters",
      tryExample: "Example try karein:",
      submit: "TrustLens se jaanch karein",
      submitting: "Jaanch ho rahi hai...",
      errText: "Jaanch ke liye kuch text likhein.",
      errUrl: "Jaanch ke liye URL likhein.",
      errImage: "Screenshot upload karein.",
      errQr: "QR code ki tasveer upload karein.",
      errGeneric: "Kuch ghalat ho gaya. Dobara koshish karein.",
    },
    resultsPage: {
      riskLevels: { severe: "Bohat Zyada Khatra", high: "Zyada Khatra", moderate: "Darmiyana", low: "Kam Khatra" },
      verdicts: { scam: "Yeh Scam Lagta Hai", suspicious: "Mashkook", mild: "Halka Mashkook", safe: "Mehfooz Lagta Hai" },
      detected: "Zaban:",
      whyFlagged: "TrustLens ne yeh kyun flag kiya",
      originalContent: "Asal Content",
      disclaimer: "Yeh AI ka andaza hai, pakka saboot nahi. Hamesha official zariye se tasdeeq karein.",
      downloadReport: "Report Download Karein",
      noResult: "Koi result nahi mila.",
      linkPreview: {
        title: "Link Destination Preview",
        badge: "Khaas Feature",
        loading: "Redirect chain check ho rahi hai...",
        unverifiedTitle: "Link verify nahi ho saka",
        unverifiedDesc: "Yeh link resolve nahi hua ya timeout ho gaya — bohat ehtiyat karein.",
        original: "Original",
        final: "Final",
        hop: "Hop",
        suspiciousChain: "Mashkook redirect chain mili",
        redirectsSafe: "redirects — destination mehfooz lagta hai",
        noRedirects: "Koi redirect nahi — seedha link",
      },
    },
    historyPage: {
      title: "History",
      subtitle: "Aapki pichli jaanchein",
      clear: "Clear karein",
      empty: "Abhi koi jaanch nahi hui.",
      start: "Jaanch Shuru Karein",
      justNow: "Abhi",
      minAgo: "m pehle",
      hoursAgo: "h pehle",
      daysAgo: "d pehle",
      riskLevels: { severe: "Bohat Zyada", high: "Zyada", moderate: "Darmiyana", low: "Kam" },
    },
    aboutPage: {
      tagline: "Bharosa karne se pehle jaanch lein.",
      whatTitle: "TrustLens Kya Karta Hai",
      whatP1: "TrustLens AI ek scam detection platform hai jo messages, websites, screenshots aur QR codes jaanch kar fraud, phishing aur manipulation pakarta hai. Yeh saaf risk score aur aasan zaban mein wajah deta hai taake aap kisi content par bharosa karne se pehle soch samajh kar faisla kar sakein.",
      whatP2: "Yeh system English, Urdu aur Roman Urdu samajhta hai — South Asian scam campaigns mein aam mixed-language messages bhi. Jaldi ka dabao, jaali shanakht, paison ki maang aur jazbaati manipulation — har zaban mein pakarta hai.",
      whyTitle: "Yeh Kyun Zaroori Hai",
      whyP: "Scams din-b-din hoshiyar ho rahi hain — WhatsApp, SMS, email aur social media par kamzor logon ko nishana bana rahi hain. Pakistan jaise markets mein scams aksar local zabanon aur chhupe hue redirect links ka istemal karti hain — aise hamle jo aksar detection tools miss kar dete hain. TrustLens multi-modal, multi-language analysis aur poora redirect-chain visualization ke saath yeh khaali jagah puri karta hai.",
      capTitle: "Khaas Baatein",
      capAiTitle: "AI Analysis",
      capAiDesc: "Sirf keywords nahi — poora context samajhna",
      capLangTitle: "Multi-Language",
      capLangDesc: "English, Urdu aur Roman Urdu support",
      capLinkTitle: "Link Destination Preview",
      capLinkDesc: "Redirect chain ka pata laga kar asli destination dikhana",
      capMultiTitle: "Multi-Modal",
      capMultiDesc: "Text, URLs, screenshots aur QR codes",
    },
    footerLinks: { about: "About", history: "History", privacy: "Privacy", terms: "Terms" },
    rights: "TrustLens AI. Tamam huqooq mahfooz hain.",
  },
  urdu: {
    tabs: { text: "\u0645\u062A\u0646 / \u0627\u06CC \u0645\u06CC\u0644", url: "URL", screenshot: "\u0627\u0633\u06A9\u0631\u06CC\u0646 \u0634\u0627\u0679", qrcode: "QR \u06A9\u0648\u0688" },
    desc: {
      text: "\u0646\u06CC\u0686\u06D2 \u0645\u0634\u062A\u0628\u06C1 \u067E\u06CC\u063A\u0627\u0645\u060C \u0627\u06CC \u0645\u06CC\u0644 \u06CC\u0627 SMS \u067E\u06CC\u0633\u062A \u06A9\u0631\u06CC\u06BA\u06D4",
      url: "\u0648\u06C1 URL \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA \u062C\u0633\u06D2 \u0622\u067E \u0641\u0634\u0646\u06AF \u06CC\u0627 \u0627\u0633\u06A9\u06CC\u0645 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0686\u06CC\u06A9 \u06A9\u0631\u0646\u0627 \u0686\u0627\u06C1\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4",
      screenshot: "\u0645\u0634\u062A\u0628\u06C1 \u067E\u06CC\u063A\u0627\u0645 \u06CC\u0627 \u0648\u06CC\u0628 \u067E\u06CC\u062C \u06A9\u0627 \u0627\u0633\u06A9\u0631\u06CC\u0646 \u0634\u0627\u0679 \u0627\u067E \u0644\u0648\u0688 \u06A9\u0631\u06CC\u06BA\u06D4",
      qrcode: "QR \u06A9\u0648\u0688 \u06A9\u06CC \u062A\u0635\u0648\u06CC\u0631 \u0627\u067E \u0644\u0648\u0688 \u06A9\u0631\u06CC\u06BA \u062A\u0627\u06A9\u06C1 \u0627\u0633 \u06A9\u0627 \u0644\u0646\u06A9 \u0686\u06CC\u06A9 \u06C1\u0648 \u0633\u06A9\u06D2\u06D4",
    },
    placeholders: {
      text: "\u0645\u0634\u062A\u0628\u06C1 \u067E\u06CC\u063A\u0627\u0645 \u06CC\u06C1\u0627\u06BA \u067E\u06CC\u0633\u062A \u06A9\u0631\u06CC\u06BA...",
      url: "https://mashkook-website.com/...",
    },
    analyze: "\u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA",
    analyzing: "\u0686\u06CC\u06A9 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
    analyzingTitle: "\u062E\u0637\u0631\u06D2 \u06A9\u06CC \u0646\u0634\u0627\u0646\u06CC\u0648\u06BA \u06A9\u06CC \u062C\u0627\u0646\u0686\u2026",
    analyzingSub: "\u0627\u0633\u06A9\u06CC\u0645\u060C \u0641\u0634\u0646\u06AF \u0627\u0648\u0631 \u062F\u06BE\u0648\u06A9\u0627 \u062F\u06C1\u06CC \u06A9\u06CC \u062C\u0627\u0646\u0686",
    animTransport: "\u0688\u06CC\u0679\u0627 \u0679\u0631\u0633\u0679 \u0644\u06CC\u0646\u0632 \u06A9\u0648 \u0628\u06C1\u06CC\u062C\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2\u2026",
    animEnRoute: "\u0679\u0631\u0633\u0679 \u0644\u06CC\u0646\u0632 \u06C1\u06CC\u0688\u06A9\u0648\u0627\u0631\u0679\u0631 \u06A9\u06CC \u0637\u0631\u0641\u2026",
    animArrived: "\u0679\u0631\u0633\u0679 \u0644\u06CC\u0646\u0632 \u06C1\u06CC\u0688\u06A9\u0648\u0627\u0631\u0679\u0631 \u067E\u06C1\u0646\u0686\u0686 \u06AF\u0626\u06D2",
    animInvestigating: "\u0688\u06CC\u0679\u06CC\u06A9\u0679\u0648 \u06A9\u06CC\u0633 \u067E\u0631 \u0644\u06AF \u06AF\u06CC\u0627 \u06C1\u06D2\u2026",
    uploadClick: "\u0627\u067E \u0644\u0648\u0688 \u06A9\u06D2 \u0644\u06CC\u06D2 \u06A9\u0644\u06A9 \u06A9\u0631\u06CC\u06BA",
    uploadOr: "\u06CC\u0627 drag and drop \u06A9\u0631\u06CC\u06BA",
    uploadFormats: "PNG\u060C JPG\u060C WebP\u060C \u06CC\u0627 BMP (\u0632\u06CC\u0627\u062F\u06C1 \u0633\u06D2 \u0632\u06CC\u0627\u062F\u06C1 10 MB)",
    uploadReplace: "\u0628\u062F\u0644\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u06A9\u0644\u06A9 \u06CC\u0627 \u0688\u0631\u0627\u067E \u06A9\u0631\u06CC\u06BA",
    analysisComplete: "\u062C\u0627\u0646\u0686 \u0645\u06A9\u0645\u0644",
    highConfidence: "\u0632\u06CC\u0627\u062F\u06C1 \u06CC\u0642\u06CC\u0646",
    mediumConfidence: "\u062F\u0631\u0645\u06CC\u0627\u0646\u06C1 \u06CC\u0642\u06CC\u0646",
    lowConfidence: "\u06A9\u0645 \u06CC\u0642\u06CC\u0646",
    redFlags: "\u062E\u0637\u0631\u06D2 \u06A9\u06CC \u0646\u0634\u0627\u0646\u06CC\u0627\u06BA",
    whatToDo: "\u0627\u0628 \u06A9\u06CC\u0627 \u06A9\u0631\u06CC\u06BA",
    analysisFailed: "\u062C\u0627\u0646\u0686 \u0646\u0627\u06A9\u0627\u0645 \u06C1\u0648 \u06AF\u0626\u06CC",
    howItWorks: "\u06A9\u06CC\u0633\u06D2 \u06A9\u0627\u0645 \u06A9\u0631\u062A\u0627 \u06C1\u06D2",
    footer: "\u0627\u0633\u06A9\u06CC\u0645 \u0627\u0648\u0631 \u0641\u0634\u0646\u06AF \u0633\u06D2 \u0645\u062D\u0641\u0648\u0638 \u0631\u06C1\u06CC\u06BA",
    extractedText: "\u062A\u0635\u0648\u06CC\u0631 \u0633\u06D2 \u0646\u06A9\u0644\u0627 \u06C1\u0648\u0627 \u0645\u062A\u0646 (OCR)",
    extractedUrl: "QR \u0633\u06D2 \u0646\u06A9\u0644\u0627 \u06C1\u0648\u0627 URL",
    foundInImage: "\u062A\u0635\u0648\u06CC\u0631 \u0645\u06CC\u06BA \u0645\u0644\u0627",
    verdictHighRisk: "\u0632\u06CC\u0627\u062F\u06C1 \u062E\u0637\u0631\u06C1",
    verdictSuspicious: "\u0645\u0634\u062A\u0628\u06C1",
    verdictSafe: "\u0645\u062D\u0641\u0648\u0638",
    domainDetails: "\u0688\u0648\u0645\u06CC\u0646 \u06A9\u06CC \u062A\u0641\u0635\u06CC\u0644\u0627\u062A",
    domain: "\u0688\u0648\u0645\u06CC\u0646",
    domainAge: "\u0688\u0648\u0645\u06CC\u0646 \u06A9\u062A\u0646\u0627 \u067E\u0631\u0627\u0646\u0627 \u06C1\u06D2",
    days: "\u062F\u0646",
    dnsResolves: "\u0631\u0633\u0627\u0648\u0644 \u06C1\u0648\u062A\u0627 \u06C1\u06D2",
    dnsNotResolves: "\u0631\u0633\u0627\u0648\u0644 \u0646\u06C1\u06CC\u06BA \u06C1\u0648\u062A\u0627",
    urlType: "URL \u06A9\u06CC \u0642\u0633\u0645",
    shortener: "URL \u0634\u0627\u0631\u0679\u0646\u0631",
    typosquat: "\u0679\u0627\u0626\u067E\u0648\u0627\u0633\u06A9\u0648\u0627\u0679",
    heroHeadline: "\u0627\u0633\u06A9\u06CC\u0645 \u06A9\u0648 \u067E\u06C1\u0686\u0627\u0646\u06CC\u06BA",
    heroSub: "\u067E\u06CC\u063A\u0627\u0645\u0627\u062A\u060C URLs \u0627\u0648\u0631 \u0627\u0633\u06A9\u0631\u06CC\u0646 \u0634\u0627\u0679\u0633 \u06A9\u06CC AI \u062C\u0627\u0646\u0686 \u2014 \u062F\u06BE\u0648\u06A9\u0627 \u062F\u06C1\u06CC\u060C \u0641\u0634\u0646\u06AF \u0627\u0648\u0631 \u062E\u0637\u0631\u0627\u062A \u06A9\u0627 \u067E\u062A\u0627 \u0644\u06AF\u0627\u0626\u06CC\u06BA\u06D4",
    heroCta: "\u0627\u0628\u06BE\u06CC \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA",
    cards: {
      message: { title: "\u067E\u06CC\u063A\u0627\u0645 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA", desc: "\u06A9\u0633\u06CC \u0628\u06BE\u06CC \u0645\u062A\u0646 \u0645\u06CC\u06BA \u062F\u06BE\u0645\u06A9\u06CC\u0627\u06BA\u060C \u0628\u0644\u06CC\u06A9 \u0645\u06CC\u0644\u060C \u062C\u0644\u062F\u06CC \u06A9\u0627 \u062F\u0628\u0627\u0624 \u0627\u0648\u0631 \u0627\u0633\u06A9\u06CC\u0645 \u06A9\u0627 \u067E\u062A\u0627 \u0644\u06AF\u0627\u0626\u06CC\u06BA\u06D4" },
      url: { title: "URL \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA", desc: "\u0641\u0634\u0646\u06AF\u060C \u0679\u0627\u0626\u067E\u0648\u0627\u0633\u06A9\u0648\u0627\u0679\u0646\u06AF\u060C \u062C\u0639\u0644\u06CC \u0688\u0648\u0645\u06CC\u0646\u0632 \u0627\u0648\u0631 \u062E\u0637\u0631\u0646\u0627\u06A9 \u0644\u0646\u06A9\u0633 \u06A9\u06CC \u062C\u0627\u0646\u0686 \u06A9\u0631\u06CC\u06BA\u06D4" },
      screenshot: { title: "\u0627\u0633\u06A9\u0631\u06CC\u0646 \u0634\u0627\u0679 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA", desc: "\u062A\u0635\u0648\u06CC\u0631\u0648\u06BA\u060C \u0627\u06CC\u0645\u06CC\u0644\u0632 \u0627\u0648\u0631 \u0633\u0648\u0634\u0644 \u0645\u06CC\u0688\u06CC\u0627 \u067E\u0648\u0633\u0679\u0633 \u0633\u06D2 \u0645\u062A\u0646 \u0646\u06A9\u0627\u0644 \u06A9\u0631 \u06A9\u06D2 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA\u06D4" },
      qrcode: { title: "QR \u06A9\u0648\u0688 \u0627\u0633\u06A9\u06CC\u0646", desc: "QR \u06A9\u0648\u0688\u0632 \u0688\u06CC \u06A9\u0648\u0688 \u06A9\u0631 \u06A9\u06D2 \u0686\u06BE\u067E\u06D2 \u06C1\u0648\u0626\u06D2 \u062E\u0637\u0631\u0646\u0627\u06A9 \u0644\u0646\u06A9\u0633 \u06A9\u0627 \u067E\u062A\u0627 \u0644\u06AF\u0627\u0626\u06CC\u06BA\u06D4" },
    },
    analyzeAnother: "\u062F\u0648\u0628\u0627\u0631\u06C1 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA",
    removeFile: "\u06C1\u0679\u0627 \u062F\u06CC\u06BA",
    imagePreview: "\u062A\u0635\u0648\u06CC\u0631 \u06A9\u0627 \u067E\u0631\u06CC\u0648\u06CC\u0648",
    scanSteps: ["\u0645\u062A\u0646 \u067E\u0691\u06BE\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2", "\u0645\u0634\u062A\u0628\u06C1 \u067E\u06CC\u0679\u0631\u0646\u0632 \u06A9\u06CC \u062C\u0627\u0646\u0686", "\u062E\u0637\u0631\u06D2 \u06A9\u06CC \u0646\u0634\u0627\u0646\u06CC\u0648\u06BA \u06A9\u06CC \u062C\u0627\u0646\u0686", "AI \u0631\u06CC\u067E\u0648\u0631\u0679 \u062A\u06CC\u0627\u0631 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06D2"],
    riskLabels: { high: "\u0632\u06CC\u0627\u062F\u06C1 \u062E\u0637\u0631\u06C1", medium: "\u062F\u0631\u0645\u06CC\u0627\u0646\u06C1 \u062E\u0637\u0631\u06C1", low: "\u06A9\u0645 \u062E\u0637\u0631\u06C1" },
    tacticInfo: {
      urgency: "\u0641\u0648\u0631\u06CC \u06A9\u0627\u0645 \u06A9\u0631\u0646\u06D2 \u06A9\u0627 \u062F\u0628\u0627\u0624\u060C \u0633\u0648\u0686\u0646\u06D2 \u06A9\u0627 \u0648\u0642\u062A \u0646\u06C1\u06CC\u06BA \u062F\u06CC\u0627 \u062C\u0627 \u0631\u06C1\u0627",
      impersonation: "\u06A9\u0633\u06CC \u0645\u0634\u06C1\u0648\u0631 \u0628\u0631\u0627\u0646\u0688\u060C \u0628\u06CC\u0646\u06A9 \u06CC\u0627 \u0633\u0631\u06A9\u0627\u0631\u06CC \u0627\u062F\u0627\u0631\u06D2 \u06A9\u0627 \u0646\u0627\u0645 \u0644\u06D2 \u06A9\u0631 \u062F\u06BE\u0648\u06A9\u0627",
      fake_links: "\u0645\u0634\u062A\u0628\u06C1\u060C \u0634\u0627\u0631\u0679\u0646\u0688 \u06CC\u0627 \u06AF\u0645\u0631\u0627\u06C1 \u06A9\u0646 URLs",
      requests_money: "\u067E\u06CC\u0633\u06D2\u060C \u0648\u0627\u0626\u0631 \u0679\u0631\u0627\u0646\u0633\u0641\u0631 \u06CC\u0627 \u06AF\u0641\u0679 \u06A9\u0627\u0631\u0688\u0632 \u0645\u0627\u0646\u06AF\u06D2 \u062C\u0627 \u0631\u06C1\u06D2 \u06C1\u06CC\u06BA",
      requests_otp: "\u0648\u0631\u06CC\u0641\u06A9\u06CC\u0634\u0646 \u06A9\u0648\u0688 \u06CC\u0627 2FA \u06A9\u0648\u0688 \u0645\u0627\u0646\u06AF\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2",
      requests_credentials: "\u067E\u0627\u0633 \u0648\u0631\u0688\u060C PIN \u06CC\u0627 \u0644\u0627\u06AF \u0627\u0646 \u062A\u0641\u0635\u06CC\u0644\u0627\u062A \u0645\u0627\u0646\u06AF\u06CC \u062C\u0627 \u0631\u06C1\u06CC \u06C1\u06CC\u06BA",
      threats: "\u0627\u06A9\u0627\u0624\u0646\u0679 \u0628\u0646\u062F\u060C \u0642\u0627\u0646\u0648\u0646\u06CC \u06A9\u0627\u0631\u0631\u0648\u0627\u0626\u06CC \u06CC\u0627 \u06AF\u0631\u0641\u062A\u0627\u0631\u06CC \u06A9\u06CC \u062F\u06BE\u0645\u06A9\u06CC",
      too_good_to_be_true: "\u0628\u0691\u0627 \u0627\u0646\u0639\u0627\u0645\u060C \u0644\u0627\u0679\u0631\u06CC \u06CC\u0627 \u0631\u06CC\u0641\u0646\u0688 \u06A9\u0627 \u062C\u06BE\u0648\u0679\u0627 \u0648\u0627\u062F\u06C1",
      emotional_manipulation: "\u0688\u0631\u060C \u0644\u0627\u0644\u0686\u060C \u06C1\u0645\u062F\u0631\u062F\u06CC \u06CC\u0627 \u0645\u062D\u0628\u062A \u06A9\u0627 \u0641\u0627\u0626\u062F\u06C1 \u0627\u0679\u06BE\u0627\u06CC\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2",
      threat_of_harm: "\u062C\u0633\u0645\u0627\u0646\u06CC \u0646\u0642\u0635\u0627\u0646 \u06CC\u0627 \u062C\u0627\u0646 \u0633\u06D2 \u0645\u0627\u0631\u0646\u06D2 \u06A9\u06CC \u0633\u06CC\u062F\u06BE\u06CC \u062F\u06BE\u0645\u06A9\u06CC",
      extortion: "\u0628\u0644\u06CC\u06A9 \u0645\u06CC\u0644\u060C \u062A\u0627\u0648\u0627\u0646 \u06CC\u0627 \u067E\u06CC\u0633\u06D2 \u062F\u0648 \u0648\u0631\u0646\u06C1 \u062F\u06BE\u0645\u06A9\u06CC",
      romance_scam: "\u062C\u06BE\u0648\u0679\u06CC \u0645\u062D\u0628\u062A \u06A9\u0627 \u0627\u0638\u06C1\u0627\u0631 \u06A9\u0631 \u06A9\u06D2 \u067E\u06CC\u0633\u06D2 \u06CC\u0627 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0644\u06CC\u0646\u0627",
      investment_scam: "\u0645\u0646\u0627\u0641\u0639 \u06A9\u06CC \u06AF\u0627\u0631\u0646\u0679\u06CC \u06CC\u0627 \u062C\u0644\u062F\u06CC \u0627\u0645\u06CC\u0631 \u0628\u0646\u0627\u0646\u06D2 \u06A9\u06CC \u0627\u0633\u06A9\u06CC\u0645",
      language_signals: "\u063A\u06CC\u0631 \u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u0645\u06CC\u06BA \u062F\u06BE\u0645\u06A9\u06CC \u06CC\u0627 \u0645\u0634\u062A\u0628\u06C1 \u0632\u0628\u0627\u0646",
      grammatical_errors: "\u0639\u062C\u06CC\u0628 \u0633\u067E\u06CC\u0644\u0646\u06AF \u06CC\u0627 \u06AF\u0631\u0627\u0645\u0631 \u06A9\u06CC \u063A\u0644\u0637\u06CC\u0627\u06BA",
    },
    nav: { home: "ہوم", analyze: "جانچ", history: "ہسٹری", about: "تعارف" },
    landing: {
      tagline: "بھروسہ کرنے سے پہلے جانچ لیں۔",
      subtitle: "پیغامات، ویب سائٹس، اسکرین شاٹس اور QR کوڈز کی AI اسکیم ڈٹیکشن — انگریزی، اردو اور رومن اردو بولنے والوں کی حفاظت کے لیے۔",
      featAiTitle: "AI سے جانچ",
      featAiDesc: "AI سیاق و سباق، فوری دباؤ اور دھوکہ دہی سمجھتا ہے — صرف الفاظ نہیں۔",
      featRiskTitle: "واضح رِسک اسکور",
      featRiskDesc: "0–100 رِسک اسکور، رنگوں سے خطرے کی سطح، ریڈ فلیگز اور آسان زبان میں وضاحت کے ساتھ۔",
      featLangTitle: "کثیر اللسانی",
      featLangDesc: "انگریزی، اردو اور رومن اردو میں اسکیم پکڑتا ہے — مخلوط زبان کے پیغامات بھی۔",
      sigTitle: "لنک کا اصل مقصد",
      sigBadge: "خصوصی فیچر",
      sigDesc: "اسکیم کے لنکس شارٹنرز اور ری ڈائریکٹ چینز کے پیچھے چھپے ہوتے ہیں۔ TrustLens ہر ہاپ کا پتہ لگاتا ہے اور کلک کرنے سے پہلے اصل منزل دکھا دیتا ہے۔ کوئی اور اسکیم ڈٹیکٹر مکمل ری ڈائریکٹ چین نہیں دکھاتا۔",
      sigCta: "لنک کے ساتھ آزمائیں",
    },
    analyzePage: {
      title: "جانچ",
      subtitle: "پیغام پیسٹ کریں، URL درج کریں یا تصویر اپ لوڈ کریں — فوری AI جانچ کے لیے۔",
      tabs: { message: "پیغام", website: "ویب سائٹ", screenshot: "اسکرین شاٹ", qrcode: "QR کوڈ" },
      characters: "حروف",
      maxChars: "زیادہ سے زیادہ 10,000 حروف",
      tryExample: "مثال آزمائیں:",
      submit: "TrustLens سے جانچ کریں",
      submitting: "جانچ ہو رہی ہے...",
      errText: "جانچ کے لیے کچھ متن لکھیں۔",
      errUrl: "جانچ کے لیے URL درج کریں۔",
      errImage: "اسکرین شاٹ اپ لوڈ کریں۔",
      errQr: "QR کوڈ کی تصویر اپ لوڈ کریں۔",
      errGeneric: "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔",
    },
    resultsPage: {
      riskLevels: { severe: "انتہائی خطرہ", high: "زیادہ خطرہ", moderate: "درمیانہ خطرہ", low: "کم خطرہ" },
      verdicts: { scam: "قوی امکان اسکیم ہے", suspicious: "مشتبہ", mild: "ہلکا مشتبہ", safe: "محفوظ لگتا ہے" },
      detected: "زبان:",
      whyFlagged: "TrustLens نے یہ کیوں فلیگ کیا",
      originalContent: "اصل مواد",
      disclaimer: "یہ AI کا اندازہ ہے، حتمی ثبوت نہیں۔ ہمیشہ سرکاری ذرائع سے تصدیق کریں۔",
      downloadReport: "رپورٹ ڈاؤن لوڈ کریں",
      noResult: "کوئی نتیجہ نہیں ملا۔",
      linkPreview: {
        title: "لنک کا اصل مقصد",
        badge: "خصوصی فیچر",
        loading: "ری ڈائریکٹ چین کی جانچ ہو رہی ہے...",
        unverifiedTitle: "لنک کی تصدیق نہیں ہو سکی",
        unverifiedDesc: "یہ لنک ریزولو نہیں ہوا یا ٹائم آؤٹ ہو گیا — انتہائی احتیاط کریں۔",
        original: "اصل",
        final: "آخری",
        hop: "ہاپ",
        suspiciousChain: "مشتبہ ری ڈائریکٹ چین ملی",
        redirectsSafe: "ری ڈائریکٹس — منزل محفوظ لگتی ہے",
        noRedirects: "کوئی ری ڈائریکٹ نہیں — سیدھا لنک",
      },
    },
    historyPage: {
      title: "ہسٹری",
      subtitle: "آپ کی پچھلی جانچیں",
      clear: "صاف کریں",
      empty: "ابھی کوئی جانچ نہیں ہوئی۔",
      start: "جانچ شروع کریں",
      justNow: "ابھی",
      minAgo: "منٹ پہلے",
      hoursAgo: "گھنٹے پہلے",
      daysAgo: "دن پہلے",
      riskLevels: { severe: "انتہائی", high: "زیادہ", moderate: "درمیانہ", low: "کم" },
    },
    aboutPage: {
      tagline: "بھروسہ کرنے سے پہلے جانچ لیں۔",
      whatTitle: "TrustLens کیا کرتا ہے",
      whatP1: "TrustLens AI ایک اسکیم ڈٹیکشن پلیٹ فارم ہے جو پیغامات، ویب سائٹس، اسکرین شاٹس اور QR کوڈز کی جانچ کر کے فراڈ، فشنگ اور مینپیولیشن پکڑتا ہے۔ یہ واضح رِسک اسکور اور آسان زبان میں وضاحت دیتا ہے تاکہ آپ کسی بھی مواد پر بھروسہ کرنے سے پہلے سوچ سمجھ کر فیصلہ کر سکیں۔",
      whatP2: "یہ نظام انگریزی، اردو اور رومن اردو سمجھتا ہے — جنوبی ایشیائی اسکیم مہموں میں عام مخلوط زبان کے پیغامات بھی۔ یہ فوری دباؤ، جعلی شناخت، پیسوں کی مانگ اور جذباتی مینپیولیشن — ہر زبان میں پکڑتا ہے۔",
      whyTitle: "یہ کیوں ضروری ہے",
      whyP: "اسکیمز روز بروز زیادہ ہوشیار ہو رہی ہیں اور WhatsApp، SMS، ای میل اور سوشل میڈیا کے ذریعے کمزور طبقات کو نشانہ بناتی ہیں۔ پاکستان جیسے بازاروں میں اسکیمز اکثر مقامی زبانوں اور چھپے ہوئے ری ڈائریکٹ لنکس کا استعمال کرتی ہیں — ایسے حملے جو عام ڈٹیکشن ٹولز اکثر miss کر دیتے ہیں۔ TrustLens کثیر الاقسام اور کثیر اللسانی جانچ اور مکمل ری ڈائریکٹ چین کے بصری اظہار کے ساتھ یہ خلا پر کرتا ہے۔",
      capTitle: "خصوصیات",
      capAiTitle: "AI جانچ",
      capAiDesc: "صرف الفاظ نہیں — مکمل سیاق و سباق کی سمجھ",
      capLangTitle: "کثیر اللسانی",
      capLangDesc: "انگریزی، اردو اور رومن اردو کی سپورٹ",
      capLinkTitle: "لنک کا اصل مقصد",
      capLinkDesc: "ری ڈائریکٹ چین کا پتہ لگا کر اصل منزل دکھانا",
      capMultiTitle: "کثیر الاقسام",
      capMultiDesc: "متن، URL، اسکرین شاٹس اور QR کوڈز",
    },
    footerLinks: { about: "تعارف", history: "ہسٹری", privacy: "پرائیویسی", terms: "شرائط" },
    rights: "TrustLens AI۔ جملہ حقوق محفوظ ہیں۔",
  },
};

export function getStrings(lang: string): Strings {
  return STRINGS[lang] || STRINGS.en;
}
