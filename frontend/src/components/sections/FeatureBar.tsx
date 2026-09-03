import {
  MessageSquare,
  Globe,
  Image,
  QrCode,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import NumberCounter from "../ui/NumberCounter";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Message Analysis",
    desc: "Detect phishing, impersonation, and scam tactics in texts and emails.",
    color: "text-cool",
    glow: "shadow-cool/20",
  },
  {
    icon: Globe,
    title: "Website Safety",
    desc: "Check URLs for typosquatting, suspicious domains, and phishing indicators.",
    color: "text-warm",
    glow: "shadow-warm/20",
  },
  {
    icon: Image,
    title: "Screenshot Scanner",
    desc: "Upload screenshots for OCR-based scam and phishing detection.",
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: QrCode,
    title: "QR Analyzer",
    desc: "Decode and analyze QR codes to identify hidden malicious links.",
    color: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
];

export default function FeatureBar() {
  return (
    <section className="relative z-10 py-16">
      <ScrollReveal>
        <div className="glass-card static p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Feature cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div
                      className={`w-12 h-12 rounded-xl bg-base-card flex items-center justify-center ${f.color} shadow-lg ${f.glow} flex-shrink-0`}
                    >
                      <f.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-txt mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-txt-dim leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Analytics sidebar */}
            <ScrollReveal delay={0.4} className="lg:col-span-4">
              <div className="bg-base-card/50 rounded-xl p-5 border border-cool/10 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-cool" />
                  <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider">
                    Live Analytics
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <NumberCounter
                      value={12400}
                      className="text-2xl font-bold text-cool"
                    />
                    <span className="text-xs text-txt-dim ml-1">scans today</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18% from yesterday</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <NumberCounter
                      value={98}
                      suffix=".7%"
                      className="text-2xl font-bold text-warm"
                    />
                    <span className="text-xs text-txt-dim ml-1">accuracy</span>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="flex items-end gap-[3px] h-12">
                  {[35, 45, 30, 60, 50, 75, 65, 80, 70, 90, 85, 95].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-cool/40 to-cool/10"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
