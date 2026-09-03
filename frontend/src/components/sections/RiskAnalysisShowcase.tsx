import {
  ShieldAlert,
  Link2,
  UserX,
  CreditCard,
  Clock,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const DETECTED_ITEMS = [
  {
    icon: Clock,
    label: "Urgency",
    desc: "Pressures immediate action",
    color: "text-crimson",
    bg: "bg-crimson/10",
  },
  {
    icon: Link2,
    label: "Suspicious Link",
    desc: "Typosquatted domain detected",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: UserX,
    label: "Impersonation",
    desc: "Pretending to be your bank",
    color: "text-warm",
    bg: "bg-warm/10",
  },
  {
    icon: CreditCard,
    label: "Sensitive Info",
    desc: "Requests card details",
    color: "text-cool",
    bg: "bg-cool/10",
  },
];

export default function RiskAnalysisShowcase() {
  return (
    <section className="relative z-10 py-20">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-crimson to-amber-400 bg-clip-text text-transparent">
              Risk Analysis
            </span>
          </h2>
          <p className="text-txt-muted max-w-md mx-auto">
            See exactly what TrustLens detects — in real time.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="glass-card static p-6 sm:p-8 max-w-3xl mx-auto border border-crimson/15">
          {/* Header with score */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-6 pb-6 border-b border-white/5">
            {/* Risk score ring */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(239,68,68,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - 0.87)}
                  style={{
                    transition: "stroke-dashoffset 1s ease-out",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-crimson tabular-nums">
                  87
                </span>
                <span className="text-[10px] text-txt-dim">/ 100</span>
              </div>
            </div>

            <div className="text-center sm:text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/15 border border-crimson/30 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-crimson" />
                <span className="text-xs font-bold text-crimson uppercase">
                  High Risk
                </span>
              </div>
              <p className="text-sm text-txt-muted leading-relaxed">
                This message shows strong indicators of a banking phishing scam
                targeting your financial information.
              </p>
            </div>
          </div>

          {/* Detected items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DETECTED_ITEMS.map((item, i) => (
              <ScrollReveal key={item.label} delay={0.2 + i * 0.08}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-card/50 border border-white/5">
                  <div
                    className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-txt">{item.label}</p>
                    <p className="text-xs text-txt-dim">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Sample message preview */}
          <div className="mt-5 p-4 rounded-xl bg-base/50 border border-crimson/10">
            <p className="text-xs font-semibold text-txt-dim uppercase tracking-wider mb-2">
              Analyzed Message
            </p>
            <p className="text-sm text-txt-muted font-mono leading-relaxed">
              &ldquo;URGENT: Your account has been compromised! Click here
              immediately to verify:{" "}
              <span className="text-crimson underline">
                www.your-bank-secure.com
              </span>
              . Failure to act within 24hrs will result in account
              suspension.&rdquo;
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
