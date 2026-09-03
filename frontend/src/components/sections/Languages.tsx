import { useState } from "react";
import { Globe } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const LANGS = [
  {
    code: "en",
    label: "English",
    sample: "Your bank account has been compromised. Click here immediately to verify your identity.",
    dir: "ltr" as const,
  },
  {
    code: "roman-urdu",
    label: "Roman Urdu",
    sample: "Aap ka bank account compromise ho gaya hai. Apni identity verify karne ke liye foran yahan click karein.",
    dir: "ltr" as const,
  },
  {
    code: "urdu",
    label: "اردو",
    sample: "آپ کا بینک اکاؤنٹ سمجھوتہ ہو گیا ہے۔ اپنی شناخت کی تصدیق کے لیے فوراً یہاں کلک کریں۔",
    dir: "rtl" as const,
  },
];

export default function Languages() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative z-10 py-20">
      <ScrollReveal>
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
            Security Everyone Can{" "}
            <span className="bg-gradient-to-r from-cool to-warm bg-clip-text text-transparent">
              Understand
            </span>
          </h2>
          <p className="text-txt-muted max-w-md mx-auto">
            Available in English, Roman Urdu, and Urdu — because safety shouldn't have a language barrier.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mx-auto">
          {/* Language tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {LANGS.map((l, i) => (
              <button
                key={l.code}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active === i
                    ? "bg-cool/15 text-cool border border-cool/30"
                    : "text-txt-muted hover:text-txt hover:bg-white/5 border border-transparent"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Sample display */}
          <div
            className="glass-card static p-8 text-center"
            dir={LANGS[active].dir}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-cool" />
              <span className="text-xs text-txt-dim uppercase tracking-wider">
                {LANGS[active].label}
              </span>
            </div>
            <p
              className={`text-lg text-txt leading-relaxed ${
                LANGS[active].code === "urdu"
                  ? "font-[Noto_Nastaliq_Urdu] text-xl"
                  : ""
              }`}
            >
              {LANGS[active].sample}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
