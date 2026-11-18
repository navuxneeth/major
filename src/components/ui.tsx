import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarDays, Camera, Car, Check, Columns3, Copy, DoorClosed, Eye, FileText, FlaskConical, FolderOpen, HandHelping, HeartPulse, Hospital, House, IdCard, Image, Info, Landmark, Link2, MapPin, Maximize, MessageCircle, Mic, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Send, Share2, Siren, Stamp, TrainFront, UserMinus, UserPlus, UserRound } from "lucide-react";
const Icons: Record<string, any> = { Archive, ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarDays, Camera, Car, Check, Columns3, Copy, DoorClosed, Eye, FileText, FlaskConical, FolderOpen, HandHelping, HeartPulse, Hospital, House, IdCard, Image, Info, Landmark, Link2, MapPin, Maximize, MessageCircle, Mic, Pencil, Plus, Printer, RotateCcw, Search, SearchX, Send, Share2, Siren, Stamp, TrainFront, UserMinus, UserPlus, UserRound };
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
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-hair bg-paper/95 px-3 py-2 backdrop-blur">
          {!noBack && (
            <button onClick={onBack ?? back} className="flex h-12 min-w-12 items-center gap-1 rounded-full px-2 text-ink active:bg-hair" aria-label={t("back")}>
              <ArrowLeft size={26} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[1.3rem] leading-tight font-semibold">{title}</h1>
            {sub && <p className="truncate text-[0.85rem] text-mute">{sub}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="flex-1 px-4 pt-4 pb-28">{children}</div>
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "saffron";
export function Button({ children, onClick, variant = "primary", className = "", icon, disabled, type = "button", big = false }: {
  children: ReactNode; onClick?: () => void; variant?: BtnVariant; className?: string; icon?: string; disabled?: boolean; type?: "button" | "submit"; big?: boolean;
}) {
  const v = {
    primary: "bg-brand text-white active:bg-brand-dark",
    secondary: "bg-white text-ink border-2 border-hair active:bg-hair",
    ghost: "bg-transparent text-brand active:bg-brand-soft",
    danger: "bg-white text-danger border-2 border-danger-soft active:bg-danger-soft",
    saffron: "bg-saffron text-ink active:brightness-95",
  }[variant];
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition-colors disabled:opacity-40 ${big ? "min-h-16 text-[1.15rem]" : "min-h-14 text-[1.05rem]"} ${v} ${className}`}
    >
      {icon && <Icon name={icon} size={big ? 26 : 22} />}
      {children}
    </motion.button>
  );
}

export function Card({ children, className = "", onClick, tone = "bg-white" }: { children: ReactNode; className?: string; onClick?: () => void; tone?: string }) {
  const C: any = onClick ? motion.button : "div";
  return (
    <C
      {...(onClick ? { whileTap: { scale: 0.98 }, onClick } : {})}
      className={`block w-full rounded-2xl border border-hair ${tone} p-4 text-left ${onClick ? "active:brightness-[0.98]" : ""} ${className}`}
    >
      {children}
    </C>
  );
}

export function Chip({ children, onClick, active = false, icon, className = "" }: { children: ReactNode; onClick?: () => void; active?: boolean; icon?: string; className?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-[1rem] font-medium ${active ? "border-brand bg-brand text-white" : "border-hair bg-white text-ink"} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </motion.button>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mt-6 mb-2 flex items-end justify-between gap-2">
      <h2 className="text-[1.1rem] font-semibold">{children}</h2>
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
            className="max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-paper px-4 pt-3 pb-8"
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
          className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-x-4 bottom-28 z-[60] rounded-2xl bg-ink px-4 py-3 text-center text-[1rem] text-white shadow-lg`}
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
        className={`flex ${dim} shrink-0 items-center justify-center rounded-full ${v.listening ? "bg-saffron text-ink" : "bg-brand text-white"}`}
        aria-label={t("speak")}
      >
        {v.listening ? (
          <span className="flex h-6 items-center gap-1">
            {[0, 1, 2, 3].map((i) => <span key={i} className="mic-bar block h-6 w-1 rounded bg-ink" style={{ animationDelay: `${i * 0.12}s` }} />)}
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
    <div className="flex items-start gap-3 rounded-2xl bg-saffron-soft p-4 text-[1rem]">
      <Icon name={icon} size={24} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
