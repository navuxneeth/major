import { motion } from "motion/react";
import type { CategoryId } from "./data";

/* Hand-made vector illustrations. One ink line weight, flat fills from the palette,
   gentle motion. Every piece respects prefers-reduced-motion through motion's defaults. */

const INK = "#1E1C19";
const S = { stroke: INK, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ---------- Home hero: the almirah opens, papers float out, the phone glows ---------- */
export function HeroScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden>
      <motion.ellipse cx="100" cy="160" rx="80" ry="7" fill="rgba(0,0,0,0.18)" initial={{ scaleX: 0.6 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
      {/* almirah body */}
      <rect x="52" y="22" width="96" height="132" rx="5" fill="#DDE3E7" {...S} />
      <path d="M52 66 H148 M52 108 H148" {...S} />
      <rect x="62" y="38" width="12" height="28" rx="2" fill="#B8473B" {...S} />
      <rect x="78" y="38" width="12" height="28" rx="2" fill="#D9822B" {...S} />
      <rect x="62" y="80" width="12" height="28" rx="2" fill="#3E8E5A" {...S} />
      <rect x="78" y="80" width="12" height="28" rx="2" fill="#3F6FB0" {...S} />
      <rect x="112" y="118" width="28" height="30" rx="2" fill="#8E9AA3" {...S} />
      <circle cx="126" cy="133" r="4" fill="none" {...S} />
      {/* doors swing open */}
      <motion.g style={{ transformOrigin: "52px 88px" }} initial={{ scaleX: 1 }} animate={{ scaleX: 0.14 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}>
        <rect x="52" y="22" width="48" height="132" rx="4" fill="#AEB8BF" {...S} />
        <rect x="88" y="80" width="4" height="16" rx="2" fill={INK} />
      </motion.g>
      <motion.g style={{ transformOrigin: "148px 88px" }} initial={{ scaleX: 1 }} animate={{ scaleX: 0.14 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
        <rect x="100" y="22" width="48" height="132" rx="4" fill="#AEB8BF" {...S} />
        <rect x="108" y="80" width="4" height="16" rx="2" fill={INK} />
      </motion.g>
      {/* papers float out */}
      {[
        { x: 18, y: 30, r: -12, c: "#FFFFFF", d: 1.3 },
        { x: 154, y: 14, r: 10, c: "#FBEBCD", d: 1.5 },
        { x: 160, y: 70, r: 16, c: "#DCE9F7", d: 1.7 },
      ].map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 30, x: 100 - p.x - 12, rotate: 0 }} animate={{ opacity: 1, y: [0, -4, 0], x: 0, rotate: p.r }}
          transition={{ opacity: { delay: p.d, duration: 0.4 }, x: { delay: p.d, duration: 0.7, ease: "easeOut" }, rotate: { delay: p.d, duration: 0.7 }, y: { delay: p.d + 0.7, duration: 3 + i, repeat: Infinity, ease: "easeInOut" } }}
          style={{ transformOrigin: `${p.x + 12}px ${p.y + 15}px` }}>
          <rect x={p.x} y={p.y} width="24" height="30" rx="3" fill={p.c} {...S} />
          <path d={`M${p.x + 5} ${p.y + 9} h14 M${p.x + 5} ${p.y + 15} h10 M${p.x + 5} ${p.y + 21} h12`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>
      ))}
      {/* phone with a glowing pin */}
      <motion.g initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
        <rect x="8" y="92" width="34" height="58" rx="6" fill="#1E5B4F" {...S} />
        <rect x="13" y="100" width="24" height="40" rx="3" fill="#FAF7F1" />
        <motion.circle cx="25" cy="116" r="6" fill="#E8A33D" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: "25px 116px" }} />
        <path d="M17 128 h16 M17 133 h10" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>
      <motion.path d="M42 112 C 58 100, 66 96, 74 70" fill="none" stroke="#E8A33D" strokeWidth="2.4" strokeDasharray="4 5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.9 }} />
    </svg>
  );
}

/* ---------- Folder illustrations ---------- */
export function CatArt({ id, className = "h-14 w-14" }: { id: CategoryId; className?: string }) {
  const art: Record<CategoryId, JSX.Element> = {
    identity: (
      <>
        <rect x="8" y="16" width="48" height="34" rx="5" fill="#FFFFFF" {...S} />
        <rect x="8" y="16" width="48" height="8" rx="4" fill="#3F6FB0" {...S} />
        <circle cx="21" cy="35" r="6" fill="#F3D9C4" {...S} />
        <path d="M32 33 h16 M32 40 h11" {...S} />
      </>
    ),
    health: (
      <>
        <path d="M32 54 C 10 40, 6 26, 14 18 C 21 11, 29 14, 32 21 C 35 14, 43 11, 50 18 C 58 26, 54 40, 32 54 Z" fill="#F08C7A" {...S} />
        <path d="M14 33 h10 l4 -7 l5 13 l4 -6 h13" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    money: (
      <>
        <path d="M8 26 L32 12 L56 26 Z" fill="#E8A33D" {...S} />
        <path d="M14 30 v16 M24 30 v16 M40 30 v16 M50 30 v16" {...S} />
        <rect x="8" y="46" width="48" height="7" rx="2" fill="#3E8E5A" {...S} />
        <circle cx="32" cy="22" r="3" fill="#FFFFFF" {...S} />
      </>
    ),
    home: (
      <>
        <path d="M10 30 L32 12 L54 30" fill="none" {...S} />
        <rect x="16" y="28" width="32" height="26" rx="2" fill="#F7E7B4" {...S} />
        <rect x="27" y="38" width="10" height="16" rx="1" fill="#B8473B" {...S} />
        <rect x="38" y="14" width="7" height="10" fill="#FFFFFF" {...S} />
      </>
    ),
    vehicle: (
      <>
        <path d="M8 42 v-8 l8 -12 h28 l10 12 v8 Z" fill="#8E7CC3" {...S} />
        <path d="M18 24 h24 l6 10 H14 Z" fill="#DCE9F7" {...S} />
        <circle cx="20" cy="44" r="6" fill="#FFFFFF" {...S} />
        <circle cx="44" cy="44" r="6" fill="#FFFFFF" {...S} />
      </>
    ),
    work: (
      <>
        <rect x="8" y="22" width="48" height="30" rx="5" fill="#D9822B" {...S} />
        <path d="M24 22 v-6 h16 v6" fill="none" {...S} />
        <path d="M8 34 h48" {...S} />
        <rect x="28" y="30" width="8" height="8" rx="1.5" fill="#FFFFFF" {...S} />
      </>
    ),
    travel: (
      <>
        <rect x="14" y="10" width="36" height="38" rx="8" fill="#3F9AA6" {...S} />
        <rect x="20" y="16" width="24" height="12" rx="2" fill="#DCF0F2" {...S} />
        <circle cx="22" cy="38" r="3" fill="#FFFFFF" {...S} />
        <circle cx="42" cy="38" r="3" fill="#FFFFFF" {...S} />
        <path d="M18 48 l-6 8 M46 48 l6 8 M10 56 h44" {...S} />
      </>
    ),
  };
  return <svg viewBox="0 0 64 64" className={className} aria-hidden>{art[id]}</svg>;
}

/* ---------- Ready-for illustrations ---------- */
export function ReadyArt({ id, className = "h-16 w-20" }: { id: string; className?: string }) {
  const art: Record<string, JSX.Element> = {
    hospital: (
      <>
        <rect x="14" y="16" width="52" height="40" rx="3" fill="#FFFFFF" {...S} />
        <rect x="30" y="6" width="20" height="14" rx="2" fill="#F08C7A" {...S} />
        <path d="M40 9 v8 M36 13 h8" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="22" y="26" width="8" height="8" fill="#DCE9F7" {...S} />
        <rect x="50" y="26" width="8" height="8" fill="#DCE9F7" {...S} />
        <rect x="34" y="40" width="12" height="16" fill="#F9DCD5" {...S} />
      </>
    ),
    train: (
      <>
        <rect x="16" y="8" width="48" height="40" rx="9" fill="#3F9AA6" {...S} />
        <rect x="23" y="15" width="34" height="14" rx="2" fill="#DCF0F2" {...S} />
        <circle cx="28" cy="38" r="3.5" fill="#FFFFFF" {...S} />
        <circle cx="52" cy="38" r="3.5" fill="#FFFFFF" {...S} />
        <path d="M22 48 l-6 9 M58 48 l6 9 M8 57 h64" {...S} />
      </>
    ),
    bank: (
      <>
        <path d="M10 22 L40 6 L70 22 Z" fill="#E8A33D" {...S} />
        <path d="M18 26 v20 M30 26 v20 M50 26 v20 M62 26 v20" {...S} />
        <rect x="10" y="46" width="60" height="8" rx="2" fill="#3E8E5A" {...S} />
      </>
    ),
    pension: (
      <>
        <rect x="16" y="8" width="40" height="48" rx="3" fill="#FFFFFF" {...S} />
        <path d="M24 20 h24 M24 28 h18 M24 36 h22" {...S} />
        <circle cx="56" cy="46" r="11" fill="#E8A33D" {...S} />
        <path d="M51 46 l4 4 l7 -8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };
  return <svg viewBox="0 0 80 62" className={className} aria-hidden>{art[id]}</svg>;
}

/* ---------- Show me how: a phone with a glowing ring and a voice ---------- */
export function HelpArt({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect x="34" y="12" width="52" height="96" rx="10" fill="#1E5B4F" {...S} />
      <rect x="40" y="22" width="40" height="72" rx="4" fill="#FAF7F1" />
      <rect x="46" y="30" width="28" height="8" rx="3" fill="#E7E1D6" />
      <rect x="46" y="44" width="28" height="8" rx="3" fill="#E7E1D6" />
      <rect x="46" y="66" width="28" height="12" rx="4" fill="#1E5B4F" />
      <motion.circle cx="60" cy="72" r="12" fill="none" stroke="#E8A33D" strokeWidth="3"
        animate={{ scale: [1, 1.45], opacity: [1, 0] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ transformOrigin: "60px 72px" }} />
      <circle cx="60" cy="72" r="12" fill="none" stroke="#E8A33D" strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${92 + i * 7} ${52 - i * 4} q${6 + i * 2} ${8 + i * 4} 0 ${16 + i * 8}`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"
          animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </svg>
  );
}

/* ---------- Lend my phone: two phones, one bridge, a timer ---------- */
export function LendArt({ className = "h-28 w-40", live = false }: { className?: string; live?: boolean }) {
  return (
    <svg viewBox="0 0 170 110" className={className} aria-hidden>
      <rect x="10" y="14" width="44" height="80" rx="9" fill="#1E5B4F" {...S} />
      <rect x="16" y="24" width="32" height="58" rx="3" fill="#FAF7F1" />
      <rect x="116" y="14" width="44" height="80" rx="9" fill="#5B7FB5" {...S} />
      <rect x="122" y="24" width="32" height="58" rx="3" fill="#FAF7F1" />
      <motion.path d="M54 50 C 80 20, 92 20, 116 50" fill="none" stroke="#E8A33D" strokeWidth="3" strokeDasharray="5 6" strokeLinecap="round"
        animate={live ? { strokeDashoffset: [0, -22] } : { pathLength: [0, 1] }}
        transition={live ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 1.2 }} />
      <circle cx="85" cy="70" r="14" fill="#FFFFFF" {...S} />
      <path d="M85 62 v8 l5 4" fill="none" {...S} />
      <rect x="22" y="70" width="20" height="6" rx="3" fill="#B3412E" />
    </svg>
  );
}

/* ---------- Family circle ---------- */
export function FamilyArt({ className = "h-24 w-40" }: { className?: string }) {
  const people = [
    { x: 30, y: 52, c: "#E8A33D" },
    { x: 70, y: 40, c: "#5B7FB5" },
    { x: 110, y: 52, c: "#1E5B4F" },
    { x: 150, y: 40, c: "#B5577A" },
  ];
  return (
    <svg viewBox="0 0 180 96" className={className} aria-hidden>
      <motion.path d="M30 52 Q 50 20 70 40 T 110 52 T 150 40" fill="none" stroke="#E8A33D" strokeWidth="2.4" strokeDasharray="4 5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {people.map((p, i) => (
        <motion.g key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 * i }}>
          <circle cx={p.x} cy={p.y} r="12" fill={p.c} {...S} />
          <path d={`M${p.x - 14} ${p.y + 34} q14 -24 28 0`} fill={p.c} {...S} />
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------- Success burst ---------- */
export function SuccessBurst({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <motion.line key={i} x1={60 + Math.cos(a) * 34} y1={60 + Math.sin(a) * 34} x2={60 + Math.cos(a) * 50} y2={60 + Math.sin(a) * 50}
            stroke={i % 2 ? "#E8A33D" : "#1E5B4F"} strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 0] }} transition={{ delay: 0.25, duration: 0.8 }} />
        );
      })}
      <motion.circle cx="60" cy="60" r="28" fill="#1E5B4F" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} style={{ transformOrigin: "60px 60px" }} />
      <motion.path d="M47 61 l9 9 l18 -19" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
    </svg>
  );
}

/* ---------- Soft background blobs for hero cards ---------- */
export function Blobs({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="none" className={className} aria-hidden>
      <motion.circle cx="340" cy="30" r="90" fill="rgba(255,255,255,0.08)" animate={{ cy: [30, 42, 30] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.circle cx="60" cy="210" r="70" fill="rgba(232,163,61,0.18)" animate={{ cx: [60, 74, 60] }} transition={{ duration: 9, repeat: Infinity }} />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={20 + (i % 8) * 22} cy={18 + Math.floor(i / 8) * 22} r="1.6" fill="rgba(255,255,255,0.22)" />
      ))}
    </svg>
  );
}

/* ---------- A real-looking file folder, in the same colour as the family's almirah files ---------- */
export const FOLDER_COLOR: Record<CategoryId, { body: string; tab: string; text: string }> = {
  identity: { body: "#E39A45", tab: "#C97E2A", text: "#2A1A08" },
  health: { body: "#4673B3", tab: "#3F6FB0", text: "#FFFFFF" },
  money: { body: "#3F8A5A", tab: "#3E8E5A", text: "#FFFFFF" },
  home: { body: "#B9524A", tab: "#B8473B", text: "#FFFFFF" },
  vehicle: { body: "#7A7784", tab: "#7D7D7D", text: "#FFFFFF" },
  work: { body: "#E4C254", tab: "#D8B23A", text: "#2A2208" },
  travel: { body: "#2F8790", tab: "#3F9AA6", text: "#FFFFFF" },
};

export function FolderTile({ id, label, count, onClick, index = 0 }: { id: CategoryId; label: string; count: string; onClick: () => void; index?: number }) {
  const c = FOLDER_COLOR[id];
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * index, type: "spring", stiffness: 260, damping: 22 }}
      whileTap="open" whileHover="open"
      className="relative block h-32 w-full text-left"
      aria-label={`${label}, ${count}`}
      style={{ perspective: 600 }}
    >
      {/* back of the folder with its tab */}
      <span className="absolute top-0 left-0 h-6 w-[46%] rounded-t-xl" style={{ background: c.tab }} />
      <span className="absolute inset-x-0 top-4 bottom-0 rounded-2xl rounded-tl-none" style={{ background: c.tab }} />
      {/* papers inside, they rise when touched */}
      <motion.span className="absolute inset-x-3 top-6 h-16 rounded-lg border border-black/10 bg-white" variants={{ open: { y: -10, rotate: -2 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
        <span className="absolute top-2.5 left-3 h-1.5 w-16 rounded-full bg-hair" />
        <span className="absolute top-5 left-3 h-1.5 w-10 rounded-full bg-hair" />
      </motion.span>
      <motion.span className="absolute inset-x-5 top-8 h-14 rounded-lg border border-black/10 bg-[#FFFDF6]" variants={{ open: { y: -16, rotate: 3 } }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.03 }} />
      {/* front flap tilts open */}
      <motion.span
        className="absolute inset-x-0 bottom-0 flex h-[72%] origin-bottom flex-col justify-between rounded-2xl px-3 py-2.5 shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.25)]"
        style={{ background: c.body, color: c.text }}
        variants={{ open: { rotateX: 14 } }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <span className="text-[1.05rem] leading-tight font-semibold">{label}</span>
        <span className="flex items-center justify-between">
          <span className="text-[0.88rem] opacity-85">{count}</span>
          <span className="h-2 w-8 rounded-full" style={{ background: "rgba(255,255,255,0.45)" }} />
        </span>
      </motion.span>
    </motion.button>
  );
}

/* ---------- Frosted-glass folder with real papers peeking out (Apple-style) ---------- */
export type PeekPaper = { tone: "plain" | "due" | "verified" | "paper"; tilt: number };

const PEEK_STYLE: Record<PeekPaper["tone"], { bg: string; dot: string; icon: "check" | "clock" | "q" | "lines" }> = {
  plain: { bg: "#FFFFFF", dot: "#E7E7EA", icon: "lines" },
  due: { bg: "#F7D27A", dot: "#E2A93A", icon: "clock" },
  verified: { bg: "#FFFFFF", dot: "#34C759", icon: "check" },
  paper: { bg: "#F0EEE8", dot: "#B9B4AA", icon: "q" },
};

export function GlassFolder({ id, label, count, papers, onClick, index = 0, place }: {
  id: CategoryId; label: string; count: number; papers: PeekPaper[]; onClick: () => void; index?: number; place?: { color: string; text: string };
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 240, damping: 22 }}
      whileTap="open" whileHover="open"
      className="flex w-full flex-col items-center text-left"
      aria-label={`${label}, ${count}`}
    >
      <span className="relative block h-[150px] w-full">
        {/* back panel with tab */}
        <span className="absolute top-[26px] left-0 h-5 w-[44%] rounded-t-[14px] bg-[#E4E4E8]" />
        <span className="absolute inset-x-0 top-[38px] bottom-0 rounded-[24px] bg-[#E4E4E8]" />
        {/* papers */}
        {papers.slice(0, 3).map((p, i) => {
          const s = PEEK_STYLE[p.tone];
          const left = 9 + i * 15;
          return (
            <motion.span key={i}
              className="absolute top-[6px] h-[78px] w-[52%] rounded-[10px] border border-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
              style={{ left: `${left}%`, background: s.bg, rotate: p.tilt, zIndex: i + 1 }}
              variants={{ open: { y: -12 - i * 3, rotate: p.tilt * 1.6 } }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}>
              <span className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: s.dot }}>
                {s.icon === "check" && <svg viewBox="0 0 12 12" className="h-3 w-3"><path d="M3 6.2 5.2 8.4 9 4" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {s.icon === "clock" && <svg viewBox="0 0 12 12" className="h-3 w-3"><circle cx="6" cy="6" r="3.6" stroke="#fff" strokeWidth="1.4" fill="none" /><path d="M6 4.2V6l1.2.9" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>}
                {s.icon === "q" && <span className="text-[9px] font-bold text-white">?</span>}
              </span>
              <span className="absolute top-3 right-3 h-1.5 w-8 rounded-full bg-black/10" />
            </motion.span>
          );
        })}
        {/* frosted front */}
        <motion.span
          className="glass absolute inset-x-0 bottom-0 z-10 h-[96px] origin-bottom rounded-[24px]"
          variants={{ open: { rotateX: 10 } }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ transformPerspective: 500 }}
        >
          {place && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-0.5 text-[0.72rem] font-semibold text-ink/70">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: place.color }} />{place.text}
            </span>
          )}
          <span className="sticker absolute right-3 bottom-2.5 block" style={{ transform: "rotate(-8deg)" }}>
            <CatArt id={id} className="h-12 w-12" />
          </span>
        </motion.span>
      </span>
      <span className="mt-2.5 block w-full text-center text-[1.02rem] leading-snug font-semibold">
        {label} <span className="ml-1 inline-block rounded-full bg-card px-2 py-0.5 align-middle text-[0.82rem] font-semibold text-mute">{count}</span>
      </span>
    </motion.button>
  );
}
