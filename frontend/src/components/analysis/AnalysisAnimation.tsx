import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "../../LangContext";
import type { AnalysisResult } from "../../api";

/* ───────────── Types ───────────── */
type SceneId = 1 | 2 | 3 | 4 | 5 | 6;
type RiskLevel = "high" | "medium" | "low";
interface Props { result: AnalysisResult | null; onDone: () => void }

/* ───────────── Palette ───────────── */
const P = {
  bg: "#081E20", surf: "#123B3B", deep: "#0D2B2E", hover: "#1A4D4D",
  cool: "#2FBFB0", coolL: "#38D9CB", coolD: "#1C4E4D",
  warm: "#C81E3D", warmL: "#E14F5A", warmD: "#7A1F35",
  cream: "#F4F4F4", mist: "#9DBAB8", dim: "#6B8F8B", maroon: "#5A1526",
};

const RISK: Record<RiskLevel, { c: string; g: string }> = {
  high:   { c: "#C81E3D", g: "rgba(200,30,61,0.35)" },
  medium: { c: "#CC9E4A", g: "rgba(204,158,74,0.35)" },
  low:    { c: "#10B981", g: "rgba(16,185,129,0.35)" },
};

const DUR: Record<SceneId, number> = { 1: 1800, 2: 2600, 3: 2000, 4: 2400, 5: 2400, 6: 650 };
const NEXT: Record<SceneId, SceneId> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6 };

function getLevel(s: number): RiskLevel { return s >= 70 ? "high" : s >= 35 ? "medium" : "low"; }

/* ───────────── Count-up hook ───────────── */
function useCountUp(target: number, ms = 900, run = true) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let i = 0; const steps = 32;
    const id = setInterval(() => {
      i++; setV(Math.round(target * Math.min(1, i / steps)));
      if (i >= steps) clearInterval(id);
    }, ms / steps);
    return () => clearInterval(id);
  }, [target, ms, run]);
  return v;
}

/* ───────────── Shared SVG: File Icon ───────────── */
function FileIcon({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {glow && <rect x={-15} y={-20} width={30} height={40} rx={3} fill="none" stroke={P.cool} strokeWidth={0.4} opacity={0.3} style={{ filter: `drop-shadow(0 0 10px ${P.cool}50)` }} />}
      <rect x={-14} y={-19} width={28} height={38} rx={3} fill={P.surf} stroke={P.cool} strokeWidth={1.5} />
      <path d="M4,-19 L14,-9" fill="none" stroke={P.cool} strokeWidth={1} opacity={0.4} />
      <rect x={-8} y={-9} width={16} height={2.5} rx={1} fill={P.cool} opacity={0.55} />
      <rect x={-8} y={-3} width={12} height={2.5} rx={1} fill={P.cool} opacity={0.4} />
      <rect x={-8} y={3} width={14} height={2.5} rx={1} fill={P.cool} opacity={0.5} />
      <rect x={-8} y={9} width={9} height={2.5} rx={1} fill={P.cool} opacity={0.3} />
    </g>
  );
}

/* ───────────── Shared SVG: Taxi ───────────── */
function Taxi({ x, y, spin = true }: { x: number; y: number; spin?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <rect x={0} y={12} width={88} height={20} rx={5} fill={P.warmD} stroke={P.cream} strokeOpacity={0.25} strokeWidth={1} />
      {/* Cabin */}
      <path d="M16,12 L24,0 Q26,-2 29,-2 L59,-2 Q62,-2 64,0 L72,12" fill={P.deep} stroke={P.cream} strokeOpacity={0.25} strokeWidth={1} />
      {/* Windows */}
      <rect x={28} y={1} width={12} height={9} rx={1.5} fill={P.coolD} opacity={0.4} />
      <rect x={46} y={1} width={12} height={9} rx={1.5} fill={P.coolD} opacity={0.4} />
      {/* Checker band */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <rect key={i} x={7 + i * 11.5} y={20} width={5.5} height={5} rx={1} fill={P.cream} opacity={0.14} />
      ))}
      {/* Wheels */}
      {[20, 68].map(wx => (
        <g key={wx} transform={`translate(${wx},34)`}>
          <circle r={7} fill={P.bg} stroke={P.cream} strokeOpacity={0.3} strokeWidth={1} />
          {spin && (
            <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
              <line x1={-4} y1={0} x2={4} y2={0} stroke={P.cream} strokeOpacity={0.5} strokeWidth={1} />
              <line x1={0} y1={-4} x2={0} y2={4} stroke={P.cream} strokeOpacity={0.5} strokeWidth={1} />
            </motion.g>
          )}
          <circle r={2} fill={P.cream} opacity={0.35} />
        </g>
      ))}
      {/* Headlight */}
      <circle cx={88} cy={20} r={3} fill={P.cool} opacity={0.85} />
      <ellipse cx={100} cy={20} rx={14} ry={6} fill={P.cool} opacity={0.06} />
      {/* Taillight */}
      <rect x={-2} y={18} width={3} height={5} rx={1} fill={P.warmL} opacity={0.7} />
      {/* TAXI sign */}
      <rect x={34} y={-8} width={20} height={7} rx={2} fill={P.cream} opacity={0.85} />
      <text x={44} y={-2.5} textAnchor="middle" fontSize={5} fontWeight={700} fill={P.deep} letterSpacing={0.5}>TAXI</text>
    </g>
  );
}

/* ───────────── Shared SVG: Detective ───────────── */
function Detective({ x, y, sc = 1 }: { x: number; y: number; sc?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      {/* Coat */}
      <path d="M-14,-18 Q-18,6 -14,28 L14,28 Q18,6 14,-18 Z" fill={P.surf} stroke={P.cream} strokeOpacity={0.2} strokeWidth={1} />
      {/* Collar */}
      <path d="M-7,-18 L0,-10 L7,-18" fill="none" stroke={P.cream} strokeOpacity={0.2} strokeWidth={1} />
      {/* Scarf accent */}
      <path d="M-3,-17 L0,-11 L3,-17" fill={P.maroon} opacity={0.7} />
      {/* Head */}
      <circle cx={0} cy={-30} r={11} fill={P.deep} stroke={P.cream} strokeOpacity={0.22} strokeWidth={1} />
      {/* Visor (robot-detective) */}
      <rect x={-9} y={-33} width={18} height={5} rx={2.5} fill={P.cool} opacity={0.75} />
      {/* Fedora brim */}
      <ellipse cx={0} cy={-40} rx={15} ry={3} fill={P.bg} stroke={P.cream} strokeOpacity={0.28} strokeWidth={1} />
      {/* Fedora crown */}
      <rect x={-8} y={-52} width={16} height={13} rx={3} fill={P.bg} stroke={P.cream} strokeOpacity={0.28} strokeWidth={1} />
      {/* Hat band */}
      <rect x={-8} y={-42} width={16} height={3} fill={P.maroon} opacity={0.8} />
    </g>
  );
}

/* ───────────── Scene wrapper ───────────── */
function SceneWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
      <svg viewBox="0 0 640 360" className="w-full h-full" preserveAspectRatio="xMidYMid meet">{children}</svg>
    </motion.div>
  );
}

/* ═══════════════ SCENE 1 — Analysis Started ═══════════════ */
function Scene1() {
  return (
    <SceneWrap>
      <defs>
        <radialGradient id="s1glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={P.cool} stopOpacity={0.12} /><stop offset="100%" stopColor={P.cool} stopOpacity={0} /></radialGradient>
      </defs>
      {/* Grid lines */}
      {[80, 160, 240].map(yy => <line key={yy} x1={0} y1={yy} x2={640} y2={yy} stroke={P.cream} strokeOpacity={0.03} />)}
      {[160, 320, 480].map(xx => <line key={xx} x1={xx} y1={0} x2={xx} y2={360} stroke={P.cream} strokeOpacity={0.03} />)}
      {/* Ambient glow */}
      <circle cx={320} cy={160} r={160} fill="url(#s1glow)" />
      {/* File icon — appears center, then arcs into taxi */}
      <motion.g animate={{ y: [0, -6, 50], x: [0, 0, -62], scale: [0, 1, 0.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, times: [0, 0.35, 1], ease: "easeInOut", delay: 0.25 }}>
        <FileIcon x={278} y={130} />
      </motion.g>
      {/* Taxi slides in from left */}
      <motion.g animate={{ x: [-140, 0], y: [0, 2, 0] }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}>
        <Taxi x={220} y={230} spin />
      </motion.g>
      {/* Ground line */}
      <line x1={40} y1={300} x2={600} y2={300} stroke={P.cream} strokeOpacity={0.06} strokeWidth={1} />
      {/* Particle puff when file lands */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle key={i} cx={290 + (i - 2) * 8} cy={240} r={2} fill={P.cool} opacity={0}
          animate={{ opacity: [0, 0.8, 0], y: [0, -12 - i * 3], x: [(i - 2) * 6] }}
          transition={{ duration: 0.4, delay: 1.5 + i * 0.04 }} />
      ))}
    </SceneWrap>
  );
}

/* ═══════════════ SCENE 2 — Taxi Through City ═══════════════ */
const BG_B = [
  { x: 0, w: 65, h: 130 }, { x: 75, w: 50, h: 90 }, { x: 138, w: 78, h: 165 },
  { x: 228, w: 55, h: 105 }, { x: 298, w: 72, h: 145 }, { x: 382, w: 48, h: 85 },
  { x: 444, w: 82, h: 170 }, { x: 538, w: 60, h: 115 }, { x: 610, w: 55, h: 95 },
];
const MID_B = [
  { x: 10, w: 55, h: 100, wl: [[8, 30], [30, 50], [8, 70]] },
  { x: 80, w: 42, h: 75, wl: [[6, 25], [24, 45]] },
  { x: 140, w: 68, h: 130, wl: [[10, 30], [36, 50], [10, 80], [40, 90]] },
  { x: 226, w: 50, h: 90, wl: [[8, 35], [28, 55]] },
  { x: 296, w: 62, h: 120, wl: [[10, 28], [35, 52], [12, 80]] },
  { x: 376, w: 44, h: 80, wl: [[6, 30], [22, 52]] },
  { x: 438, w: 74, h: 140, wl: [[12, 30], [40, 55], [14, 88], [42, 100]] },
  { x: 530, w: 52, h: 95, wl: [[8, 28], [28, 50]] },
  { x: 600, w: 48, h: 110, wl: [[10, 35], [26, 60]] },
];

function Scene2() {
  return (
    <SceneWrap>
      <defs>
        <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#061618" /><stop offset="100%" stopColor={P.bg} /></linearGradient>
      </defs>
      <rect width={640} height={360} fill="url(#s2sky)" />
      {/* Moon */}
      <circle cx={540} cy={55} r={22} fill={P.coolD} opacity={0.35} />
      <circle cx={540} cy={55} r={30} fill={P.cool} opacity={0.04} />
      <circle cx={534} cy={48} r={3} fill={P.bg} opacity={0.5} />
      <circle cx={548} cy={58} r={2} fill={P.bg} opacity={0.4} />
      {/* Stars */}
      {[{ x: 80, y: 30 }, { x: 200, y: 18 }, { x: 350, y: 42 }, { x: 480, y: 22 }, { x: 120, y: 58 }].map((s, i) => (
        <motion.circle key={i} cx={s.x} cy={s.y} r={1} fill={P.cream} animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }} />
      ))}
      {/* BG buildings — slow scroll */}
      <motion.g animate={{ x: [0, -640] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        {[0, 640].map(off => BG_B.map(b => (
          <rect key={`${off}-${b.x}`} x={b.x + off} y={300 - b.h} width={b.w} height={b.h} fill={P.deep} opacity={0.7} />
        )))}
      </motion.g>
      {/* MID buildings — medium scroll with windows */}
      <motion.g animate={{ x: [0, -640] }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
        {[0, 640].map(off => MID_B.map(b => (
          <g key={`${off}-${b.x}`}>
            <rect x={b.x + off} y={300 - b.h} width={b.w} height={b.h} fill={P.surf} stroke={P.cream} strokeOpacity={0.08} strokeWidth={0.5} />
            {b.wl.map(([wx, wy], wi) => (
              <rect key={wi} x={b.x + off + wx} y={300 - b.h + wy} width={12} height={8} rx={1} fill={wi % 3 === 0 ? P.cool : P.cream} opacity={wi % 3 === 0 ? 0.2 : 0.07} />
            ))}
          </g>
        )))}
        {/* Environment icons on buildings — lens sign, shield */}
        {[0, 640].map(off => (
          <g key={`icons-${off}`}>
            {/* Lens icon on building at x≈160 */}
            <circle cx={172 + off} cy={210} r={6} fill="none" stroke={P.cool} strokeWidth={1.2} opacity={0.35} />
            <line x1={176 + off} y1={215} x2={182 + off} y2={221} stroke={P.cool} strokeWidth={1.2} opacity={0.35} />
            {/* Shield on building at x≈460 */}
            <path d={`M${460 + off},205 L${468 + off},208 L${468 + off},216 Q${468 + off},222 ${460 + off},225 Q${452 + off},222 ${452 + off},216 L${452 + off},208 Z`}
              fill="none" stroke={P.cream} strokeWidth={1} opacity={0.2} />
          </g>
        ))}
      </motion.g>
      {/* Road */}
      <rect x={0} y={295} width={640} height={65} fill={P.bg} />
      <line x1={0} y1={296} x2={640} y2={296} stroke={P.cream} strokeOpacity={0.06} />
      {/* Road dashes — fast scroll */}
      <motion.g animate={{ x: [0, -80] }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
        <line x1={-80} y1={326} x2={720} y2={326} stroke={P.cream} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="22 58" />
      </motion.g>
      {/* Taxi — bobbing */}
      <motion.g animate={{ y: [0, -2.5, 0], rotate: [0, -0.5, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box" as never, transformOrigin: "center" }}>
        <Taxi x={160} y={252} spin />
      </motion.g>
      {/* Speed lines */}
      {[0, 1, 2].map(i => (
        <motion.line key={i} x1={155 - i * 20} y1={268 + i * 5} x2={130 - i * 20} y2={268 + i * 5}
          stroke={P.cream} strokeWidth={1.2} strokeLinecap="round"
          animate={{ opacity: [0, 0.4, 0], x: [0, -20] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }} />
      ))}
      {/* Route line */}
      <path d="M260 306 C 350 306, 460 280, 555 230" fill="none" stroke={P.cool} strokeWidth={1.5} strokeDasharray="8 6" opacity={0.5} />
      <motion.circle r={3} fill={P.cool} opacity={0.9}
        animate={{ cx: [260, 555], cy: [306, 230] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        style={{ filter: `drop-shadow(0 0 4px ${P.cool})` }} />
      {/* TRUSTLENS HQ marker */}
      <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
        <rect x={530} y={212} width={80} height={20} rx={10} fill={P.surf} stroke={P.cool} strokeWidth={1} opacity={0.8} />
        <circle cx={544} cy={222} r={4} fill="none" stroke={P.cool} strokeWidth={1} />
        <line x1={547} y1={225} x2={551} y2={229} stroke={P.cool} strokeWidth={1} />
        <text x={558} y={226} fontSize={8} fill={P.cream} fontWeight={600} letterSpacing={0.8}>TRUSTLENS HQ</text>
      </motion.g>
    </SceneWrap>
  );
}

/* ═══════════════ SCENE 3 — Arrival ═══════════════ */
function Scene3() {
  return (
    <SceneWrap>
      <rect width={640} height={360} fill={P.bg} />
      {/* Ground */}
      <rect x={0} y={300} width={640} height={60} fill="#061618" />
      <line x1={0} y1={300} x2={640} y2={300} stroke={P.cream} strokeOpacity={0.06} />
      {/* Building — slides in */}
      <motion.g animate={{ x: [180, 0] }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        {/* Main block */}
        <rect x={370} y={108} width={190} height={192} rx={3} fill={P.surf} stroke={P.cream} strokeOpacity={0.15} strokeWidth={1} />
        {/* Crown steps */}
        <rect x={390} y={96} width={150} height={14} rx={2} fill={P.deep} stroke={P.cream} strokeOpacity={0.1} />
        <rect x={415} y={84} width={100} height={14} rx={2} fill={P.deep} stroke={P.cream} strokeOpacity={0.1} />
        {/* Windows */}
        {[0, 1, 2, 3].map(col => [0, 1, 2, 3].map(row => {
          const lit = (col + row) % 3 === 0;
          return <rect key={`${col}${row}`} x={388 + col * 42} y={120 + row * 36} width={28} height={18} rx={2}
            fill={lit ? P.cool : P.deep} opacity={lit ? 0.2 : 0.5} />;
        }))}
        {/* Awning sign */}
        <rect x={370} y={206} width={190} height={24} rx={2} fill={P.maroon} stroke={P.cream} strokeOpacity={0.2} />
        <text x={465} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill={P.cream} letterSpacing={3}>TRUSTLENS</text>
        {/* Door */}
        <rect x={432} y={260} width={66} height={40} rx={2} fill={P.bg} stroke={P.cool} strokeWidth={1} opacity={0.8} />
        <line x1={465} y1={262} x2={465} y2={300} stroke={P.cool} strokeOpacity={0.3} />
        {/* Door glow */}
        <motion.rect x={425} y={255} width={80} height={50} rx={4} fill={P.cool} opacity={0.08}
          animate={{ opacity: [0.04, 0.12, 0.04] }} transition={{ duration: 1.5, repeat: Infinity }} />
        {/* Lens neon above door */}
        <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
          <circle cx={465} cy={248} r={8} fill="none" stroke={P.cool} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 4px ${P.cool}80)` }} />
          <line x1={471} y1={254} x2={478} y2={261} stroke={P.cool} strokeWidth={1.8} />
        </motion.g>
        {/* Roof antenna */}
        <line x1={485} y1={84} x2={485} y2={60} stroke={P.cream} strokeOpacity={0.3} />
        <circle cx={485} cy={58} r={2} fill={P.warmL} opacity={0.6} />
      </motion.g>
      {/* Taxi arrives */}
      <motion.g animate={{ x: [-180, 0], y: [0, 1.5, 0] }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], times: [0, 0.85, 1] }}>
        <Taxi x={80} y={258} spin={false} />
      </motion.g>
      {/* Data particles streaming to door */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <motion.circle key={i} r={i % 2 === 0 ? 3 : 2} fill={i < 5 ? P.cool : P.cream}
          animate={{ cx: [130, 300 + i * 12, 462], cy: [238, 200 - i * 6, 278], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.6, delay: 0.75 + i * 0.06, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 3px ${P.cool})` }} />
      ))}
      {/* Camera zoom toward door in last 0.6s */}
    </SceneWrap>
  );
}

/* ═══════════════ SCENE 4 — Detective Investigation ═══════════════ */
function Scene4() {
  return (
    <SceneWrap>
      <rect width={640} height={360} fill={P.bg} />
      {/* Window blinds (noir touch) */}
      <rect x={30} y={25} width={70} height={50} rx={2} fill="none" stroke={P.cream} strokeOpacity={0.08} />
      {[0, 1, 2, 3, 4].map(i => <line key={i} x1={34} y1={34 + i * 9} x2={96} y2={34 + i * 9} stroke={P.cream} strokeOpacity={0.05} />)}
      <circle cx={80} cy={42} r={10} fill={P.cool} opacity={0.04} />
      {/* Server rack */}
      <rect x={568} y={50} width={40} height={100} rx={2} fill={P.deep} stroke={P.cream} strokeOpacity={0.08} />
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <rect x={574} y={58 + i * 18} width={28} height={12} rx={1} fill={P.bg} stroke={P.cool} strokeOpacity={0.1} />
          <motion.circle cx={596} cy={64 + i * 18} r={1.5} fill={P.cool}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }} />
        </g>
      ))}
      {/* Desk */}
      <rect x={120} y={256} width={380} height={8} rx={2} fill={P.surf} stroke={P.cream} strokeOpacity={0.1} />
      <rect x={140} y={264} width={8} height={96} fill={P.surf} opacity={0.5} />
      <rect x={480} y={264} width={8} height={96} fill={P.surf} opacity={0.5} />
      {/* Monitor */}
      <rect x={250} y={148} width={150} height={100} rx={5} fill={P.deep} stroke={P.cream} strokeOpacity={0.18} strokeWidth={1} />
      <rect x={310} y={248} width={30} height={10} rx={1} fill={P.surf} stroke={P.cream} strokeOpacity={0.08} />
      {/* Screen content */}
      <rect x={260} y={158} width={130} height={80} rx={2} fill="#061618" />
      <FileIcon x={280} y={185} s={0.6} glow={false} />
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={300} y={168 + i * 13} width={70 - i * 8} height={3} rx={1.5} fill={P.cool} opacity={0.2 + (i % 2) * 0.1} />
      ))}
      {/* Scan highlight */}
      <motion.rect x={258} y={160} width={22} height={76} fill={P.cool} opacity={0.08} rx={1}
        animate={{ x: [258, 366, 258] }} transition={{ duration: 1.8, repeat: 1, ease: "easeInOut", delay: 0.4 }} />
      {/* Red flag ticks — appear as scan passes */}
      {[{ x: 330, y: 175, d: 0.7 }, { x: 350, y: 200, d: 1.0 }, { x: 315, y: 220, d: 1.3 }].map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: f.d, duration: 0.25, type: "spring" }}>
          <circle cx={f.x} cy={f.y} r={4} fill={P.warm} opacity={0.8} />
          <text x={f.x} y={f.y + 2.5} textAnchor="middle" fontSize={6} fontWeight={700} fill={P.cream}>!</text>
        </motion.g>
      ))}
      {/* Detective seated */}
      <Detective x={195} y={228} sc={1.1} />
      {/* Magnifying glass — sweeps across screen */}
      <motion.g animate={{ x: [0, 100, 0] }} transition={{ duration: 1.8, repeat: 1, ease: "easeInOut", delay: 0.4 }}>
        <g transform="translate(260, 195)">
          <circle r={16} fill={P.cool} fillOpacity={0.08} stroke={P.cream} strokeWidth={2.2} />
          <line x1={11} y1={11} x2={22} y2={22} stroke={P.cream} strokeWidth={2.5} strokeOpacity={0.6} strokeLinecap="round" />
          {/* Glass shine */}
          <path d="M-6,-12 Q0,-14 6,-12" fill="none" stroke={P.cream} strokeOpacity={0.25} strokeWidth={1} />
        </g>
      </motion.g>
      {/* Ambient icons */}
      {/* Shield — top right */}
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M540,90 L548,94 L548,104 Q548,112 540,116 Q532,112 532,104 L532,94 Z" fill="none" stroke={P.cool} strokeWidth={1.2} />
      </motion.g>
      {/* Warning — pops in */}
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 300 }}>
        <path d="M545,135 L555,152 L535,152 Z" fill="none" stroke={P.warm} strokeWidth={1.2} />
        <text x={545} y={149} textAnchor="middle" fontSize={8} fontWeight={700} fill={P.warm}>!</text>
      </motion.g>
      {/* Code stream — right side */}
      <g transform="translate(580, 180)">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.rect key={i} x={i * 6} y={0} width={3} height={40} rx={1} fill={P.cool} opacity={0.1}
            animate={{ opacity: [0.05, 0.25, 0.05], height: [30, 50, 30] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </g>
      {/* Floor line */}
      <line x1={0} y1={300} x2={640} y2={300} stroke={P.cream} strokeOpacity={0.04} />
    </SceneWrap>
  );
}

/* ═══════════════ SCENE 5 — Risk Determination ═══════════════ */
function Scene5({ score }: { score: number }) {
  const { t } = useLang();
  const lv = getLevel(score);
  const c = RISK[lv];
  const display = useCountUp(score, 900, true);
  const C = 2 * Math.PI * 30; // circumference for r=30

  return (
    <SceneWrap>
      <rect width={640} height={360} fill={P.bg} />
      {/* Spotlight */}
      <circle cx={400} cy={180} r={140} fill={c.c} opacity={0.04} />
      {/* Desk + monitor (simplified continuity) */}
      <rect x={120} y={256} width={380} height={8} rx={2} fill={P.surf} stroke={P.cream} strokeOpacity={0.08} />
      <Detective x={195} y={228} sc={1.1} />
      {/* Detective nod */}
      <motion.g animate={{ y: [0, 3, 0] }} transition={{ delay: 1.2, duration: 0.4 }}>
        <Detective x={195} y={0} sc={0} /> {/* invisible — just triggers parent timing */}
      </motion.g>
      {/* Monitor dimmed */}
      <rect x={250} y={148} width={150} height={100} rx={5} fill={P.deep} stroke={P.cream} strokeOpacity={0.1} opacity={0.4} />
      {/* Verdict overlay — center-right */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingLeft: "22%" }}>
        {/* Mini ring gauge */}
        <motion.div className="relative" style={{ width: 96, height: 96 }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <svg viewBox="0 0 84 84" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={42} cy={42} r={30} fill="none" stroke={P.cream} strokeOpacity={0.08} strokeWidth={6} />
            <motion.circle cx={42} cy={42} r={30} fill="none" stroke={c.c} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (score / 100) * C }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              style={{ filter: `drop-shadow(0 0 6px ${c.g})` }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold tabular-nums" style={{ color: c.c }}>{display}</span>
          </div>
        </motion.div>
        {/* Level pill */}
        <motion.div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${c.c}18`, border: `1px solid ${c.c}40` }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.35 }}>
          {/* Level icon */}
          {lv === "high" ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={c.c} strokeWidth={2.5} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} /></svg>
          ) : lv === "medium" ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={c.c} strokeWidth={2.5} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2={12.01} y2={17} /></svg>
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={c.c} strokeWidth={2.5} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
          )}
          <span className="text-sm font-semibold tracking-wide" style={{ color: c.c }}>{t.riskLabels[lv]}</span>
        </motion.div>
      </motion.div>
    </SceneWrap>
  );
}

/* ═══════════════ SCENE 6 — Transition ═══════════════ */
function Scene6({ score }: { score: number }) {
  const lv = getLevel(score);
  const c = RISK[lv];
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 0.65, times: [0, 0.6, 1] }}>
      <motion.div className="rounded-2xl border-2 p-8 flex flex-col items-center gap-3"
        style={{ borderColor: `${c.c}60`, boxShadow: `0 0 50px ${c.g}`, background: "rgba(13,43,46,0.95)" }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1, 1.04], opacity: [0, 1, 1] }}
        transition={{ duration: 0.65, times: [0, 0.5, 1], ease: "easeOut" }}>
        {/* Ghost gauge */}
        <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: c.c }}>
          <span className="text-lg font-bold tabular-nums" style={{ color: c.c }}>{score}</span>
        </div>
        <div className="h-1.5 w-24 rounded-full" style={{ background: `${c.c}30` }} />
        <div className="h-1.5 w-16 rounded-full" style={{ background: `${c.c}18` }} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════ Full Animation (normal motion) ═══════════════ */
function FullPath({ result, onDone }: Props) {
  const { t } = useLang();
  const [scene, setScene] = useState<SceneId>(1);
  const [cityLoop, setCityLoop] = useState(0);
  const resultRef = useRef(result);
  resultRef.current = result;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const doneRef = useRef(false);
  const passStartRef = useRef(0);

  /* Main scene timer */
  useEffect(() => {
    if (doneRef.current) return;
    if (scene === 2) passStartRef.current = Date.now();

    const id = setTimeout(() => {
      if (scene === 2) {
        if (resultRef.current != null) setScene(3);
        else setCityLoop(l => l + 1);
      } else if (scene === 6) {
        if (!doneRef.current) { doneRef.current = true; onDoneRef.current(); }
      } else {
        setScene(NEXT[scene]);
      }
    }, DUR[scene]);
    return () => clearTimeout(id);
  }, [scene, cityLoop]);

  /* Shortening: when result arrives mid-scene-2 */
  useEffect(() => {
    if (scene === 2 && result != null) {
      const elapsed = Date.now() - passStartRef.current;
      const remaining = Math.max(50, DUR[2] - elapsed);
      const wait = Math.min(remaining, 900);
      const id = setTimeout(() => {
        if (!doneRef.current && resultRef.current != null) setScene(3);
      }, wait);
      return () => clearTimeout(id);
    }
  }, [scene, result]);

  const title = scene === 1 ? t.analyzing : scene === 5 ? t.analysisComplete : null;
  const caption: Record<number, string | null> = {
    1: t.animTransport, 2: t.animEnRoute, 3: t.animArrived, 4: t.animInvestigating, 5: null, 6: null,
  };
  const score = result?.riskScore ?? 0;

  return (
    <motion.div className="relative mt-6 w-full max-w-2xl mx-auto"
      exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.35 }}>
      <div className="relative overflow-hidden rounded-2xl border border-line/10"
        style={{ background: `linear-gradient(180deg, ${P.deep} 0%, ${P.bg} 100%)`,
                 boxShadow: `0 0 50px rgba(47,191,176,0.06), 0 16px 40px rgba(0,0,0,0.35)` }}>
        <div className="relative aspect-video">
          <AnimatePresence>
            {scene === 1 && <Scene1 key="s1" />}
            {scene === 2 && <Scene2 key="s2" />}
            {scene === 3 && <Scene3 key="s3" />}
            {scene === 4 && <Scene4 key="s4" />}
            {scene === 5 && <Scene5 key="s5" score={score} />}
            {scene === 6 && <Scene6 key="s6" score={score} />}
          </AnimatePresence>
          {/* Title overlay */}
          <AnimatePresence mode="wait">
            {title && (
              <motion.div key={`t-${scene}`}
                className="absolute top-5 inset-x-0 flex justify-center pointer-events-none"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}>
                <h3 className="text-txt text-sm font-semibold tracking-[0.3em] uppercase"
                  style={{ textShadow: `0 0 20px rgba(244,244,244,0.15)` }}>
                  {title}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Caption bar */}
        <div className="h-8 flex items-center justify-center border-t border-line/5">
          <AnimatePresence mode="wait">
            {caption[scene] && (
              <motion.p key={`c-${scene}`} className="text-xs text-txt-muted"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {caption[scene]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════ Reduced Motion Path ═══════════════ */
function ReducedPath({ result, onDone }: Props) {
  const { t } = useLang();
  const [phase, setPhase] = useState<"intro" | "verdict">("intro");
  const minElapsed = useRef(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => { const id = setTimeout(() => { minElapsed.current = true; }, 1600); return () => clearTimeout(id); }, []);

  useEffect(() => {
    if (phase === "intro" && result != null && minElapsed.current) {
      setPhase("verdict");
    }
  }, [result, phase]);

  useEffect(() => {
    if (phase === "verdict") {
      const id = setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onDoneRef.current(); } }, 2200);
      return () => clearTimeout(id);
    }
  }, [phase]);

  const score = result?.riskScore ?? 0;
  const lv = getLevel(score);
  const c = RISK[lv];

  return (
    <motion.div className="relative mt-6 w-full max-w-2xl mx-auto"
      exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="relative overflow-hidden rounded-2xl border border-line/10"
        style={{ background: P.bg, boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}>
        <div className="relative aspect-video flex items-center justify-center">
          {/* Intro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-500"
            style={{ opacity: phase === "intro" ? 1 : 0 }}>
            <h3 className="text-txt text-sm font-semibold tracking-[0.3em] uppercase">{t.analyzing}</h3>
            <svg viewBox="0 0 60 60" width={48} height={48}>
              <rect x={8} y={4} width={44} height={52} rx={4} fill={P.surf} stroke={P.cool} strokeWidth={1.5} />
              <rect x={16} y={16} width={28} height={3} rx={1.5} fill={P.cool} opacity={0.5} />
              <rect x={16} y={24} width={20} height={3} rx={1.5} fill={P.cool} opacity={0.35} />
              <rect x={16} y={32} width={24} height={3} rx={1.5} fill={P.cool} opacity={0.45} />
            </svg>
            <p className="text-xs text-txt-muted">{t.animTransport}</p>
          </div>
          {/* Verdict */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-500"
            style={{ opacity: phase === "verdict" ? 1 : 0 }}>
            <h3 className="text-txt text-sm font-semibold tracking-[0.3em] uppercase">{t.analysisComplete}</h3>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full"
              style={{ background: `${c.c}18`, border: `1px solid ${c.c}40` }}>
              <span className="text-xl font-bold tabular-nums" style={{ color: c.c }}>{score}</span>
              <span className="text-sm font-semibold" style={{ color: c.c }}>{t.riskLabels[lv]}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════ Export ═══════════════ */
export default function AnalysisAnimation(props: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <ReducedPath {...props} />;
  return <FullPath {...props} />;
}
