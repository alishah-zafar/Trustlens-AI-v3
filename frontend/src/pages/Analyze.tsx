import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../LangContext";
import { useHistory } from "../store";
import { analyzeText, analyzeUrl, analyzeScreenshot, analyzeQrCode } from "../api";
import { MessageSquare, Globe, Image, QrCode, ArrowRight } from "lucide-react";

const TABS = [
  { id: "text", labelKey: "message", icon: MessageSquare },
  { id: "url", labelKey: "website", icon: Globe },
  { id: "screenshot", labelKey: "screenshot", icon: Image },
  { id: "qrcode", labelKey: "qrcode", icon: QrCode },
] as const;

const EXAMPLES = [
  { label: { en: "Prize Scam (Roman Urdu)", ru: "Inaam Scam (Roman Urdu)", ur: "انعام اسکیم (رومن اردو)" }, text: "Mubarak ho! Apne Rs 50,000 ka inaam jeeta hai. Claim karne ke liye is link par click karein aur Rs 500 processing fee bhejein: http://prize-claim-pk.com/claim" },
  { label: { en: "Bank Scam (English)", ru: "Bank Scam (English)", ur: "بینک اسکیم (انگریزی)" }, text: "URGENT: Your bank account will be blocked today. Verify immediately by clicking this link: http://secure-bank-verify.xyz/login" },
  { label: { en: "Urdu Scam (اردو)", ru: "Urdu Scam (اردو)", ur: "اردو اسکیم (اردو)" }, text: "آپ کا اکاؤنٹ آج بلاک ہو جائے گا۔ فوری تصدیق کے لیے اس لنک پر کلک کریں اور اپنا پاس ورڈ درج کریں: http://bank-verify-pk.xyz/login" },
  { label: { en: "Delivery Scam (Roman Urdu)", ru: "Parcel Scam (Roman Urdu)", ur: "پارسل اسکیم (رومن اردو)" }, text: "Apka parcel customs mein hold hai. Rs 350 delivery fee pay kar ke release confirm karein. Link: http://pk-delivery-pay.com/confirm" },
  { label: { en: "Job Scam (English)", ru: "Job Scam (English)", ur: "جاب اسکیم (انگریزی)" }, text: "Congratulations! You have been selected for an international scholarship. Pay a processing fee of $250 to confirm your seat." },
  { label: { en: "Safe Message", ru: "Aam Message", ur: "عام پیغام" }, text: "Assalam o alaikum! Kal ki meeting 3 baje hai. Agenda bhej dunga sham tak. Office mein milte hain." },
];

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/bmp";

export default function Analyze() {
  const { lang, t } = useLang();
  const exLang = lang === "urdu" ? "ur" : lang === "roman-urdu" ? "ru" : "en";
  const navigate = useNavigate();
  const addEntry = useHistory((s) => s.addEntry);

  const [activeTab, setActiveTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const u = URL.createObjectURL(file);
      setPreviewUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setPreviewUrl(null);
  }, [file]);

  function clearFile(e?: React.MouseEvent) {
    e?.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      let result;
      let sourceText: string | undefined;

      switch (activeTab) {
        case "text":
          if (!text.trim()) throw new Error(t.analyzePage.errText);
          sourceText = text.trim();
          result = await analyzeText(sourceText, lang);
          break;
        case "url":
          if (!url.trim()) throw new Error(t.analyzePage.errUrl);
          sourceText = url.trim();
          result = await analyzeUrl(sourceText, lang);
          break;
        case "screenshot":
          if (!file) throw new Error(t.analyzePage.errImage);
          result = await analyzeScreenshot(file, lang);
          break;
        case "qrcode":
          if (!file) throw new Error(t.analyzePage.errQr);
          result = await analyzeQrCode(file, lang);
          break;
        default:
          throw new Error("Unknown tab");
      }

      // Save to history and navigate to results
      const entry = addEntry({
        inputType: result.inputType,
        riskScore: result.riskScore,
        scamCategory: result.tactics?.[0]?.replace(/_/g, " ") || "General Analysis",
        confidence: (result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)) as "Low" | "Medium" | "High",
        redFlags: result.redFlags,
        explanation: result.explanation,
        recommendedActions: result.recommendations,
        sourceText,
        extractedUrl: result.extractedUrl || (activeTab === "url" ? url.trim() : undefined),
        detectedLanguage: result.detectedLanguage,
      });

      navigate(`/results/${entry.id}`, { state: { result, entry } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.analyzePage.errGeneric);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && (
    (activeTab === "text" && text.trim().length > 0) ||
    (activeTab === "url" && url.trim().length > 0) ||
    ((activeTab === "screenshot" || activeTab === "qrcode") && file !== null)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Page title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{t.analyzePage.title}</h1>
        <p className="text-sm text-txt-muted">{t.analyzePage.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null); }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent/10 border-accent/40 text-white"
                  : "bg-base-card border-line text-txt-muted hover:border-txt-dim/30 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-accent" : ""}`} />
              <span className="hidden sm:inline">{t.analyzePage.tabs[tab.labelKey]}</span>
            </button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="theme-card p-6">
        {/* Text input */}
        {activeTab === "text" && (
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir="auto"
              placeholder={t.placeholders?.text || "Paste the suspicious message here..."}
              rows={6}
              className="w-full bg-base border border-line rounded-lg px-4 py-3 text-sm text-white placeholder:text-txt-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-y transition-all"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-txt-dim">
              <span>{text.length} {t.analyzePage.characters}</span>
              {text.length > 10000 && <span className="text-accent">{t.analyzePage.maxChars}</span>}
            </div>
          </div>
        )}

        {/* URL input */}
        {activeTab === "url" && (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.placeholders?.url || "https://suspicious-site.com/..."}
            className="w-full bg-base border border-line rounded-lg px-4 py-3 text-sm text-white placeholder:text-txt-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        )}

        {/* File upload (screenshot / QR) */}
        {(activeTab === "screenshot" || activeTab === "qrcode") && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f && f.type.startsWith("image/")) setFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              dragOver ? "border-accent bg-accent/5" : "border-line hover:border-txt-dim/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGES}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              className="hidden"
            />
            {file ? (
              <div className="space-y-3">
                {previewUrl && (
                  <div className="relative inline-block">
                    <img src={previewUrl} alt="Preview" className="mx-auto max-h-28 rounded-lg border border-line object-contain" />
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs hover:bg-accent-light transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-txt-dim">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-base-hover flex items-center justify-center">
                  {activeTab === "screenshot"
                    ? <Image className="w-5 h-5 text-txt-dim" />
                    : <QrCode className="w-5 h-5 text-txt-dim" />
                  }
                </div>
                <p className="text-sm text-txt-muted">
                  <span className="font-medium text-white">{t.uploadClick}</span> {t.uploadOr}
                </p>
                <p className="text-xs text-txt-dim">{t.uploadFormats}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Example chips (text tab only) */}
      {activeTab === "text" && (
        <div className="mt-4">
          <p className="text-xs text-txt-dim mb-2">{t.analyzePage.tryExample}</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label.en}
                onClick={() => setText(ex.text)}
                className="text-xs px-3 py-1.5 rounded-full border border-line text-txt-muted hover:border-accent/30 hover:text-white transition-colors"
              >
                {ex.label[exLang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-6 w-full py-3.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          canSubmit
            ? "bg-accent text-white hover:bg-accent-light shadow-lg shadow-accent/30"
            : "bg-base-card text-txt-dim border border-line cursor-not-allowed"
        }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.analyzePage.submitting}
          </>
        ) : (
          <>
            {t.analyzePage.submit}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
