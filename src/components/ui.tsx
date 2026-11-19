import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarDays, Camera, Car, Check, Columns3, Copy, DoorClosed, Eye, FileText, FlaskConical, FolderOpen, HandHelping, HeartPulse, Hospital, House, IdCard, Image, Info, Landmark, LayoutGrid, Link2, MapPin, Maximize, MessageCircle, MessageSquareText, Mic, MousePointerClick, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Send, Share2, Siren, Smartphone, Sparkles, Stamp, TrainFront, UserMinus, UserPlus, UserRound } from "lucide-react";
const Icons: Record<string, any> = { Archive, ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarDays, Camera, Car, Check, Columns3, Copy, DoorClosed, Eye, FileText, FlaskConical, FolderOpen, HandHelping, HeartPulse, Hospital, House, IdCard, Image, Info, Landmark, LayoutGrid, Link2, MapPin, Maximize, MessageCircle, MessageSquareText, Mic, MousePointerClick, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Send, Share2, Siren, Smartphone, Sparkles, Stamp, TrainFront, UserMinus, UserPlus, UserRound };
import { X } from "lucide-react";
import { useStore } from "../store";

export function Icon({ name, size = 24, className = "", strokeWidth = 2 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  const C = Icons[name] ?? FileText;
  return <C size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export function Screen({ title, children, right, onBack, noBack, sub }: { title?: ReactNode; sub?: ReactNode; children: ReactNode; right?: ReactNode; onBack?: () => void; noBack?: boolean }) {
  const { back, t } = useStore();
  return (
    <div className="flex min-h-full flex-col">
      {title !== undefined && (
        <header className="wash pt-safe px-4 pb-4">
          <div className="flex h-12 items-center gap-2">
            {!noBack && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={onBack ?? back} className="-ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_16px_-10px_rgba(0,0,0,0.35)]" aria-label={t("back")}>
                <ArrowLeft size={24} />
              </motion.button>
            )}
            <div className="flex-1" />
            {right}
          </div>
          <h1 className="title-tight mt-2 text-[2rem] leading-[1.12] font-bold">{title}</h1>
          {sub && <p className="mt-1 text-[0.98rem] leading-snug text-mute">{sub}</p>}
        </header>
      )}
      <div className="flex-1 px-4 pt-4 pb-28">{children}</div>
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "saffron";
export function Button({ children, onClick, variant = "primary", className = "", icon, disabled, type = "button", big = false, guide }: {
  children: ReactNode; onClick?: () => void; variant?: BtnVariant; className?: string; icon?: string; disabled?: boolean; type?: "button" | "submit"; big?: boolean; guide?: string;
}) {
  const v = {
    primary: "bg-brand text-white active:bg-brand-dark",
    secondary: "bg-white text-ink ring-1 ring-inset ring-[#D8D8DE] active:bg-[#F6F9F2]",
    ghost: "bg-transparent text-ink underline-offset-4 active:bg-card",
    danger: "bg-danger-soft text-danger active:brightness-95",
    saffron: "bg-saffron text-ink active:brightness-95",
  }[variant];
  return (
    <motion.button
      type={type}
      data-guide={guide}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 font-semibold transition-colors disabled:opacity-35 ${big ? "min-h-16 text-[1.15rem]" : "min-h-14 text-[1.05rem]"} ${v} ${className}`}
    >
      {icon && <Icon name={icon} size={big ? 22 : 20} className="shrink-0" />}
      {children}
    </motion.button>
  );
}

export function Card({ children, className = "", onClick, tone = "bg-white", guide }: { children: ReactNode; className?: string; onClick?: () => void; tone?: string; guide?: string }) {
  const C: any = onClick ? motion.button : "div";
  return (
    <C
      {...(onClick ? { whileTap: { scale: 0.98 }, onClick } : {})}
      data-guide={guide}
      className={`block w-full rounded-[22px] ${tone === "bg-white" ? "bg-white lift" : tone} p-4 text-left ${onClick ? "active:brightness-[0.97]" : ""} ${className}`}
    >
      {children}
    </C>
  );
}

export function Chip({ children, onClick, active = false, icon, className = "", guide }: { children: ReactNode; onClick?: () => void; active?: boolean; icon?: string; className?: string; guide?: string }) {
  return (
    <motion.button
      data-guide={guide}
      whileTap={{ scale: 0.96 }}
      layout
      onClick={onClick}
      className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-5 text-[1rem] font-medium ${active ? "bg-brand text-white" : "bg-white ring-1 ring-inset ring-[#D8D8DE] text-ink"} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </motion.button>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mt-7 mb-3 flex items-end justify-between gap-2">
      <h2 className="title-tight text-[1.25rem] font-bold">{children}</h2>
      {right}
    </div>
  );
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  const { t } = useStore();
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-50 flex items-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="max-h-[88%] w-full overflow-y-auto rounded-t-[32px] bg-white px-4 pt-3 pb-8"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-hair" />
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[1.25rem] font-semibold">{title}</h2>
              <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full active:bg-hair" aria-label={t("close")}><X size={26} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast({ fixed = false }: { fixed?: boolean }) {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast}
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
          className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-x-6 bottom-32 z-[60] rounded-full bg-brand-dark px-5 py-3 text-center text-[1rem] text-white shadow-xl backdrop-blur`}
          role="status"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- voice ---------------- */

export function useVoice(onText: (text: string, final: boolean) => void) {
  const { lang } = useStore();
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  const recRef = useRef<any>(null);
  const cb = useRef(onText);
  cb.current = onText;

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* already stopped */ }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setListening(true); return; } // fallback UI shows suggestions
    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      let text = "";
      let final = false;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) final = true;
      }
      cb.current(text, final);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  }, [lang]);

  useEffect(() => () => stop(), [stop]);
  return { listening, start, stop, supported, setListening };
}

export function MicButton({ onText, size = "lg" }: { onText: (text: string, final: boolean) => void; size?: "lg" | "md" }) {
  const { t } = useStore();
  const v = useVoice(onText);
  const dim = size === "lg" ? "h-14 w-14" : "h-12 w-12";
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => (v.listening ? v.stop() : v.start())}
        className={`flex ${dim} shrink-0 items-center justify-center rounded-full ${v.listening ? "bg-brand-soft text-brand-dark" : "bg-brand text-white"}`}
        aria-label={t("speak")}
      >
        {v.listening ? (
          <span className="flex h-6 items-center gap-1">
            {[0, 1, 2, 3].map((i) => <span key={i} className="mic-bar block h-6 w-1 rounded bg-brand" style={{ animationDelay: `${i * 0.12}s` }} />)}
          </span>
        ) : (
          <Mic size={size === "lg" ? 28 : 24} />
        )}
      </motion.button>
      <VoiceFallback open={v.listening && !v.supported} onPick={(s) => { onText(s, true); v.setListening(false); }} onClose={() => v.setListening(false)} />
    </>
  );
}

/* When the browser has no speech recognition (e.g. iPhone Safari), show what people can say, and let them tap it. */
function VoiceFallback({ open, onPick, onClose }: { open: boolean; onPick: (s: string) => void; onClose: () => void }) {
  const { t, lang } = useStore();
  const ex = lang === "hi" ? ["आधार कार्ड दिखाओ", "पापा की एलआईसी पॉलिसी", "ब्लड रिपोर्ट", "गैस की किताब"] : ["Show my Aadhaar", "Papa's LIC policy", "Blood report", "Gas connection book"];
  return (
    <Sheet open={open} onClose={onClose} title={t("listening")}>
      <p className="mb-3 text-mute">{lang === "hi" ? "इस फ़ोन पर बोलकर ढूँढना नहीं चलता। नीचे से छूकर देखें:" : "Voice isn't available in this browser. Tap what you would say:"}</p>
      <div className="flex flex-col gap-2">
        {ex.map((e) => (
          <Button key={e} variant="secondary" icon="Mic" onClick={() => onPick(e)} className="justify-start">“{e}”</Button>
        ))}
      </div>
    </Sheet>
  );
}

export function EmptyNote({ icon = "Info", children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] bg-white lift p-4 text-[1rem]">
      <Icon name={icon} size={24} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

/** Header card used on inner screens: same language as the home sticker cards (soft card, big tight title, sticker art peeking out). */
export function StickerBand({ art, title, sub, className = "" }: { art: ReactNode; title: ReactNode; sub?: ReactNode; tone?: string; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`mb-5 flex items-center gap-4 rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_-16px_rgba(40,70,20,0.28)] ${className}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[1.12rem] leading-snug font-semibold">{title}</p>
        {sub && <p className="mt-0.5 text-[1rem] leading-snug text-mute">{sub}</p>}
      </div>
      <span className="sticker flex h-20 w-24 shrink-0 items-center justify-center [&>*]:max-h-20 [&>*]:max-w-24">{art}</span>
    </motion.div>
  );
}


/** The app icon: a two-door almirah on leaf green, like an iOS app icon. */
export function AppMark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0 drop-shadow-[0_8px_16px_rgba(42,96,18,0.28)]">
      <rect width="64" height="64" rx="15" fill="#2A6012" />
      <rect x="18" y="12" width="28" height="38" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M32 12v38" stroke="#FFFFFF" strokeWidth="3" />
      <rect x="27.5" y="28" width="2.5" height="7" rx="1.25" fill="#F2B544" />
      <rect x="34" y="28" width="2.5" height="7" rx="1.25" fill="#F2B544" />
      <path d="M21 50v3.5M43 50v3.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
