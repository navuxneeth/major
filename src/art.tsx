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
    <text x="300" y="200" textAnchor="end" fontSize="9" fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif" fill="#9A9488" letterSpacing="1">SAMPLE</text>
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
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
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
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
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
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
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
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
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
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
          <rect width="320" height="210" rx="14" fill={doc.category === "home" ? "#C25B3C" : "#2F6B4E"} />
          <rect x="12" y="12" width="296" height="186" rx="8" fill="none" stroke="rgba(255,255,255,0.35)" />
          <text x="160" y="98" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">{doc.title.length > 22 ? doc.title.slice(0, 22) + "…" : doc.title}</text>
          <text x="160" y="126" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.85)">{name}</text>
          <text x="294" y="190" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.6)" letterSpacing="1">SAMPLE</text>
        </g>
      );
    default: {
      // paper-like: report, prescription, policy, paper, photo
      const head = doc.art === "report" ? "#C94F4F" : doc.art === "prescription" ? "#3F6FB0" : doc.art === "policy" ? "#2F6B4E" : "#7A6A55";
      return (
        <g fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">
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
  const BRAND = "#2A6012";
  const spines = (spotId: string, x0: number, yBase: number, h: number, maxW: number) => {
    const list = files.filter((f) => f.placeId === place.id && f.spotId === spotId);
    const w = 20;
    return list.map((f, i) => {
      const x = x0 + i * (w + 7);
      if (x + w > x0 + maxW) return null;
      const on = f.id === highlight;
      return (
        <g key={f.id} onClick={onPickFile ? (e) => { e.stopPropagation(); onPickFile(f.id); } : undefined} style={{ cursor: onPickFile ? "pointer" : undefined }}>
          {on && <circle cx={x + w / 2} cy={yBase - h / 2} r="24" fill={f.color} opacity="0.4" className="pulse-ring" />}
          <rect x={x} y={yBase - h} width={w} height={h} rx="4" fill={f.color} />
          <rect x={x + 4} y={yBase - h + 9} width={w - 8} height="14" rx="2.5" fill="rgba(255,255,255,0.8)" />
          <rect x={x + 7} y={yBase - 14} width={w - 14} height="6" rx="3" fill="rgba(0,0,0,0.18)" />
        </g>
      );
    });
  };
  const spotRect = (spotId: string, x: number, y: number, w: number, h: number) => {
    const isOn = hl && hl.spotId === spotId;
    return (
      <rect
        x={x} y={y} width={w} height={h} rx="6"
        fill={isOn ? "#E8F4DA" : "transparent"}
        onClick={onPickSpot ? () => onPickSpot(spotId) : undefined}
        style={{ cursor: onPickSpot ? "pointer" : undefined }}
      />
    );
  };

  const GLOW = (x: number, y: number, color?: string) => <circle cx={x} cy={y} r="28" fill={color ?? BRAND} opacity="0.35" className="pulse-ring" />;
  if (place.kind === "person") {
    return (
      <svg viewBox="0 0 300 200" className={compact ? "h-28 w-full" : "h-52 w-full"}>
        <circle cx="140" cy="86" r="48" fill={person?.color ?? "#1E5B4F"} />
        <text x="140" y="102" textAnchor="middle" fontSize="44" fontWeight="700" fill="#fff" fontFamily="-apple-system, 'SF Pro Text', 'Inter', 'Noto Sans Devanagari', Arial, sans-serif">{(person?.name ?? "?")[0]}</text>
        {hl && GLOW(209, 130, hl.color)}
        <rect x="178" y="108" width="62" height="44" rx="7" fill={hl?.color ?? "#1E5B4F"} />
        <rect x="186" y="116" width="46" height="12" rx="3" fill="rgba(255,255,255,0.75)" />
        
        <text x="140" y="180" textAnchor="middle" fontSize="15" fill="#48484D" fontFamily="-apple-system, 'SF Pro Text', 'Inter', 'Noto Sans Devanagari', Arial, sans-serif">{person ? person.city : ""}</text>
      </svg>
    );
  }

  if (place.kind === "drawer") {
    const s = hl?.spotId;
    return (
      <svg viewBox="0 0 300 220" className={compact ? "h-32 w-full" : "h-56 w-full"}>
        <ellipse cx="150" cy="210" rx="110" ry="6" fill="rgba(0,0,0,0.07)" />
        <rect x="44" y="18" width="212" height="186" rx="12" fill="#E3CFB2" />
        {[{ id: "d1", y: 32 }, { id: "d2", y: 116 }].map((d) => {
          const open = s === d.id;
          return (
            <g key={d.id} onClick={onPickSpot ? () => onPickSpot(d.id) : undefined} style={{ cursor: onPickSpot ? "pointer" : undefined }}>
              <rect x={open ? 30 : 56} y={d.y + (open ? 10 : 0)} width={open ? 240 : 188} height="72" rx="8" fill={open ? "#F1E3CF" : "#D8BF9C"} />
              <rect x={open ? 126 : 128} y={d.y + (open ? 40 : 30)} width="44" height="9" rx="4.5" fill="#B08D63" />
              {open && hl && (
                <g>
                  {GLOW(206, d.y + 41, hl.color)}
                  <rect x="182" y={d.y + 24} width="48" height="34" rx="5" fill={hl.color} />
                  <rect x="188" y={d.y + 30} width="36" height="9" rx="2" fill="rgba(255,255,255,0.75)" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // almirah or cupboard: a clean, flat steel almirah with both doors open
  const isCupboard = place.kind === "cupboard";
  const body = isCupboard ? "#E6D6C3" : "#DCE4E0";
  const door = isCupboard ? "#CDB596" : "#C3CEC8";
  const inside = isCupboard ? "#F6EEE4" : "#F4F7F5";
  const edge = isCupboard ? "#B99D7A" : "#A9B6AF";
  return (
    <svg viewBox="0 0 300 268" className={compact ? "h-36 w-full" : "h-60 w-full"}>
      <ellipse cx="150" cy="258" rx="120" ry="7" fill="rgba(0,0,0,0.07)" />
      {/* open doors */}
      <path d="M58 16 L24 30 Q20 31 20 35 L20 232 Q20 236 24 237 L58 250 Z" fill={door} />
      <path d="M242 16 L276 30 Q280 31 280 35 L280 232 Q280 236 276 237 L242 250 Z" fill={door} />
      <rect x="28" y="118" width="5" height="30" rx="2.5" fill={edge} />
      <rect x="267" y="118" width="5" height="30" rx="2.5" fill={edge} />
      {/* body */}
      <rect x="54" y="10" width="192" height="244" rx="10" fill={body} />
      <rect x="64" y="20" width="172" height="224" rx="6" fill={inside} />
      {isCupboard ? (
        <>
          <rect x="148" y="20" width="4" height="224" fill={body} />
          {spotRect("o1", 68, 24, 76, 216)}
          {spotRect("o2", 156, 24, 76, 216)}
          <rect x="64" y="128" width="172" height="5" fill={body} />
          {spines("o1", 74, 124, 74, 66)}
          {spines("o2", 162, 124, 74, 66)}
        </>
      ) : (
        <>
          <rect x="64" y="92" width="172" height="5" fill={body} />
          <rect x="64" y="170" width="172" height="5" fill={body} />
          {spotRect("s1", 68, 24, 164, 64)}
          {spotRect("s2", 68, 101, 164, 65)}
          {spotRect("s3", 68, 179, 96, 61)}
          {/* a few folded things, so it feels like a real almirah */}
          <rect x="178" y="62" width="48" height="26" rx="4" fill="#E4DCCD" />
          <rect x="178" y="54" width="44" height="10" rx="3" fill="#EDE6DA" />
          <rect x="188" y="142" width="40" height="24" rx="4" fill="#E9E2D6" />
          {/* locker */}
          <g onClick={onPickSpot ? () => onPickSpot("locker") : undefined} style={{ cursor: onPickSpot ? "pointer" : undefined }}>
            <rect x="170" y="182" width="62" height="58" rx="6" fill="#9AA7A0" />
            <rect x="170" y="182" width="62" height="58" rx="6" fill="none" stroke={hl?.spotId === "locker" ? BRAND : "transparent"} strokeWidth="3" />
            <circle cx="201" cy="207" r="6" fill="#7E8B84" />
            <rect x="199.5" y="209" width="3" height="10" rx="1.5" fill="#7E8B84" />
            {hl?.spotId === "locker" && (
              <>
                <circle cx="201" cy="211" r="28" fill={hl.color} opacity="0.35" className="pulse-ring" />
                <rect x="189" y="200" width="24" height="18" rx="3" fill={hl.color} />
              </>
            )}
          </g>
          {spines("s1", 74, 88, 56, 96)}
          {spines("s2", 74, 166, 56, 104)}
          {spines("s3", 74, 240, 54, 88)}
        </>
      )}
      <rect x="70" y="252" width="14" height="8" rx="3" fill={edge} />
      <rect x="216" y="252" width="14" height="8" rx="3" fill={edge} />
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
