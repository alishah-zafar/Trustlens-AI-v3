import { Upload, Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Upload",
    desc: "Paste a message, enter a URL, upload a screenshot, or scan a QR code.",
    color: "text-cool",
    bg: "bg-cool/10",
    border: "border-cool/20",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our AI engine checks for 15+ scam indicators in seconds.",
    color: "text-warm",
    bg: "bg-warm/10",
    border: "border-warm/20",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Stay Safe",
    desc: "Get a clear risk score with actionable recommendations.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-20">
      <ScrollReveal>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
            How It{" "}
            <span className="bg-gradient-to-r from-warm to-cool bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-txt-muted max-w-md mx-auto">
            Three simple steps to protect yourself from scams.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-cool/30 via-warm/30 to-emerald-500/30" />

        {STEPS.map((step, i) => (
          <ScrollReveal key={step.num} delay={i * 0.15}>
            <div className="relative text-center">
              {/* Number badge */}
              <div
                className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mx-auto mb-5 relative z-10`}
              >
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>

              {/* Step number */}
              <span
                className={`text-xs font-bold ${step.color} uppercase tracking-widest mb-2 block`}
              >
                Step {step.num}
              </span>

              <h3 className="text-lg font-semibold text-txt mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-txt-dim leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>

              {/* Arrow between steps (mobile) */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <ArrowRight className="w-5 h-5 text-txt-dim rotate-90" />
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
