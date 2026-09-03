import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Image, QrCode, Globe } from "lucide-react";
import { useLang } from "../../LangContext";

interface HeroProps {
  onScanClick?: () => void;
  onSubmit?: (text: string) => void;
  loading?: boolean;
}

export default function Hero({ onScanClick, onSubmit, loading }: HeroProps) {
  const [text, setText] = useState("");
  const { t } = useLang();

  function handleAnalyze() {
    if (text.trim() && onSubmit) onSubmit(text.trim());
    else onScanClick?.();
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full text-center">
        {/* Shield icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
        </motion.div>

        {/* TRUSTLENS */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4"
        >
          TRUST<span className="text-accent">LENS</span>
        </motion.h1>

        {/* KNOW BEFORE YOU TRUST. */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl font-semibold text-white/80 tracking-wide uppercase mb-4"
        >
          Know Before You Trust.
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm sm:text-base text-txt-muted max-w-lg mx-auto mb-12 leading-relaxed"
        >
          {t.heroSub || "AI-powered scam detection for messages, websites, screenshots, emails and QR codes."}
        </motion.p>

        {/* Central input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAnalyze(); }}
              placeholder={t.placeholders?.text || "Paste something suspicious..."}
              disabled={loading}
              className="w-full bg-base-card border border-line rounded-lg px-5 py-4 pr-36 text-sm text-white placeholder:text-txt-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || (!text.trim() && !onScanClick)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cta-btn text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {loading ? (t.analyzing || "Analyzing") : (t.analyze || "Analyze")}
            </button>
          </div>

          {/* Quick options */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <button
              onClick={onScanClick}
              className="flex items-center gap-2 text-txt-dim hover:text-txt transition-colors"
            >
              <Image className="w-4 h-4" />
              Upload Screenshot
            </button>
            <button
              onClick={onScanClick}
              className="flex items-center gap-2 text-txt-dim hover:text-txt transition-colors"
            >
              <QrCode className="w-4 h-4" />
              Scan QR
            </button>
            <button
              onClick={onScanClick}
              className="flex items-center gap-2 text-txt-dim hover:text-txt transition-colors"
            >
              <Globe className="w-4 h-4" />
              Check Website
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
