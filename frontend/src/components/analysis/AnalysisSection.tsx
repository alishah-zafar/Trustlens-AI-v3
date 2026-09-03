import { useState, useImperativeHandle, forwardRef } from "react";
import { useLang } from "../../LangContext";
import AnalysisCards from "../TabBar";
import InputForm from "../InputForm";
import Results from "../Results";
import {
  analyzeText,
  analyzeUrl,
  analyzeScreenshot,
  analyzeQrCode,
} from "../../api";
import type { AnalysisResult } from "../../api";

export interface AnalysisSectionHandle {
  prefillText: (text: string) => void;
  reset: () => void;
}

const AnalysisSection = forwardRef<AnalysisSectionHandle>(function AnalysisSection(_, ref) {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState("text");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefillValue, setPrefillValue] = useState("");

  useImperativeHandle(ref, () => ({
    prefillText(text: string) {
      setActiveTab("text");
      setResult(null);
      setError(null);
      setPrefillValue(text);
    },
    reset() {
      setResult(null);
      setError(null);
      setPrefillValue("");
    },
  }));

  async function handleSubmit(data: { text?: string; url?: string; file?: File }) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res: AnalysisResult;
      switch (activeTab) {
        case "text":
          res = await analyzeText(data.text!, lang);
          break;
        case "url":
          res = await analyzeUrl(data.url!, lang);
          break;
        case "screenshot":
          res = await analyzeScreenshot(data.file!, lang);
          break;
        case "qrcode":
          res = await analyzeQrCode(data.file!, lang);
          break;
        default:
          throw new Error("Unknown input type");
      }
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setPrefillValue("");
  }

  return (
    <section id="scan" className="relative z-10 py-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
          Scan <span className="text-accent">Now</span>
        </h2>
        <p className="text-txt-muted max-w-md mx-auto text-sm">
          Paste a message, check a URL, or upload a screenshot for instant analysis.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnalysisCards
          activeTab={activeTab}
          onTabChange={(id) => {
            setActiveTab(id);
            setResult(null);
            setError(null);
            setPrefillValue("");
          }}
        />

        <div className="mt-4">
          <InputForm
            activeTab={activeTab}
            onSubmit={handleSubmit}
            loading={loading}
            prefillValue={prefillValue}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
            <p className="font-medium">{t.analysisFailed}</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-line border-t-accent rounded-full animate-spin" />
            <p className="text-sm text-txt-muted">{t.analyzingTitle}</p>
            <p className="text-xs text-txt-dim">{t.analyzingSub}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && <Results result={result} onReset={handleReset} />}
      </div>
    </section>
  );
});

export default AnalysisSection;
