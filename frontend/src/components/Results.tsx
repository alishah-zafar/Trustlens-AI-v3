import { useState, useEffect } from "react";
import { useLang } from "../LangContext";
import type { AnalysisResult } from "../api";

/* ── Risk level helpers ── */
interface RiskStyle {
  hex: string;
  label: string;
  level: "high" | "medium" | "low";
}

function getRiskStyle(score: number, labels: { high: string; medium: string; low: string }): RiskStyle {
  if (score >= 70) return { hex: "#E53E3E", label: labels.high, level: "high" };
  if (score >= 35) return { hex: "#ECC94B", label: labels.medium, level: "medium" };
  return { hex: "#48BB78", label: labels.low, level: "low" };
}

/* ── Animated score counter ── */
function AnimatedScore({ score, color }: { score: number; color: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 40;
    let current = 0;
    const timer = setInterval(() => {
      current += score / steps;
      if (current >= score) { setDisplay(score); clearInterval(timer); }
      else setDisplay(Math.round(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <span className="text-6xl sm:text-7xl font-extrabold tabular-nums" style={{ color }}>
      {display}
    </span>
  );
}

/* ── Main Results component ── */
interface ResultsProps {
  result: AnalysisResult;
  onReset?: () => void;
}

export default function Results({ result, onReset }: ResultsProps) {
  const { riskScore, confidence, explanation, redFlags, tactics, recommendations, extractedText, extractedUrl, verdict, urlDetails, extractedContacts } = result;
  const { t } = useLang();
  const risk = getRiskStyle(riskScore, t.riskLabels);

  const verdictLabel =
    riskScore >= 70 ? "LIKELY SCAM" :
    riskScore >= 35 ? "SUSPICIOUS" : "LIKELY SAFE";

  return (
    <div className="mt-12 space-y-8 animate-fade-in">
      {/* ── Primary risk display ── */}
      <div className="text-center space-y-3">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: risk.hex }}
        >
          {risk.level === "high" ? "HIGH RISK" : risk.level === "medium" ? "MEDIUM RISK" : "LOW RISK"}
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <AnimatedScore score={riskScore} color={risk.hex} />
          <span className="text-2xl text-txt-dim font-light">/ 100</span>
        </div>
        <p className="text-lg font-semibold text-white">{verdictLabel}</p>
        {confidence && (
          <span className="inline-block text-[11px] font-medium px-3 py-1 rounded-full border"
            style={{
              color: risk.hex,
              borderColor: `${risk.hex}33`,
              backgroundColor: `${risk.hex}15`,
            }}
          >
            {confidence === "high" ? t.highConfidence : confidence === "medium" ? t.mediumConfidence : t.lowConfidence}
          </span>
        )}
      </div>

      {/* ── Explanation ── */}
      <div className="bg-base-card border border-line rounded-lg p-6">
        <p className="text-sm text-txt-muted leading-relaxed">{explanation}</p>
        {tactics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tactics.map((tac) => (
              <span
                key={tac}
                className="text-xs px-2.5 py-1 rounded-full border border-line text-txt-muted"
              >
                {tac.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Verdict (URL) ── */}
      {verdict && (
        <div className="flex items-center justify-center gap-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold"
            style={{
              color: risk.hex,
              borderColor: `${risk.hex}33`,
              backgroundColor: `${risk.hex}10`,
            }}
          >
            <span>{verdict === "high_risk" ? "\u{1F534}" : verdict === "suspicious" ? "\u{1F7E1}" : "\u{1F7E2}"}</span>
            {verdict === "high_risk" ? t.verdictHighRisk : verdict === "suspicious" ? t.verdictSuspicious : t.verdictSafe}
          </div>
          {urlDetails?.domain && (
            <span className="text-xs text-txt-dim font-mono">{urlDetails.domain}</span>
          )}
        </div>
      )}

      {/* ── Why we flagged this ── */}
      {redFlags.length > 0 && (
        <div className="bg-base-card border border-line rounded-lg p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Why we flagged this
          </h3>
          <ul className="space-y-3">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-txt-muted">
                <span className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── What should you do ── */}
      {recommendations.length > 0 && (
        <div className="bg-base-card border border-line rounded-lg p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            What should you do?
          </h3>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-txt-muted">
                <span className="mt-0.5 w-5 h-5 rounded bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── See through the scam (extracted text) ── */}
      {extractedText && (
        <div className="bg-base-card border border-line rounded-lg p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            {t.extractedText}
          </h3>
          <p className="text-sm text-txt-muted leading-relaxed font-mono whitespace-pre-wrap break-words">
            {extractedText}
          </p>
          {extractedContacts && (
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-txt-dim mb-2">{t.foundInImage}</p>
              {extractedContacts.urls?.map((u, i) => (
                <p key={`u${i}`} className="text-xs text-txt-muted font-mono flex items-start gap-1.5">
                  <span className="text-accent mt-0.5">{"\u2022"}</span>{u}
                </p>
              ))}
              {extractedContacts.phones?.map((p, i) => (
                <p key={`p${i}`} className="text-xs text-txt-muted font-mono flex items-start gap-1.5">
                  <span className="text-warn mt-0.5">{"\u2022"}</span>{p}
                </p>
              ))}
              {extractedContacts.emails?.map((e, i) => (
                <p key={`e${i}`} className="text-xs text-txt-muted font-mono flex items-start gap-1.5">
                  <span className="text-warn mt-0.5">{"\u2022"}</span>{e}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {extractedUrl && (
        <div className="bg-base-card border border-line rounded-lg p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">{t.extractedUrl}</h3>
          <p className="text-sm text-txt-muted font-mono break-all">{extractedUrl}</p>
        </div>
      )}

      {/* ── Domain details ── */}
      {urlDetails && (
        <div className="bg-base-card border border-line rounded-lg p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t.domainDetails}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-txt-dim">{t.domain}</span>
              <p className="text-txt-muted font-mono text-xs">{urlDetails.domain}</p>
            </div>
            <div>
              <span className="text-txt-dim">TLD</span>
              <p className="text-txt-muted font-mono text-xs">.{urlDetails.tld}</p>
            </div>
            {urlDetails.dnsResolves !== null && (
              <div>
                <span className="text-txt-dim">DNS</span>
                <p className={`text-xs font-medium ${urlDetails.dnsResolves ? "text-safe" : "text-accent"}`}>
                  {urlDetails.dnsResolves ? t.dnsResolves : t.dnsNotResolves}
                </p>
              </div>
            )}
            {urlDetails.domainAgeDays !== null && (
              <div>
                <span className="text-txt-dim">{t.domainAge}</span>
                <p className={`text-xs font-medium ${urlDetails.domainAgeDays < 90 ? "text-accent" : urlDetails.domainAgeDays < 365 ? "text-warn" : "text-safe"}`}>
                  {urlDetails.domainAgeDays} {t.days}
                </p>
              </div>
            )}
            {urlDetails.isShortener && (
              <div>
                <span className="text-txt-dim">{t.urlType}</span>
                <p className="text-xs font-medium text-warn">{t.shortener}</p>
              </div>
            )}
            {urlDetails.isTyposquat && (
              <div>
                <span className="text-txt-dim">{t.urlType}</span>
                <p className="text-xs font-medium text-accent">
                  {t.typosquat} ({urlDetails.typosquatTarget})
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Analyze Another ── */}
      {onReset && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-txt-muted border border-line hover:border-txt-dim/50 hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.379 2.624l-1.416 1.416a7.5 7.5 0 0012.835-3.546l-2.042-.494zm-10.624-2.85a5.5 5.5 0 019.376-2.623l1.416-1.416a7.5 7.5 0 00-12.834 3.546l2.042.493z" clipRule="evenodd" />
            </svg>
            {t.analyzeAnother}
          </button>
        </div>
      )}
    </div>
  );
}
