import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume2, X } from "lucide-react";
import { useStore } from "../store";

/* "Show me how": a glowing ring sits on the real button, a voice says what to do,
   and the guide moves on only when the person taps it themselves. It never taps for them. */

export interface GuideStep { target: string; en: string; hi: string }
export interface GuideDef { id: string; en: string; hi: string; icon: string; keywords: string[]; start: string; steps: GuideStep[]; outside?: boolean }

export const GUIDES: GuideDef[] = [
  {
    id: "counter", en: "Show my Aadhaar at a counter", hi: "काउंटर पर आधार दिखाना", icon: "Maximize", start: "",
    keywords: ["counter", "show", "aadhaar", "aadhar", "आधार", "दिखा", "काउंटर", "dikhana"],
    steps: [
      { target: "home-find", en: "Tap here to look for a document.", hi: "कागज़ ढूँढने के लिए यहाँ दबाइए।" },
      { target: "find-chip-0", en: "Tap Aadhaar.", hi: "आधार पर दबाइए।" },
      { target: "result-0", en: "This is your Aadhaar. Tap it.", hi: "यह आपका आधार है। इस पर दबाइए।" },
      { target: "counter-btn", en: "Tap here. It opens big and bright, for the counter.", hi: "यहाँ दबाइए। यह बड़ा और साफ़ खुलेगा, काउंटर के लिए।" },
    ],
  },
  {
    id: "share", en: "Send a document to the bank safely", hi: "बैंक को कागज़ सुरक्षित भेजना", icon: "Share2", start: "",
    keywords: ["send", "share", "bank", "kyc", "भेज", "बैंक", "केवाईसी", "bhejna"],
    steps: [
      { target: "home-find", en: "Tap here to find the document.", hi: "कागज़ ढूँढने के लिए यहाँ दबाइए।" },
      { target: "find-chip-0", en: "Tap Aadhaar.", hi: "आधार पर दबाइए।" },
      { target: "result-0", en: "Tap your Aadhaar.", hi: "अपने आधार पर दबाइए।" },
      { target: "share-btn", en: "Tap Share safely.", hi: "सुरक्षित भेजें पर दबाइए।" },
      { target: "purpose-0", en: "Choose who it is for. We print it on the copy.", hi: "चुनिए किसके लिए है। यह कॉपी पर छपेगा।" },
      { target: "share-wa", en: "Now tap here to send it on WhatsApp.", hi: "अब व्हाट्सऐप पर भेजने के लिए यहाँ दबाइए।" },
    ],
  },
  {
    id: "hospital", en: "What to take to the hospital", hi: "अस्पताल क्या ले जाना है", icon: "Hospital", start: "",
    keywords: ["hospital", "doctor", "अस्पताल", "डॉक्टर", "aspatal"],
    steps: [
      { target: "ready-hospital", en: "Tap Hospital visit.", hi: "अस्पताल जाना पर दबाइए।" },
      { target: "ready-pack-0", en: "Put it in the bag, then tick it here.", hi: "बैग में रखिए, फिर यहाँ टिक कीजिए।" },
    ],
  },
  {
    id: "lend", en: "Get Rahul's help on my phone", hi: "राहुल से फ़ोन पर मदद लेना", icon: "HandHelping", start: "",
    keywords: ["help", "rahul", "son", "book", "ticket", "lend", "मदद", "राहुल", "बेटा", "टिकट", "बुक"],
    steps: [
      { target: "home-lend", en: "Tap Lend my phone.", hi: "फ़ोन उधार दें पर दबाइए।" },
      { target: "lend-app-train", en: "Choose the app he should help with.", hi: "चुनिए किस ऐप में मदद चाहिए।" },
      { target: "lend-send", en: "Tap here to ask Rahul.", hi: "राहुल से पूछने के लिए यहाँ दबाइए।" },
    ],
  },
  {
    id: "otp", en: "Where is my OTP?", hi: "मेरा ओटीपी कहाँ है?", icon: "MessageSquareText", start: "phone", outside: true,
    keywords: ["otp", "code", "ओटीपी", "कोड", "kahan", "message"],
    steps: [
      { target: "msg-bank", en: "The OTP comes in a message from your bank. Tap it.", hi: "ओटीपी आपके बैंक के मैसेज में आता है। उस पर दबाइए।" },
      { target: "otp-digits", en: "These 6 numbers are the OTP. Type them yourself. Never read them out on a phone call.", hi: "ये 6 अंक ओटीपी हैं। ख़ुद टाइप कीजिए। फ़ोन पर किसी को कभी मत बताइए।" },
    ],
  },
];

export function matchGuide(text: string) {
  const q = text.toLowerCase();
  let best: GuideDef | null = null;
  let score = 0;
  for (const g of GUIDES) {
    const s = g.keywords.filter((k) => q.includes(k)).length;
    if (s > score) { score = s; best = g; }
  }
  return best;
}

function speak(text: string, lang: "en" | "hi") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.92;
    synth.speak(u);
  } catch { /* no voice on this device: the bubble still shows the words */ }
}

export function GuideOverlay({ rootId }: { rootId: string }) {
  const { guide, stopGuide, nextGuide, lang, showToast } = useStore();
  const def = guide ? GUIDES.find((g) => g.id === guide.id) : null;
  const step = def && guide ? def.steps[guide.step] : null;
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number; H: number } | null>(null);
  const spokenFor = useRef<string>("");

  const text = step ? (lang === "hi" ? step.hi : step.en) : "";

  // follow the target as the screen changes or scrolls
  useEffect(() => {
    if (!step) { setRect(null); return; }
    let raf = 0;
    let scrolled = false;
    const tick = () => {
      const root = document.getElementById(rootId);
      const el = root?.querySelector(`[data-guide="${step.target}"]`) as HTMLElement | null;
      if (root && el) {
        if (!scrolled) { el.scrollIntoView({ block: "center", behavior: "smooth" }); scrolled = true; }
        const r = el.getBoundingClientRect();
        const R = root.getBoundingClientRect();
        setRect({ x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height, H: R.height });
      } else setRect(null);
      raf = window.setTimeout(tick, 120) as unknown as number;
    };
    tick();
    return () => window.clearTimeout(raf);
  }, [step?.target, rootId]); // eslint-disable-line

  // say it once per step
  useEffect(() => {
    if (!guide || !text) return;
    const key = `${guide.id}-${guide.step}-${lang}`;
    if (spokenFor.current === key) return;
    spokenFor.current = key;
    speak(text, lang);
  }, [guide, text, lang]);

  // move on when the person taps the right thing
  const onTap = useCallback((e: MouseEvent) => {
    if (!step || !def || !guide) return;
    const t = e.target as HTMLElement;
    if (t.closest(`[data-guide="${step.target}"]`)) {
      const last = guide.step >= def.steps.length - 1;
      window.setTimeout(() => {
        if (last) {
          stopGuide();
          showToast(lang === "hi" ? "शाबाश! आपने ख़ुद कर लिया।" : "Well done. You did it yourself.");
          speak(lang === "hi" ? "शाबाश! आपने ख़ुद कर लिया।" : "Well done. You did it yourself.", lang);
        } else nextGuide();
      }, 250);
    }
  }, [step, def, guide, nextGuide, stopGuide, showToast, lang]);
  useEffect(() => {
    document.addEventListener("click", onTap, true);
    return () => document.removeEventListener("click", onTap, true);
  }, [onTap]);

  if (!def || !guide || !step) return null;
  const pad = 8;
  const below = rect ? rect.y + rect.h / 2 < rect.H * 0.55 : true;

  return (
    <div className="pointer-events-none absolute inset-0 z-[80]">
      {rect && (
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <mask id="guide-hole">
              <rect width="100%" height="100%" fill="white" />
              <rect x={rect.x - pad} y={rect.y - pad} width={rect.w + pad * 2} height={rect.h + pad * 2} rx="18" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(20,18,15,0.55)" mask="url(#guide-hole)" />
        </svg>
      )}
      {rect && (
        <>
          <motion.div
            className="absolute rounded-[20px] border-4 border-saffron"
            style={{ left: rect.x - pad, top: rect.y - pad, width: rect.w + pad * 2, height: rect.h + pad * 2 }}
            animate={{ boxShadow: ["0 0 0 0 rgba(232,163,61,0.7)", "0 0 0 14px rgba(232,163,61,0)"] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          <motion.div
            className="absolute flex h-11 w-11 items-center justify-center"
            style={{ left: rect.x + rect.w / 2 - 22, top: rect.y + rect.h / 2 - 22 }}
            animate={{ scale: [1, 0.82, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
          >
            <span className="block h-7 w-7 rounded-full border-4 border-white bg-saffron/80 shadow-lg" />
          </motion.div>
        </>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={guide.step}
          initial={{ opacity: 0, y: below ? -10 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="pointer-events-auto absolute inset-x-3 rounded-3xl bg-ink p-4 text-white shadow-2xl"
          style={rect ? (below ? { top: Math.min(rect.y + rect.h + pad + 14, rect.H - 190) } : { top: Math.max(rect.y - pad - 170, 12) }) : { bottom: 110 }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-saffron px-2 text-[0.95rem] font-bold text-ink">{guide.step + 1}/{def.steps.length}</span>
            <p className="flex-1 text-[1.15rem] leading-snug font-semibold">{text}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => speak(text, lang)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/15 font-semibold">
              <Volume2 size={20} /> {lang === "hi" ? "फिर से सुनें" : "Say it again"}
            </button>
            <button onClick={() => { stopGuide(); window.speechSynthesis?.cancel(); }} className="flex h-11 items-center justify-center gap-1 rounded-2xl bg-white/15 px-4 font-semibold">
              <X size={20} /> {lang === "hi" ? "बंद" : "Stop"}
            </button>
          </div>
          {!rect && <p className="mt-2 text-[0.9rem] text-white/70">{lang === "hi" ? "स्क्रीन बदल रही है…" : "Getting the screen ready…"}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
