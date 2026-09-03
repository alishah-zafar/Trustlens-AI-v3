import { Link } from "react-router-dom";
import { Shield, Brain, BarChart3, Languages, Link2, ArrowRight } from "lucide-react";
import { useLang } from "../LangContext";
import detectiveArt from "../assets/detective-noir.png";

/* ── Decorative noir detective — left hero art (strictly visual, no interaction) ── */
function DetectiveArt() {
  return (
    <img
      src={detectiveArt}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="detective-glow h-[50vh] sm:h-[55vh] lg:h-[58vh] w-auto select-none opacity-45 sm:opacity-70 lg:opacity-100"
    />
  );
}

/* ── Decorative neon wireframe icons over a matrix grid — right hero art ── */
function RightIconsArt() {
  const glow = "drop-shadow-[0_0_7px_rgba(255,0,51,0.65)]";
  return (
    <div className="matrix-grid absolute inset-0">
      {/* Magnifying glass with exclamation mark */}
      <div className="noir-float absolute top-[11%] right-[60px] sm:right-[80px] lg:right-[110px] opacity-85" style={{ animationDelay: "0s" }}>
        <svg viewBox="0 0 40 40" fill="none" stroke="#FF0033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${glow} w-12 h-12 sm:w-14 sm:h-14 lg:w-[66px] lg:h-[66px]`}>
          <circle cx="16" cy="16" r="11" />
          <line x1="24.6" y1="24.6" x2="34" y2="34" strokeWidth="3.2" />
          <line x1="16" y1="10.5" x2="16" y2="17.5" />
          <circle cx="16" cy="21.6" r="1.5" fill="#FF0033" stroke="none" />
        </svg>
      </div>

      {/* Envelope (phishing bait) */}
      <div className="noir-float absolute top-[34%] right-[20px] sm:right-[30px] lg:right-[40px] opacity-60" style={{ animationDelay: "1.3s" }}>
        <svg viewBox="0 0 40 32" fill="none" stroke="#FF0033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${glow} w-10 h-8 sm:w-12 sm:h-9 lg:w-[58px] lg:h-[46px]`}>
          <rect x="2" y="3" width="36" height="26" rx="3" />
          <path d="M3.5 5 L20 18 L36.5 5" />
        </svg>
      </div>

      {/* Fishing hook (scam indicator) */}
      <div className="noir-float absolute top-[57%] right-[50px] sm:right-[70px] lg:right-[100px] opacity-70" style={{ animationDelay: "2.1s" }}>
        <svg viewBox="0 0 40 52" fill="none" stroke="#FF0033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${glow} w-8 h-10 sm:w-9 sm:h-11 lg:w-[42px] lg:h-[54px]`}>
          <circle cx="14" cy="5" r="3.2" />
          <path d="M14 8.5 V26 C14 36 22 41 29 36 C33.5 33 34.5 27 31.5 22" />
          <path d="M31.5 22 L27.5 27" />
        </svg>
      </div>

      {/* Shield */}
      <div className="noir-float absolute top-[23%] right-[110px] sm:right-[150px] lg:right-[200px] opacity-50" style={{ animationDelay: "0.8s" }}>
        <svg viewBox="0 0 36 40" fill="none" stroke="#FF0033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${glow} w-9 h-10 sm:w-10 sm:h-11 lg:w-[46px] lg:h-[50px]`}>
          <path d="M18 3 L32 8 V18 C32 27 26 33 18 37 C10 33 4 27 4 18 V8 Z" />
          <path d="M18 3 V37" opacity="0.5" />
        </svg>
      </div>

      {/* Globe (worldwide scam net) */}
      <div className="noir-float absolute top-[46%] right-[130px] sm:right-[165px] lg:right-[215px] opacity-55" style={{ animationDelay: "2.6s" }}>
        <svg viewBox="0 0 40 40" fill="none" stroke="#FF0033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${glow} w-10 h-10 sm:w-11 sm:h-11 lg:w-[48px] lg:h-[48px]`}>
          <circle cx="20" cy="20" r="16" />
          <ellipse cx="20" cy="20" rx="7" ry="16" />
          <path d="M4 20 H36" />
          <path d="M7.5 11 C11 13.5 15 14.5 20 14.5 C25 14.5 29 13.5 32.5 11" opacity="0.6" />
          <path d="M7.5 29 C11 26.5 15 25.5 20 25.5 C25 25.5 29 26.5 32.5 29" opacity="0.6" />
        </svg>
      </div>

      {/* Floating FAKE warning badge */}
      <div className="noir-float absolute top-[74%] right-[90px] sm:right-[120px] lg:right-[170px] opacity-90" style={{ animationDelay: "1.7s" }}>
        <div dir="ltr" className="badge-flicker rounded border border-[#FF0033]/80 bg-[#FF0033]/10 px-3 py-1 text-xs font-bold tracking-[0.3em] text-[#FF0033] drop-shadow-[0_0_8px_rgba(255,0,51,0.7)]">
          FAKE
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useLang();

  return (
    <div className="flex flex-col">
      {/* Hero — fills the first viewport, natural document flow below */}
      <section className="hero-noir relative min-h-[calc(100vh-70px)] w-full flex items-center justify-center px-4 sm:px-10 py-10 overflow-hidden">
        {/* Ambient cyber glow — red aura behind hero center + detective (decorative) */}
        <div aria-hidden="true" className="ambient-glow absolute inset-0 pointer-events-none" />

        {/* Decorative noir art — detective bleeding out of the bottom-left corner / right neon icons (visual only) */}
        <div aria-hidden="true" className="absolute bottom-0 left-0 bg-transparent pointer-events-none select-none">
          <DetectiveArt />
        </div>
        <div aria-hidden="true" className="absolute right-0 top-0 h-full w-[190px] sm:w-[240px] lg:w-[300px] xl:w-[340px] pointer-events-none select-none opacity-70 sm:opacity-90 lg:opacity-100">
          <RightIconsArt />
        </div>

        <div className="w-full text-center relative z-10">
          {/* Shield icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
              <Shield className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2rem,8vw,2.5rem)] sm:text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold tracking-tight text-white mb-3">
            Trust<span className="text-[#FF0033] title-glow-red">LensAI</span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg font-semibold text-white/80 tracking-widest uppercase mb-2">
            {t.landing.tagline}
          </p>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-txt-muted max-w-xl mx-auto mb-8 leading-relaxed">
            {t.landing.subtitle}
          </p>

          {/* Primary CTA */}
          <Link
            to="/analyze"
            className="inline-flex items-center gap-3 bg-accent text-white text-base sm:text-lg font-bold px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg hover:bg-accent-light transition-all shadow-lg shadow-accent/30 hover:shadow-accent/40"
          >
            {t.heroCta}
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Abstract risk gauge SVG */}
          <div className="mt-8 flex justify-center">
            <svg viewBox="0 0 200 110" className="w-56 sm:w-64 opacity-70">
              {/* Gauge track */}
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#2A2A2A" strokeWidth="8" strokeLinecap="round" />
              {/* Gauge fill — red arc */}
              <path d="M 20 100 A 80 80 0 0 1 140 35" fill="none" stroke="#E53E3E" strokeWidth="8" strokeLinecap="round" />
              {/* Needle */}
              <line x1="100" y1="100" x2="135" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <circle cx="100" cy="100" r="4" fill="#FFFFFF" />
              {/* Labels */}
              <text x="15" y="108" fill="#6B6B6B" fontSize="8" fontFamily="sans-serif">LOW</text>
              <text x="165" y="108" fill="#6B6B6B" fontSize="8" fontFamily="sans-serif">HIGH</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="w-full px-4 sm:px-6 py-14 lg:py-16 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* AI-Powered */}
            <div className="theme-card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t.landing.featAiTitle}</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                {t.landing.featAiDesc}
              </p>
            </div>

            {/* Risk Scoring */}
            <div className="theme-card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t.landing.featRiskTitle}</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                {t.landing.featRiskDesc}
              </p>
            </div>

            {/* Multi-Language */}
            <div className="theme-card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Languages className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t.landing.featLangTitle}</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                {t.landing.featLangDesc}
              </p>
            </div>
          </div>

          {/* Signature feature card — Link Destination Preview */}
          <Link
            to="/analyze"
            className="theme-card block p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">{t.landing.sigTitle}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                    {t.landing.sigBadge}
                  </span>
                </div>
                <p className="text-sm text-txt-muted leading-relaxed mb-2">
                  {t.landing.sigDesc}
                </p>
                <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t.landing.sigCta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
