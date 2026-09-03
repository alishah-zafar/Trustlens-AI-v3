import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ScanLine } from "lucide-react";

const STEPS = [
  "Checking Source",
  "Analyzing Content",
  "Detecting Patterns",
  "Evaluating Risk",
];

/** Floating glass panel that shows sequential scanning steps */
export default function HolographicPanel() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSteps((prev) => (prev < STEPS.length ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Reset animation loop
  useEffect(() => {
    if (visibleSteps === STEPS.length) {
      const timeout = setTimeout(() => setVisibleSteps(0), 3000);
      return () => clearTimeout(timeout);
    }
  }, [visibleSteps]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="absolute top-6 right-2 sm:top-10 sm:right-4 z-10 w-56 sm:w-64"
      style={{ animation: "float 4s ease-in-out infinite", perspective: "600px" }}
    >
      <div className="bg-base-card/60 backdrop-blur-xl border border-warm/20 rounded-2xl p-4 shadow-xl shadow-warm/10" style={{ transform: "rotateY(-3deg) rotateX(2deg)" }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <ScanLine className="w-4 h-4 text-cool animate-pulse" />
          <span className="text-xs font-semibold text-cool uppercase tracking-wider">
            Scanning...
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <AnimatePresence>
            {STEPS.slice(0, visibleSteps).map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-xs text-txt-muted">{step}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator for next step */}
          {visibleSteps < STEPS.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full border border-cool/30 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-cool animate-pulse" />
              </div>
              <span className="text-xs text-txt-dim">{STEPS[visibleSteps]}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
