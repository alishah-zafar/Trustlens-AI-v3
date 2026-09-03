import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Panel 3 — subtle circular digital scanning visualization */
export default function ScanningVisPanel() {
  const [angle, setAngle] = useState(0);
  const [dots, setDots] = useState<boolean[]>(Array(8).fill(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((a) => (a + 6) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setDots((prev) => {
        const next = [...prev];
        next[idx % 8] = !next[idx % 8];
        return next;
      });
      idx++;
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="absolute top-[55%] right-0 sm:right-2 z-10 w-36 sm:w-40"
      style={{ animation: "float 5s ease-in-out 1s infinite" }}
    >
      <div className="bg-base-card/60 backdrop-blur-xl border border-cool/12 rounded-2xl p-3 shadow-lg shadow-cool/5">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-txt-dim uppercase tracking-wider">
            Scan Active
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Circular visualization */}
        <div className="relative w-20 h-20 mx-auto">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            {/* Outer ring */}
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="rgba(47,191,176,0.15)"
              strokeWidth="1"
            />
            {/* Rotating arc */}
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#2fbfb0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 154"
              transform={`rotate(${angle} 40 40)`}
              opacity="0.7"
            />
            {/* Inner ring */}
            <circle
              cx="40" cy="40" r="24"
              fill="none"
              stroke="rgba(200,30,61,0.2)"
              strokeWidth="1"
            />
            <circle
              cx="40" cy="40" r="24"
              fill="none"
              stroke="#c81e3d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="35 116"
              transform={`rotate(${-angle * 0.7} 40 40)`}
              opacity="0.5"
            />
            {/* Center dot */}
            <circle cx="40" cy="40" r="3" fill="#2fbfb0" opacity="0.8" />
            {/* Data points */}
            {dots.map((active, i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const x = 40 + Math.cos(a) * 29;
              const y = 40 + Math.sin(a) * 29;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={active ? "#2fbfb0" : "#2fbfb0"}
                  opacity={active ? 0.9 : 0.2}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
