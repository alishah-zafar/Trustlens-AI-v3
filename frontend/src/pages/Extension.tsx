import { useState } from "react";
import { Download, Puzzle, Copy, Check, Globe, Link2, FileText, Image as ImageIcon, QrCode, MousePointerClick } from "lucide-react";
import { useLang } from "../LangContext";

const ZIP_URL = "/trustlens-extension.zip";

interface ExtStrings {
  title: string;
  subtitle: string;
  download: string;
  meta: string;
  featuresTitle: string;
  features: { page: string; text: string; link: string; shot: string; qr: string; menu: string };
  installTitle: string;
  installNote: string;
  steps: string[];
  copy: string;
  copied: string;
  tipTitle: string;
  tips: string[];
  soon: string;
}

const STRINGS: Record<string, ExtStrings> = {
  en: {
    title: "TrustLens Chrome Extension",
    subtitle: "Check any page, message, link, screenshot or QR code for scams without leaving your browser.",
    download: "Download Extension",
    meta: "Prototype v1.0 · Works in Chrome, Edge and Brave · Free",
    featuresTitle: "What it does",
    features: {
      page: "Scan the page you are on",
      text: "Analyze pasted messages and emails",
      link: "Check links and trace their redirects",
      shot: "Read and analyze screenshots",
      qr: "Decode and check QR codes",
      menu: "Right-click any selected text or link to check it",
    },
    installTitle: "How to install (takes 1 minute)",
    installNote: "The extension is a prototype and is not on the Chrome Web Store yet, so you install it manually:",
    steps: [
      "Click Download Extension above, then unzip the file (right-click → Extract All).",
      "Open a new tab and go to chrome://extensions (Edge users: edge://extensions).",
      "Turn on Developer mode using the switch in the top-right corner.",
      "Click Load unpacked.",
      "Select the extracted \"extension\" folder (the one that contains manifest.json).",
      "Click the puzzle icon in the toolbar and pin TrustLens AI. You are ready to scan.",
    ],
    copy: "Copy",
    copied: "Copied",
    tipTitle: "Good to know",
    tips: [
      "Keep the extracted folder on your computer. If you delete it, Chrome removes the extension.",
      "If you see \"Manifest file is missing\", you picked the wrong folder. Choose the folder that directly contains manifest.json.",
      "The first scan can take a few seconds while the server wakes up.",
      "Results are AI assessments, not proof. Always verify through official channels.",
    ],
    soon: "Chrome Web Store release coming soon.",
  },
  "roman-urdu": {
    title: "TrustLens Chrome Extension",
    subtitle: "Browser chhor ke gaye baghair kisi bhi page, message, link, screenshot ya QR code ko scam ke liye check karein.",
    download: "Extension Download Karein",
    meta: "Prototype v1.0 · Chrome, Edge aur Brave mein chalta hai · Muft",
    featuresTitle: "Yeh kya karta hai",
    features: {
      page: "Jis page par hain usay scan karein",
      text: "Paste kiye hue messages aur emails ki jaanch",
      link: "Links check karein aur unke redirects dekhein",
      shot: "Screenshots parh kar jaanch karein",
      qr: "QR codes decode kar ke check karein",
      menu: "Kisi bhi select kiye hue text ya link par right-click kar ke check karein",
    },
    installTitle: "Install kaise karein (1 minute)",
    installNote: "Extension abhi prototype hai aur Chrome Web Store par nahi hai, is liye manually install karni hogi:",
    steps: [
      "Upar Extension Download Karein par click karein, phir file ko unzip karein (right-click → Extract All).",
      "Naya tab khol kar chrome://extensions par jayen (Edge: edge://extensions).",
      "Upar right corner ke switch se Developer mode on karein.",
      "Load unpacked par click karein.",
      "Unzip hua \"extension\" folder select karein (jis mein manifest.json ho).",
      "Toolbar ke puzzle icon par click kar ke TrustLens AI ko pin karein. Ab scan kar sakte hain.",
    ],
    copy: "Copy",
    copied: "Copy ho gaya",
    tipTitle: "Zaroori baatein",
    tips: [
      "Unzip kiya hua folder computer par rakhein. Delete karne se Chrome extension hata deta hai.",
      "Agar \"Manifest file is missing\" aaye to ghalat folder select hua hai. Wo folder chunein jis mein seedha manifest.json ho.",
      "Pehla scan kuch seconds le sakta hai jab tak server jaagta hai.",
      "Natayej AI ka andaza hain, saboot nahi. Hamesha official zariye se tasdeeq karein.",
    ],
    soon: "Chrome Web Store par jald aa raha hai.",
  },
  urdu: {
    title: "TrustLens کروم ایکسٹینشن",
    subtitle: "براؤزر چھوڑے بغیر کسی بھی پیج، پیغام، لنک، اسکرین شاٹ یا QR کوڈ کو اسکیم کے لیے چیک کریں۔",
    download: "ایکسٹینشن ڈاؤن لوڈ کریں",
    meta: "پروٹوٹائپ v1.0 · کروم، ایج اور بریو میں چلتا ہے · مفت",
    featuresTitle: "یہ کیا کرتا ہے",
    features: {
      page: "جس پیج پر ہیں اسے اسکین کریں",
      text: "پیسٹ کیے گئے پیغامات اور ای میلز کی جانچ",
      link: "لنکس چیک کریں اور ان کے ری ڈائریکٹس دیکھیں",
      shot: "اسکرین شاٹس پڑھ کر جانچ کریں",
      qr: "QR کوڈ ڈی کوڈ کر کے چیک کریں",
      menu: "کسی بھی منتخب متن یا لنک پر رائٹ کلک کر کے چیک کریں",
    },
    installTitle: "انسٹال کیسے کریں (ایک منٹ)",
    installNote: "ایکسٹینشن ابھی پروٹوٹائپ ہے اور کروم ویب اسٹور پر نہیں ہے، اس لیے دستی انسٹال کرنی ہوگی:",
    steps: [
      "اوپر ایکسٹینشن ڈاؤن لوڈ کریں پر کلک کریں، پھر فائل ان زپ کریں (رائٹ کلک → Extract All)۔",
      "نیا ٹیب کھول کر chrome://extensions پر جائیں (ایج: edge://extensions)۔",
      "اوپر دائیں کونے کے سوئچ سے Developer mode آن کریں۔",
      "Load unpacked پر کلک کریں۔",
      "ان زپ شدہ \"extension\" فولڈر منتخب کریں (جس میں manifest.json ہو)۔",
      "ٹول بار کے پزل آئیکن سے TrustLens AI کو پن کریں۔ اب آپ اسکین کر سکتے ہیں۔",
    ],
    copy: "کاپی",
    copied: "کاپی ہو گیا",
    tipTitle: "ضروری باتیں",
    tips: [
      "ان زپ کیا ہوا فولڈر کمپیوٹر پر رکھیں۔ حذف کرنے سے کروم ایکسٹینشن ہٹا دیتا ہے۔",
      "اگر \"Manifest file is missing\" آئے تو غلط فولڈر منتخب ہوا ہے۔ وہ فولڈر چنیں جس میں براہ راست manifest.json ہو۔",
      "پہلا اسکین چند سیکنڈ لے سکتا ہے جب تک سرور جاگتا ہے۔",
      "نتائج AI کا اندازہ ہیں، ثبوت نہیں۔ ہمیشہ سرکاری ذرائع سے تصدیق کریں۔",
    ],
    soon: "کروم ویب اسٹور پر جلد آ رہا ہے۔",
  },
};

function CopyChip({ text, copy, copied }: { text: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <span className="inline-flex items-center gap-2 align-middle" dir="ltr">
      <code className="px-2 py-0.5 rounded bg-black/50 border border-line text-accent-light text-xs">{text}</code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(text).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          });
        }}
        className="inline-flex items-center gap-1 text-xs text-txt-muted hover:text-white transition-colors"
      >
        {done ? <Check className="w-3.5 h-3.5 text-safe" /> : <Copy className="w-3.5 h-3.5" />}
        {done ? copied : copy}
      </button>
    </span>
  );
}

/** Render step text, turning chrome://extensions into a copyable chip */
function StepText({ text, copy, copied }: { text: string; copy: string; copied: string }) {
  const parts = text.split(/(chrome:\/\/extensions)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "chrome://extensions" ? <CopyChip key={i} text={p} copy={copy} copied={copied} /> : <span key={i}>{p}</span>
      )}
    </>
  );
}

export default function Extension() {
  const { lang } = useLang();
  const s = STRINGS[lang] || STRINGS.en;
  const features = [
    { icon: Globe, text: s.features.page },
    { icon: FileText, text: s.features.text },
    { icon: Link2, text: s.features.link },
    { icon: ImageIcon, text: s.features.shot },
    { icon: QrCode, text: s.features.qr },
    { icon: MousePointerClick, text: s.features.menu },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
            <Puzzle className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{s.title}</h1>
        <p className="text-base text-txt-muted max-w-2xl mx-auto mb-6">{s.subtitle}</p>
        <a
          href={ZIP_URL}
          download="trustlens-extension.zip"
          className="inline-flex items-center gap-2 bg-accent text-white text-base font-semibold px-6 py-3 rounded-md hover:bg-accent-light transition-all shadow-lg shadow-accent/30"
        >
          <Download className="w-5 h-5" />
          {s.download}
        </a>
        <p className="text-xs text-txt-dim mt-3">{s.meta}</p>
      </div>

      {/* Features */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">{s.featuresTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-4 theme-card">
              <f.icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-txt-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install steps */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-2">{s.installTitle}</h2>
        <p className="text-sm text-txt-muted mb-4">{s.installNote}</p>
        <ol className="space-y-3">
          {s.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 p-4 theme-card">
              <span className="w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-txt-muted leading-relaxed pt-0.5">
                <StepText text={step} copy={s.copy} copied={s.copied} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips */}
      <section className="theme-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">{s.tipTitle}</h2>
        <ul className="list-disc ps-5 space-y-2 text-sm text-txt-muted">
          {s.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm text-txt-dim">{s.soon}</p>
    </div>
  );
}
