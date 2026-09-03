import { motion } from "framer-motion";
import { Shield } from "lucide-react";

/** Floating panel showing a sample risk score */
export default function RiskScorePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 15 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute bottom-16 left-0 sm:left-2 z-10 w-48 sm:w-52"
      style={{ animation: "float 5s ease-in-out 0.5s infinite", perspective: "600px" }}
    >
      <div className="bg-base-card/60 backdrop-blur-xl border border-cool/15 rounded-2xl p-4 shadow-xl shadow-cool/5" style={{ transform: "rotateY(3deg) rotateX(2deg)" }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider">
            Risk Score
          </span>
        </div>

        {/* Score */}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-emerald-400 tabular-nums">23</span>
          <span className="text-sm text-txt-dim mb-1">%</span>
        </div>

        {/* Meter */}
        <div className="w-full h-1.5 rounded-full bg-base overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "23%" }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Low Risk
          </span>
          <span className="text-[10px] text-txt-dim">Category: Safe</span>
        </div>
      </div>
    </motion.div>
  );
}
