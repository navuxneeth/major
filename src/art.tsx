import { motion } from "motion/react";
import type { Doc, FileBox, Place, Person } from "./data";

/* ------------------------------------------------------------------ */
/* Document illustrations. Generic and clearly marked SAMPLE: they are */
/* not copies of any real government design.                          */
/* ------------------------------------------------------------------ */

const INK = "#1E1C19";

function maskNum(n?: string, masked?: boolean) {
  if (!n) return "";
  if (!masked) return n;
  const digits = n.replace(/\s/g, "");
  return "XXXX XXXX " + digits.slice(-4);
}

export function DocArt({ doc, masked = false, ownerName = "", className = "" }: { doc: Doc; masked?: boolean; ownerName?: string; className?: string }) {
  if (doc.image) {
    return (
      <div className={`overflow-hidden rounded-xl bg-white ${className}`}>
        <img src={doc.image} alt={doc.title} className="h-full w-full object-contain" />
      </div>
    );
  }
  return <svg viewBox="0 0 320 210" className={className} role="img" aria-label={doc.title}>{renderArt(doc, masked, ownerName)}</svg>;
}

/** Plain SVG string, used to make the watermarked share image. */
export function renderArt(doc: Doc, masked: boolean, ownerName: string) {
  const name = ownerName || "";
  const sample = (
    <text x="300" y="200" textAnchor="end" fontSize="9" fontFamily="Hind, sans-serif" fill="#9A9488" letterSpacing="1">SAMPLE</text>
  );
  const photo = (x: number, y: number, c = "#C9C2B4") => (
    <g>
      <rect x={x} y={y} width="56" height="68" rx="6" fill="#EFEAE0" />
      <circle cx={x + 28} cy={y + 26} r="12" fill={c} />
      <path d={`M${x + 8} ${y + 64} q20 -26 40 0`} fill={c} />
    </g>
  );
  const lines = (x: number, y: number, n: number, w = 150, gap = 16) =>
    Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={y + i * gap} width={w - (i % 3) * 22} height="6" rx="3" fill="#E2DCD0" />);

  switch (doc.art) {
    case "aadhaar":
      return (
        <g fontFamily="Hind, sans-serif">
          <rect width="320" height="210" rx="14" fill="#FFFDF8" stroke="#E2DACB" />
          <rect width="320" height="10" rx="5" fill="#E89A3C" />
          <rect y="200" width="320" height="10" rx="5" fill="#3E8E5A" />
          <text x="20" y="38" fontSize="17" fontWeight="700" fill={INK}>Aadhaar</text>
          <text x="20" y="54" fontSize="10" fill="#6B665E">Unique identity (sample)</text>
          {photo(20, 70)}
          <text x="92" y="88" fontSize="15" fontWeight="600" fill={INK}>{name}</text>
          <text x="92" y="106" fontSize="11" fill="#6B665E">DOB: XX/XX/19XX</text>
          <text x="160" y="178" fontSize="22" fontWeight="700" textAnchor="middle" fill={INK} letterSpacing="2">{maskNum(doc.number, masked)}</text>
          {sample}
        </g>
      );
    case "pan":
      return (
        <g fontFamily="Hind, sans-serif">
          <rect width="320" height="210" rx="14" fill="#EAF1FA" stroke="#C9D8EC" />
          <text x="20" y="36" fontSize="17" fontWeight="700" fill="#24477A">PAN</text>
          <text x="20" y="52" fontSize="10" fill="#5A6B85">Permanent account number (sample)</text>
          {photo(240, 64, "#B9C6DA")}
          <text x="20" y="90" fontSize="11" fill="#5A6B85">Name</text>
          <text x="20" y="108" fontSize="16" fontWeight="600" fill={INK}>{name}</text>
          <text x="20" y="140" fontSize="11" fill="#5A6B85">Number</text>
          <text x="20" y="164" fontSize="22" fontWeight="700" fill={INK} letterSpacing="2">{masked && doc.number ? "XXXXX" + doc.number.slice(5) : doc.number}</text>
          {sample}
        </g>
      );
    case "voter":
    case "card":
    case "licence":
      return (
        <g fontFamily="Hind, sans-serif">
          <rect width="320" height="210" rx="14" fill={doc.art === "licence" ? "#F2F7EC" : doc.art === "voter" ? "#F6EEF7" : "#FBF3E6"} stroke="#E2DACB" />
          <rect x="0" y="0" width="320" height="46" rx="14" fill={doc.art === "licence" ? "#5E8D4E" : doc.art === "voter" ? "#7C5A93" : "#B8742F"} />
          <rect x="0" y="30" width="320" height="16" fill={doc.art === "licence" ? "#5E8D4E" : doc.art === "voter" ? "#7C5A93" : "#B8742F"} />
          <text x="20" y="30" fontSize="15" fontWeight="700" fill="#fff">{doc.title.toUpperCase().slice(0, 28)}</text>
          {photo(20, 62)}
          <text x="92" y="80" fontSize="15" fontWeight="600" fill={INK}>{name}</text>
          {lines(92, 96, 4, 180, 15)}
          {sample}
        </g>
      );
    case "passport":
      return (
        <g fontFamily="Hind, sans-serif">
          <rect x="70" y="0" width="180" height="210" rx="10" fill="#22325A" />
          <circle cx="160" cy="92" r="30" fill="none" stroke="#D9B65C" strokeWidth="2" />
          <circle cx="160" cy="92" r="18" fill="none" stroke="#D9B65C" strokeWidth="1.5" />
          <text x="160" y="160" textAnchor="middle" fontSize="16" fontWeight="700" fill="#D9B65C" letterSpacing="3">PASSPORT</text>
          <text x="160" y="182" textAnchor="middle" fontSize="11" fill="#C9D2E8">{name}</text>
          <text x="244" y="202" textAnchor="end" fontSize="9" fill="#8C97B5" letterSpacing="1">SAMPLE</text>
        </g>
      );
    case "passbook":
      return (
        <g fontFamily="Hind, sans-serif">
          <rect x="40" y="6" width="240" height="198" rx="10" fill={doc.category === "home" ? "#C25B3C" : "#2F6B4E"} />
          <rect x="52" y="18" width="216" height="174" rx="6" fill="none" stroke="rgba(255,255,255,0.35)" />
          <text x="160" y="92" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">{doc.title.length > 22 ? doc.title.slice(0, 22) + "…" : doc.title}</text>
          <text x="160" y="118" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.85)">{name}</text>
          <text x="268" y="186" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.6)" letterSpacing="1">SAMPLE</text>
        </g>
      );
    default: {
      // paper-like: report, prescription, policy, paper, photo
      const head = doc.art === "report" ? "#C94F4F" : doc.art === "prescription" ? "#3F6FB0" : doc.art === "policy" ? "#2F6B4E" : "#7A6A55";
      return (
        <g fontFamily="Hind, sans-serif">
          <rect x="70" y="2" width="180" height="206" rx="6" fill="#FFFFFF" stroke="#E2DACB" />
          <rect x="70" y="2" width="180" height="34" rx="6" fill={head} />
          <rect x="70" y="26" width="180" height="10" fill={head} />
          <text x="160" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">{doc.title.length > 26 ? doc.title.slice(0, 26) + "…" : doc.title}</text>
          <text x="84" y="56" fontSize="11" fontWeight="600" fill={INK}>{name}</text>
          {doc.art === "prescription" && <text x="84" y="84" fontSize="22" fontWeight="700" fill={head}>℞</text>}
          {lines(84, doc.art === "prescription" ? 96 : 70, doc.art === "report" ? 6 : 7, 150, 15)}
          {doc.art === "report" && <rect x="84" y="166" width="80" height="18" rx="4" fill="#F8E1DB" />}
          <text x="244" y="202" textAnchor="end" fontSize="9" fill="#9A9488" letterSpacing="1">SAMPLE</text>
        </g>
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* Where the original is: the family's own almirah, drawn as a map     */
/* ------------------------------------------------------------------ */

export function PlaceView({ place, files, highlight, onPickSpot, onPickFile, compact = false, person }: {
  place: Place;
  files: FileBox[];
  highlight?: string | null; // file id
  onPickSpot?: (spotId: string) => void;
  onPickFile?: (fileId: string) => void;
  compact?: boolean;
  person?: Person;
}) {
  const hl = files.find((f) => f.id === highlight);
  const spines = (spotId: string, x0: number, yBase: number, h: number, maxW: number) => {
    const list = files.filter((f) => f.placeId === place.id && f.spotId === spotId);
    const w = 18;
    return list.map((f, i) => {
      const x = x0 + i * (w + 6);
      if (x + w > x0 + maxW) return null;
      const on = f.id === highlight;
      return (
        <g key={f.id} onClick={onPickFile ? (e) => { e.stopPropagation(); onPickFile(f.id); } : undefined} style={{ cursor: onPickFile ? "pointer" : undefined }}>
          {on && <circle cx={x + w / 2} cy={yBase - h / 2} r="22" fill={f.color} opacity="0.35" className="pulse-ring" />}
          <rect x={x} y={yBase - h} width={w} height={h} rx="3" fill={f.color} stroke={on ? INK : "rgba(0,0,0,0.15)"} strokeWidth={on ? 2.5 : 1} />
          <rect x={x + 4} y={yBase - h + 8} width={w - 8} height="12" rx="2" fill="rgba(255,255,255,0.75)" />
        </g>
      );
    });
  };
  const spotRect = (spotId: string, x: number, y: number, w: number, h: number) => {
    const isOn = hl && hl.spotId === spotId;
    return (
      <rect
        x={x} y={y} width={w} height={h} rx="4"
        fill={isOn ? "rgba(232,163,61,0.18)" : "transparent"}
        stroke={isOn ? "#E8A33D" : "transparent"} strokeWidth="2" strokeDasharray={isOn ? "5 4" : undefined}
        onClick={onPickSpot ? () => onPickSpot(spotId) : undefined}
        style={{ cursor: onPickSpot ? "pointer" : undefined }}
      />
    );
  };

  if (place.kind === "person") {
    return (
      <svg viewBox="0 0 300 200" className={compact ? "h-28 w-full" : "h-52 w-full"}>
        <circle cx="150" cy="80" r="46" fill={person?.color ?? "#1E5B4F"} />
        <text x="150" y="96" textAnchor="middle" fontSize="44" fontWeight="700" fill="#fff" fontFamily="Hind, sans-serif">{(person?.name ?? "?")[0]}</text>
        <rect x="190" y="104" width="54" height="40" rx="5" fill={hl?.color ?? "#1E5B4F"} stroke={INK} strokeWidth="2" />
        <path d="M190 112 h54" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <circle cx="217" cy="124" r="26" fill="#E8A33D" opacity="0.3" className="pulse-ring" />
        <text x="150" y="170" textAnchor="middle" fontSize="15" fill="#5F5A52" fontFamily="Hind, sans-serif">{person ? `${person.city}` : ""}</text>
      </svg>
    );
  }

  if (place.kind === "drawer") {
    const s = hl?.spotId;
    return (
      <svg viewBox="0 0 300 220" className={compact ? "h-32 w-full" : "h-56 w-full"}>
        <rect x="40" y="20" width="220" height="180" rx="8" fill="#C9A47A" stroke={INK} strokeWidth="2" />
        {[{ id: "d1", y: 36 }, { id: "d2", y: 116 }].map((d) => {
          const open = s === d.id;
          return (
            <g key={d.id} onClick={onPickSpot ? () => onPickSpot(d.id) : undefined} style={{ cursor: onPickSpot ? "pointer" : undefined }}>
              <rect x={open ? 28 : 54} y={d.y + (open ? 14 : 0)} width={open ? 244 : 192} height="66" rx="5" fill={open ? "#E2C59E" : "#D9B88E"} stroke={INK} strokeWidth="2" />
              <rect x={open ? 128 : 130} y={d.y + (open ? 42 : 28)} width="44" height="8" rx="4" fill={INK} />
              {open && hl && (
                <g>
                  <circle cx="200" cy={d.y + 40} r="24" fill={hl.color} opacity="0.35" className="pulse-ring" />
                  <rect x="180" y={d.y + 24} width="44" height="30" rx="3" fill={hl.color} stroke={INK} strokeWidth="2" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // almirah or cupboard: steel almirah, both doors open
  const isCupboard = place.kind === "cupboard";
  return (
    <svg viewBox="0 0 300 260" className={compact ? "h-36 w-full" : "h-60 w-full"}>
      {/* open doors */}
      <path d="M62 14 L22 30 L22 236 L62 250 Z" fill={isCupboard ? "#B88A5E" : "#AEB8BF"} stroke={INK} strokeWidth="2" />
      <path d="M238 14 L278 30 L278 236 L238 250 Z" fill={isCupboard ? "#B88A5E" : "#AEB8BF"} stroke={INK} strokeWidth="2" />
      <rect x="30" y="120" width="6" height="26" rx="3" fill={INK} />
      <rect x="264" y="120" width="6" height="26" rx="3" fill={INK} />
      {/* body */}
      <rect x="62" y="14" width="176" height="236" rx="4" fill={isCupboard ? "#E9D7C0" : "#DDE3E7"} stroke={INK} strokeWidth="2" />
      {isCupboard ? (
        <>
          <path d="M150 14 V250" stroke={INK} strokeWidth="2" />
          {spotRect("o1", 66, 18, 80, 228)}
          {spotRect("o2", 154, 18, 80, 228)}
          {spines("o1", 74, 120, 70, 70)}
          {spines("o2", 162, 120, 70, 70)}
          <path d="M66 122 H234" stroke={INK} strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M62 92 H238 M62 170 H238" stroke={INK} strokeWidth="2" />
          {spotRect("s1", 66, 18, 168, 70)}
          {spotRect("s2", 66, 96, 168, 70)}
          {spotRect("s3", 66, 174, 100, 72)}
          {/* clutter so it feels like a real almirah */}
          <rect x="176" y="56" width="50" height="32" rx="3" fill="#C8BFB0" stroke="rgba(0,0,0,0.2)" />
          <rect x="190" y="140" width="40" height="26" rx="3" fill="#E7DCCB" stroke="rgba(0,0,0,0.2)" />
          {/* locker */}
          <g onClick={onPickSpot ? () => onPickSpot("locker") : undefined} style={{ cursor: onPickSpot ? "pointer" : undefined }}>
            <rect x="172" y="180" width="60" height="62" rx="3" fill="#8E9AA3" stroke={hl?.spotId === "locker" ? "#E8A33D" : INK} strokeWidth={hl?.spotId === "locker" ? 3 : 2} />
            <circle cx="202" cy="211" r="6" fill="none" stroke={INK} strokeWidth="2" />
            {hl?.spotId === "locker" && (
              <>
                <circle cx="202" cy="211" r="26" fill={hl.color} opacity="0.35" className="pulse-ring" />
                <rect x="190" y="198" width="24" height="18" rx="3" fill={hl.color} stroke={INK} strokeWidth="1.5" />
              </>
            )}
          </g>
          {spines("s1", 74, 88, 62, 96)}
          {spines("s2", 74, 166, 62, 110)}
          {spines("s3", 74, 244, 60, 92)}
        </>
      )}
      <path d="M70 250 v8 M230 250 v8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* the doors swing open when the page appears */}
      {!onPickSpot && (
        <>
          <motion.rect x="62" y="14" width="88" height="236" rx="4" fill={isCupboard ? "#B88A5E" : "#AEB8BF"} stroke={INK} strokeWidth="2"
            style={{ transformOrigin: "62px 132px" }} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.25, duration: 0.7, ease: [0.4, 0, 0.2, 1] }} />
          <motion.rect x="150" y="14" width="88" height="236" rx="4" fill={isCupboard ? "#B88A5E" : "#AEB8BF"} stroke={INK} strokeWidth="2"
            style={{ transformOrigin: "238px 132px" }} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.25, duration: 0.7, ease: [0.4, 0, 0.2, 1] }} />
        </>
      )}
    </svg>
  );
}

export function Avatar({ person, size = 40, ring = false }: { person?: Person; size?: number; ring?: boolean }) {
  if (!person) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${ring ? "ring-2 ring-white" : ""}`}
      style={{ width: size, height: size, background: person.color, fontSize: size * 0.42 }}
      aria-hidden
    >
      {person.name[0]}
    </span>
  );
}
