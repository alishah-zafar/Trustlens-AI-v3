import { Star, Quote } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Small Business Owner",
    text: "TrustLens caught a phishing email that looked exactly like it was from my bank. The detailed breakdown helped me understand what to look for next time.",
    rating: 5,
    initials: "SK",
    bg: "bg-cool/20 text-cool",
  },
  {
    name: "Ahmed R.",
    role: "Freelance Developer",
    text: "I use it daily to check suspicious client links. The URL scanner has saved me from several typosquatted domains disguised as payment portals.",
    rating: 5,
    initials: "AR",
    bg: "bg-warm/20 text-warm",
  },
  {
    name: "Fatima M.",
    role: "University Student",
    text: "The Roman Urdu support is amazing! My parents can finally check suspicious WhatsApp messages themselves without needing to ask me every time.",
    rating: 5,
    initials: "FM",
    bg: "bg-emerald-500/20 text-emerald-400",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-warm to-cool bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-txt-muted">
            See what our users say about TrustLens AI.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 0.1}>
            <div className="glass-card p-6 h-full flex flex-col">
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-cool/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-txt-muted leading-relaxed flex-1 mb-4">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-txt">{t.name}</p>
                  <p className="text-xs text-txt-dim">{t.role}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
