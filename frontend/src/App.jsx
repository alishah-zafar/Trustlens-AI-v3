import { useState } from "react";
import Header from "./components/Header.jsx";
import InputForm from "./components/InputForm.jsx";
import Results from "./components/Results.jsx";
import { analyzeText, analyzeUrl, analyzeScreenshot, analyzeQrCode } from "./api.js";

const TABS = [
  { id: "text", label: "Text / Email" },
  { id: "url", label: "URL" },
  { id: "screenshot", label: "Screenshot" },
  { id: "qrcode", label: "QR Code" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("text");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(data) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      switch (activeTab) {
        case "text":
          res = await analyzeText(data.text);
          break;
        case "url":
          res = await analyzeUrl(data.url);
          break;
        case "screenshot":
          res = await analyzeScreenshot(data.file);
          break;
        case "qrcode":
          res = await analyzeQrCode(data.file);
          break;
        default:
          throw new Error("Unknown input type");
      }
      setResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResult(null);
                setError(null);
              }}
              className={`
                flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input form */}
        <InputForm activeTab={activeTab} onSubmit={handleSubmit} loading={loading} />

        {/* Error display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <p className="font-medium">Analysis failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Analyzing for scam indicators...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && <Results result={result} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        TrustLens AI &mdash; Helping you stay safe from scams and phishing
      </footer>
    </div>
  );
}
