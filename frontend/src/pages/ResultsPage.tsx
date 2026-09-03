import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHistory } from "../store";
import { useLang } from "../LangContext";
import type { AnalysisResult, LinkTraceResult } from "../api";
import { traceLink } from "../api";
import {
  ArrowLeft, Download, AlertTriangle, Shield, CheckCircle,
  Link2, ChevronRight, Loader2, ExternalLink, Globe,
} from "lucide-react";

function getRiskColor(score: number) {
  if (score >= 75) return "#9B2C2C";
  if (score >= 50) return "#E53E3E";
  if (score >= 25) return "#ECC94B";
  return "#48BB78";
}

/* ─────────────────────────────────────────────
   Link Destination Preview — Signature Feature
   ───────────────────────────────────────────── */
function LinkPreview({ url }: { url: string }) {
  const { t } = useLang();
  const [trace, setTrace] = useState<LinkTraceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    traceLink(url)
      .then((res) => { if (!cancelled) { setTrace(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div className="bg-base-card border-2 border-amber-500/30 rounded-lg p-5 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Link2 className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{t.resultsPage.linkPreview.title}</h3>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {t.resultsPage.linkPreview.badge}
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-txt-muted py-4">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          {t.resultsPage.linkPreview.loading}
        </div>
      )}

      {/* Error state — link unverifiable is itself a red flag */}
      {error && !loading && (
        <div className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">{t.resultsPage.linkPreview.unverifiedTitle}</p>
            <p className="text-xs text-txt-muted mt-1">
              {t.resultsPage.linkPreview.unverifiedDesc}
            </p>
          </div>
        </div>
      )}

      {/* Redirect chain visualization */}
      {trace && !loading && (
        <div>
          {/* Horizontal hop flow — always LTR so URLs read naturally */}
          <div className="flex items-start gap-1 overflow-x-auto pb-2 mb-4" dir="ltr">
            {trace.hops.map((hop, i) => {
              const isFinal = i === trace.hops.length - 1;
              return (
                <div key={i} className="flex items-center shrink-0">
                  {/* Hop node */}
                  <div
                    className={`
                      flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border min-w-[100px] max-w-[160px]
                      ${hop.isSuspicious
                        ? "bg-accent/10 border-accent/40"
                        : isFinal
                          ? "bg-safe/10 border-safe/30"
                          : "bg-base border-line"
                      }
                    `}
                  >
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${hop.isSuspicious ? "text-accent" : isFinal ? "text-safe" : "text-txt-dim"}`}>
                      {i === 0 ? t.resultsPage.linkPreview.original : isFinal ? t.resultsPage.linkPreview.final : `${t.resultsPage.linkPreview.hop} ${i}`}
                    </span>
                    <span className={`text-[11px] font-mono text-center truncate w-full ${hop.isSuspicious ? "text-accent" : "text-white"}`}>
                      {hop.domain}
                    </span>
                    {hop.status && (
                      <span className="text-[9px] text-txt-dim">{hop.status}</span>
                    )}
                    {hop.flags.map((flag, j) => (
                      <span key={j} className="text-[9px] text-accent/90 text-center leading-tight">
                        ⚠ {flag}
                      </span>
                    ))}
                  </div>
                  {/* Arrow between hops */}
                  {!isFinal && (
                    <ChevronRight className="w-4 h-4 text-txt-dim shrink-0 mx-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary line */}
          <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              {trace.isSuspicious ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent font-semibold">
                    {t.resultsPage.linkPreview.suspiciousChain}
                  </span>
                </>
              ) : trace.hasRedirects ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-safe" />
                  <span className="text-safe font-semibold">
                    {trace.totalHops - 1} {t.resultsPage.linkPreview.redirectsSafe}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-safe" />
                  <span className="text-txt-muted">{t.resultsPage.linkPreview.noRedirects}</span>
                </>
              )}
            </div>
            <a
              href={trace.finalDestination}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1 text-txt-dim hover:text-white transition-colors"
              onClick={(e) => e.preventDefault()}
              title="TrustLens never opens links for you"
            >
              <Globe className="w-3 h-3" />
              {trace.finalDestination.length > 40
                ? trace.finalDestination.substring(0, 40) + "..."
                : trace.finalDestination}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Results Page
   ───────────────────────────────────────────── */
export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const getEntry = useHistory((s) => s.getEntry);
  const { lang, t } = useLang();
  const [displayScore, setDisplayScore] = useState(0);
  const isRtl = lang === "urdu";

  // Get result from navigation state or store
  const stateResult = (location.state as any)?.result as AnalysisResult | undefined;
  const entry = id ? getEntry(id) : undefined;
  const result = stateResult;

  const score = result?.riskScore ?? entry?.riskScore ?? 0;
  const riskColor = getRiskColor(score);
  const riskLabel = score >= 75 ? t.resultsPage.riskLevels.severe
    : score >= 50 ? t.resultsPage.riskLevels.high
    : score >= 25 ? t.resultsPage.riskLevels.moderate
    : t.resultsPage.riskLevels.low;
  const verdict = score >= 75 ? t.resultsPage.verdicts.scam
    : score >= 50 ? t.resultsPage.verdicts.suspicious
    : score >= 25 ? t.resultsPage.verdicts.mild
    : t.resultsPage.verdicts.safe;
  const circumference = 2 * Math.PI * 54;
  const finalOffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!score) return;
    const duration = 800;
    const steps = 40;
    let current = 0;
    const timer = setInterval(() => {
      current += score / steps;
      if (current >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(Math.round(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  if (!result && !entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-txt-muted mb-4">{t.resultsPage.noResult}</p>
        <Link to="/analyze" className="text-accent hover:text-accent-light text-sm font-semibold">
          ← Back to Analyze
        </Link>
      </div>
    );
  }

  const redFlags = result?.redFlags ?? entry?.redFlags ?? [];
  const explanation = result?.explanation ?? entry?.explanation ?? "";
  const recommendations = result?.recommendations ?? entry?.recommendedActions ?? [];
  const confidence = result?.confidence ?? entry?.confidence?.toLowerCase() ?? "medium";
  const category = result?.scamCategory ?? entry?.scamCategory ?? "";
  const sourceText = result?.extractedText ?? entry?.sourceText;
  const detectedLanguage = result?.detectedLanguage ?? entry?.detectedLanguage;
  // Find the URL to trace: extracted URL, or the source text if it was a URL analysis
  const urlToTrace = result?.extractedUrl
    ?? (result?.inputType === "url" || entry?.inputType === "url" ? (entry?.sourceText || sourceText) : null)
    ?? (result?.containsUrl ? result.extractedUrl : null);

  // Detect if the source text itself is Urdu (needs RTL display)
  const sourceIsUrdu = sourceText ? /[\u0600-\u06FF]/.test(sourceText) : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate("/analyze")}
        className="flex items-center gap-1.5 text-sm text-txt-muted hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.analyzeAnother}
      </button>

      {/* Primary risk display */}
      <div className="text-center mb-10">
        {category && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border mb-4"
            style={{ color: riskColor, borderColor: `${riskColor}33`, backgroundColor: `${riskColor}10` }}>
            {category}
          </span>
        )}
        <p className="text-sm font-bold tracking-[0.2em] uppercase mb-2" style={{ color: riskColor }}>
          {riskLabel}
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-6xl sm:text-7xl font-extrabold tabular-nums" style={{ color: riskColor }}>
            {displayScore}
          </span>
          <span className="text-xl text-txt-dim font-light">/ 100</span>
        </div>
        <p className="text-lg font-semibold text-white">{verdict}</p>

        {/* Confidence + language badges */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <span className="inline-block text-[11px] font-medium px-3 py-1 rounded-full border"
            style={{ color: riskColor, borderColor: `${riskColor}22`, backgroundColor: `${riskColor}08` }}>
            {confidence === "high" ? t.highConfidence : confidence === "medium" ? t.mediumConfidence : t.lowConfidence}
          </span>
          {detectedLanguage && (
            <span className="inline-block text-[11px] font-medium px-3 py-1 rounded-full border border-line bg-base-card text-txt-muted">
              {t.resultsPage.detected} {detectedLanguage}
            </span>
          )}
        </div>
      </div>

      {/* Link Destination Preview — signature feature */}
      {urlToTrace && <LinkPreview url={urlToTrace} />}

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <div className="bg-base-card border border-line rounded-lg p-5 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            {t.redFlags}
          </h3>
          <ul className="space-y-2.5">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-txt-muted">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="bg-base-card border border-line rounded-lg p-5 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{t.resultsPage.whyFlagged}</h3>
          <p
            className={`text-sm text-txt-muted leading-relaxed ${isRtl ? "text-right font-urdu" : ""}`}
            dir={isRtl ? "rtl" : "ltr"}
          >
            {explanation}
          </p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-base-card border border-line rounded-lg p-5 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-safe" />
            {t.whatToDo}
          </h3>
          <ul className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 text-sm text-txt-muted ${isRtl ? "flex-row-reverse text-right font-urdu" : ""}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <CheckCircle className={`w-4 h-4 text-safe mt-0.5 shrink-0 ${isRtl ? "ml-3" : ""}`} />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source text (see through the scam) */}
      {sourceText && (
        <div className="bg-base-card border border-line rounded-lg p-5 mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{t.resultsPage.originalContent}</h3>
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              sourceIsUrdu ? "text-right font-urdu" : "text-txt-muted font-mono"
            }`}
            dir={sourceIsUrdu ? "rtl" : "ltr"}
            style={sourceIsUrdu ? { color: "#A0A0A0" } : undefined}
          >
            {sourceText}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-txt-dim mt-8 mb-4">
        {t.resultsPage.disclaimer}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/analyze"
          className="bg-accent text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-light transition-colors"
        >
          {t.analyzeAnother}
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm text-txt-muted border border-line px-5 py-3 rounded-lg hover:border-txt-dim/50 hover:text-white transition-all"
        >
          <Download className="w-4 h-4" />
          {t.resultsPage.downloadReport}
        </button>
      </div>
    </div>
  );
}
