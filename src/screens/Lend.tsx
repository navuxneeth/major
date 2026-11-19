import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, MousePointer2, ShieldCheck, TrainFront, Landmark, Delete } from "lucide-react";
import { useStore } from "../store";
import { Avatar } from "../art";
import { LendArt, SuccessBurst } from "../illustrations";
import { Button, Screen, StickerBand } from "../components/ui";

/* Lend my phone: the parent starts it, picks one app, the helper gets 15 minutes.
   A red banner stays on screen with a big End button. The OTP is typed by the parent, never read out. */

const LIMIT = 15 * 60 * 1000;
type AppId = "train" | "bank";

const APPS: { id: AppId; en: string; hi: string; icon: any; tone: string; subEn: string; subHi: string }[] = [
  { id: "train", en: "Train tickets", hi: "ट्रेन टिकट", icon: TrainFront, tone: "bg-teal", subEn: "Book a ticket", subHi: "टिकट बुक करना" },
  { id: "bank", en: "Bank app", hi: "बैंक ऐप", icon: Landmark, tone: "bg-sage", subEn: "Check if a payment went through", subHi: "देखना कि पैसे गए या नहीं" },
];

function useRemaining(startedAt?: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!startedAt) return LIMIT;
  return Math.max(0, LIMIT - (now - new Date(startedAt).getTime()));
}
const mmss = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;

export function Lend() {
  const { data, settings } = useStore();
  return settings.role === "helper" ? <HelperLend /> : <OwnerLend key={data.lend?.status ?? "none"} />;
}

/* ---------------- parent's side ---------------- */
function OwnerLend() {
  const { data, lang, requestLend, startLend, endLend, clearLend, go, person, showToast } = useStore();
  const hi = lang === "hi";
  const lend = data.lend;
  const [app, setApp] = useState<AppId>("train");
  const rahul = person("rahul");

  // In this single-phone demo Rahul accepts after a few seconds. On real phones he taps Accept.
  useEffect(() => {
    if (lend?.status !== "waiting") return;
    const t = window.setTimeout(() => startLend(), 3500);
    return () => window.clearTimeout(t);
  }, [lend?.status, startLend]);

  if (!lend || lend.status === "ended" && !lend.endedBy) {
    return (
      <Screen title={hi ? "फ़ोन उधार दें" : "Lend my phone"} sub={hi ? "राहुल आपके फ़ोन पर एक ऐप चला सकेंगे" : "Rahul can use one app on your phone"}>
        <div className="mb-4 flex items-start gap-2 rounded-[20px] bg-[#FFF4DC] p-3 text-[0.92rem]">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <span>{hi ? "आज़माया गया आइडिया। फ़ोन पर बैंक जैसी निजी चीज़ें होती हैं, इसलिए मुख्य ऐप में नहीं है। रोज़ की मदद के लिए “कैसे करें, दिखाओ” है।" : "An idea we explored. Phones hold bank and other private data, so it is not part of the main app. “Show me how” covers everyday help."}</span>
        </div>
        <StickerBand art={<LendArt className="h-24 w-32" />}
          title={hi ? "सिर्फ़ एक ऐप, सिर्फ़ 15 मिनट" : "One app, 15 minutes"}
          sub={hi ? "कभी भी बंद करें। ओटीपी आप ख़ुद डालेंगी।" : "End it any time. You type the OTP yourself."} />
        <p className="mt-5 mb-2 text-[1.1rem] font-semibold">{hi ? "किससे मदद?" : "Who should help?"}</p>
        <div data-guide="lend-rahul" className="flex items-center gap-3 rounded-[22px] bg-card p-3">
          <Avatar person={rahul} size={44} />
          <span className="flex-1"><b className="text-[1.1rem]">{hi ? "राहुल" : "Rahul"}</b><span className="block text-[0.92rem] text-mute">{hi ? "बेटा · बेंगलुरु" : "Son · Bengaluru"}</span></span>
          <Check size={24} className="text-brand" />
        </div>
        <p className="mt-5 mb-2 text-[1.1rem] font-semibold">{hi ? "किस ऐप में?" : "Which app?"}</p>
        <div className="grid grid-cols-2 gap-2">
          {APPS.map((a) => (
            <motion.button key={a.id} whileTap={{ scale: 0.96 }} onClick={() => setApp(a.id)} data-guide={`lend-app-${a.id}`}
              className={`flex min-h-32 flex-col justify-between rounded-[26px] p-3 text-left ${app === a.id ? "bg-brand text-white" : "bg-card"}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${app === a.id ? "bg-white/15" : "bg-white"}`}><a.icon size={24} /></span>
              <span>
                <span className="block text-[1.08rem] font-semibold">{hi ? a.hi : a.en}</span>
                <span className={`block text-[0.88rem] ${app === a.id ? "text-white/70" : "text-mute"}`}>{hi ? a.subHi : a.subEn}</span>
              </span>
            </motion.button>
          ))}
        </div>
        <Button big className="mt-6 w-full" icon="Send" guide="lend-send" onClick={() => { requestLend(app); showToast(hi ? "राहुल को पूछ लिया।" : "Asked Rahul."); }}>
          {hi ? "राहुल से पूछें" : "Ask Rahul"}
        </Button>
      </Screen>
    );
  }

  if (lend.status === "waiting") {
    return (
      <Screen title={hi ? "फ़ोन उधार दें" : "Lend my phone"}>
        <div className="flex flex-col items-center pt-8 text-center">
          <LendArt className="h-40 w-60" live />
          <p className="mt-4 text-[1.35rem] font-semibold">{hi ? "राहुल का इंतज़ार…" : "Waiting for Rahul…"}</p>
          <p className="mt-1 text-[1rem] text-mute">{hi ? "उन्हें एक सूचना गई है। वो मान लेंगे तो यहाँ दिखेगा।" : "He has got a notification. You will see it here when he accepts."}</p>
          <Button variant="secondary" className="mt-6" onClick={() => clearLend()}>{hi ? "रद्द करें" : "Cancel"}</Button>
          <p className="mt-6 text-[0.85rem] text-mute">{hi ? "डेमो: राहुल कुछ सेकंड में ख़ुद मान लेंगे।" : "Demo: Rahul accepts by himself in a few seconds."}</p>
        </div>
      </Screen>
    );
  }

  if (lend.status === "active") return <OwnerSession onEnd={() => endLend("owner")} onDone={() => endLend("done")} app={lend.app as AppId} startedAt={lend.startedAt} />;

  // ended
  const mins = lend.startedAt && lend.endedAt ? Math.max(1, Math.round((new Date(lend.endedAt).getTime() - new Date(lend.startedAt).getTime()) / 60000)) : 1;
  const appName = APPS.find((a) => a.id === lend.app)?.[hi ? "hi" : "en"];
  return (
    <Screen title={hi ? "मदद पूरी हुई" : "Help finished"} noBack>
      <div className="flex flex-col items-center pt-6 text-center">
        {lend.endedBy === "done" ? <SuccessBurst size={140} /> : <ShieldCheck size={96} className="text-brand" />}
        <p className="mt-3 text-[1.4rem] font-semibold">
          {lend.endedBy === "done" ? (hi ? "हो गया!" : "All done!") : lend.endedBy === "time" ? (hi ? "15 मिनट पूरे हुए" : "15 minutes are up") : (hi ? "आपने बंद कर दिया" : "You ended it")}
        </p>
        <p className="mt-2 max-w-xs text-[1.02rem] text-mute">
          {hi ? `राहुल ने ${mins} मिनट मदद की, सिर्फ़ ${appName} में। अब वो आपका फ़ोन नहीं देख सकते।` : `Rahul helped for ${mins} min, only in ${appName}. He can no longer see your phone.`}
        </p>
        <Button big className="mt-8 w-full" onClick={() => { clearLend(); go(""); }}>{hi ? "ठीक है" : "OK"}</Button>
      </div>
    </Screen>
  );
}

function OwnerSession({ onEnd, onDone, app, startedAt }: { onEnd: () => void; onDone: () => void; app: AppId; startedAt?: string }) {
  const { lang, endLend } = useStore();
  const hi = lang === "hi";
  const left = useRemaining(startedAt);
  useEffect(() => { if (left <= 0) endLend("time"); }, [left, endLend]);
  const appName = APPS.find((a) => a.id === app)!;
  return (
    <div className="min-h-full bg-paper">
      <div className="sticky top-0 z-20 bg-danger px-4 py-3 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <motion.span className="h-3 w-3 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <p className="flex-1 text-[1.05rem] leading-tight font-semibold">{hi ? `राहुल ${appName.hi} चला रहे हैं` : `Rahul is using ${appName.en}`}<span className="block text-[0.9rem] font-normal text-white/85">{hi ? "बाकी समय" : "Time left"} {mmss(left)}</span></p>
          <motion.button whileTap={{ scale: 0.94 }} onClick={onEnd} className="h-14 rounded-[22px] bg-white px-5 text-[1.15rem] font-bold text-danger">{hi ? "बंद करें" : "End"}</motion.button>
        </div>
      </div>
      <MockApp app={app} mode="watch" onDone={onDone} />
    </div>
  );
}

/* ---------------- helper's side ---------------- */
function HelperLend() {
  const { data, lang, startLend, endLend, clearLend, go } = useStore();
  const hi = lang === "hi";
  const lend = data.lend;
  const left = useRemaining(lend?.startedAt);
  useEffect(() => { if (lend?.status === "active" && left <= 0) endLend("time"); }, [left, lend?.status, endLend]);

  if (!lend || lend.status === "ended") {
    return (
      <Screen title={hi ? "मदद के अनुरोध" : "Help requests"}>
        <div className="flex flex-col items-center pt-8 text-center">
          <LendArt className="h-32 w-48" />
          <p className="mt-3 text-[1.1rem]">{lend?.status === "ended" ? (hi ? "सत्र ख़त्म हो गया।" : "The session has ended.") : (hi ? "अभी कोई अनुरोध नहीं।" : "No requests right now.")}</p>
          {lend && <Button className="mt-4" onClick={() => { clearLend(); go(""); }}>{hi ? "ठीक है" : "OK"}</Button>}
        </div>
      </Screen>
    );
  }
  const appName = APPS.find((a) => a.id === lend.app)!;
  if (lend.status === "waiting") {
    return (
      <Screen title={hi ? "मम्मी को मदद चाहिए" : "Mummy needs help"}>
        <div className="flex flex-col items-center pt-6 text-center">
          <LendArt className="h-36 w-52" live />
          <p className="mt-3 text-[1.3rem] font-semibold">{hi ? appName.hi : appName.en} · 15 {hi ? "मिनट" : "min"}</p>
          <p className="mt-1 max-w-xs text-mute">{hi ? "आप सिर्फ़ यही ऐप चला सकेंगे। ओटीपी मम्मी ख़ुद डालेंगी। वो कभी भी बंद कर सकती हैं।" : "You can use only this app. Mummy types the OTP herself, and can end it any time."}</p>
          <Button big className="mt-6 w-full" icon="Check" onClick={startLend}>{hi ? "मदद करें" : "Accept and help"}</Button>
          <Button variant="secondary" className="mt-2 w-full" onClick={clearLend}>{hi ? "अभी नहीं" : "Not now"}</Button>
        </div>
      </Screen>
    );
  }
  return (
    <div className="min-h-full bg-paper">
      <div className="sticky top-0 z-20 bg-brand px-4 py-3 text-white shadow-lg">
        <p className="text-[1.05rem] font-semibold">{hi ? `आप मम्मी के फ़ोन पर ${appName.hi} चला रहे हैं` : `You are using ${appName.en} on Mummy's phone`}</p>
        <p className="text-[0.9rem] text-white/85">{hi ? "बाकी" : "Left"} {mmss(left)} · {hi ? "मम्मी कभी भी बंद कर सकती हैं" : "Mummy can end it any time"}</p>
      </div>
      <MockApp app={lend.app as AppId} mode="control" onDone={() => endLend("done")} />
    </div>
  );
}

/* ---------------- the borrowed app (sample) ---------------- */
interface Field { key: string; en: string; hi: string; value: string }
const TRAIN: Field[] = [
  { key: "from", en: "From", hi: "कहाँ से", value: "Nagpur (NGP)" },
  { key: "to", en: "To", hi: "कहाँ तक", value: "Pune (PUNE)" },
  { key: "date", en: "Date", hi: "तारीख़", value: "" },
  { key: "train", en: "Train", hi: "ट्रेन", value: "Pune Superfast · 8:15 pm · 3A" },
  { key: "pax", en: "Passenger", hi: "यात्री", value: "Sunita Sharma, 62, lower berth" },
  { key: "pay", en: "Payment", hi: "भुगतान", value: "₹1,240 · UPI" },
];
const BANK: Field[] = [
  { key: "open", en: "Account", hi: "खाता", value: "Savings ••4821" },
  { key: "tx", en: "Recent payments", hi: "हाल के भुगतान", value: "Opened" },
  { key: "find", en: "Gas agency, ₹903", hi: "गैस एजेंसी, ₹903", value: "Found: yesterday 6:40 pm" },
  { key: "status", en: "Status", hi: "स्थिति", value: "SUCCESS · money reached" },
];

function MockApp({ app, mode, onDone }: { app: AppId; mode: "watch" | "control"; onDone: () => void }) {
  const { lang } = useStore();
  const hi = lang === "hi";
  const tomorrow = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString(hi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", weekday: "short" }); }, [hi]);
  const fields = (app === "train" ? TRAIN : BANK).map((f) => (f.key === "date" ? { ...f, value: tomorrow } : f));
  const needsOtp = app === "train";
  const [step, setStep] = useState(0); // number of fields filled
  const [otp, setOtp] = useState("");
  const [finished, setFinished] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 40, y: 40 });
  const atOtp = needsOtp && step >= fields.length;
  const otpRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (atOtp) window.setTimeout(() => otpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300); }, [atOtp]);

  // in watch mode, Rahul's actions play out on the parent's screen
  useEffect(() => {
    if (mode !== "watch" || step >= fields.length || finished) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1700);
    return () => window.clearTimeout(t);
  }, [mode, step, fields.length, finished]);

  useEffect(() => {
    const el = refs.current[Math.min(step, fields.length - 1)];
    if (el && box.current) setCursor({ x: el.offsetLeft + el.offsetWidth - 70, y: el.offsetTop + el.offsetHeight / 2 });
  }, [step, fields.length]);

  useEffect(() => {
    if (!needsOtp && step >= fields.length && !finished) {
      const t = window.setTimeout(() => setFinished(true), 900);
      return () => window.clearTimeout(t);
    }
  }, [needsOtp, step, fields.length, finished]);

  useEffect(() => {
    if (otp.length === 6) { const t = window.setTimeout(() => setFinished(true), 500); return () => window.clearTimeout(t); }
  }, [otp]);

  if (finished) {
    return (
      <div className="flex flex-col items-center px-6 pt-10 text-center">
        <SuccessBurst size={140} />
        <p className="mt-3 text-[1.4rem] font-semibold">{app === "train" ? (hi ? "टिकट बुक हो गया" : "Ticket booked") : (hi ? "पैसे पहुँच गए" : "The payment went through")}</p>
        <p className="mt-1 text-mute">{app === "train" ? (hi ? "पुणे सुपरफ़ास्ट · कल रात 8:15 · 3A, लोअर बर्थ" : "Pune Superfast · tomorrow 8:15 pm · 3A, lower berth") : (hi ? "गैस एजेंसी को ₹903, कल शाम" : "₹903 to the gas agency, yesterday evening")}</p>
        <Button big className="mt-8 w-full" onClick={onDone}>{hi ? "मदद ख़त्म करें" : "Finish help"}</Button>
      </div>
    );
  }

  return (
    <div className="relative px-4 pt-4 pb-28" ref={box}>
      <div className="overflow-hidden rounded-[28px] bg-card shadow-sm">
        <div className={`px-4 py-3 text-white ${app === "train" ? "bg-[#2E6E9E]" : "bg-[#2F6B4E]"}`}>
          <p className="text-[1.15rem] font-bold">{app === "train" ? (hi ? "ट्रेन टिकट" : "Train tickets") : (hi ? "बैंक ऐप" : "Bank app")}</p>
          <p className="text-[0.8rem] text-white/80">{hi ? "नमूना ऐप" : "Sample app"}</p>
        </div>
        <div className="flex flex-col gap-2 p-3">
          {fields.map((f, i) => {
            const filled = i < step;
            const active = i === step && !atOtp;
            return (
              <div key={f.key} ref={(el) => (refs.current[i] = el)}
                className={`rounded-[22px] border-2 px-3 py-2.5 transition-colors ${active ? "border-saffron bg-saffron-soft" : filled ? "border-hair bg-paper" : "border-dashed border-hair"}`}>
                <p className="text-[0.85rem] text-mute">{hi ? f.hi : f.en}</p>
                <AnimatePresence>
                  {filled && (
                    <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-[1.08rem] font-semibold">
                      {f.value}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!filled && <p className="text-[1.05rem] text-mute/60">…</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rahul's cursor */}
      {!atOtp && step < fields.length && (
        <motion.div className="pointer-events-none absolute z-10 flex items-center gap-1" animate={{ left: cursor.x, top: cursor.y }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
          <MousePointer2 size={28} className="fill-[#1E5B4F] text-white drop-shadow" />
          <span className="rounded-full bg-brand px-2 py-0.5 text-[0.8rem] font-semibold text-white">{hi ? "राहुल" : "Rahul"}</span>
        </motion.div>
      )}

      {mode === "control" && !atOtp && step < fields.length && (
        <Button big className="mt-4 w-full" icon="MousePointerClick" onClick={() => setStep((s) => s + 1)}>
          {hi ? `${fields[step][hi ? "hi" : "en"]} भरें` : `Fill ${fields[step].en.toLowerCase()}`}
        </Button>
      )}

      {/* OTP: only the parent can type it */}
      {atOtp && mode === "watch" && (
        <motion.div ref={otpRef} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 scroll-mt-24">
          <motion.div initial={{ y: -40 }} animate={{ y: 0 }} className="mb-3 rounded-[22px] bg-ink p-3 text-white shadow-xl">
            <p className="text-[0.85rem] text-white/70">{hi ? "मैसेज · BK-MYBANK" : "Message · BK-MYBANK"}</p>
            <p className="text-[1rem]"><b className="rounded bg-saffron px-1 text-ink">482913</b> {hi ? "आपका ₹1,240 का ओटीपी है। किसी को न बताएँ।" : "is your OTP for ₹1,240. Do not share it."}</p>
          </motion.div>
          <div className="rounded-[22px] bg-card p-3">
            <p className="flex items-center gap-2 text-[1.05rem] font-semibold"><ShieldCheck size={22} className="text-brand" />{hi ? "राहुल यह नहीं देख सकते। ओटीपी आप ख़ुद डालिए।" : "Rahul can't see this. Type the OTP yourself."}</p>
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={`flex h-12 w-10 items-center justify-center rounded-2xl border-2 text-[1.4rem] font-bold ${otp[i] ? "border-brand bg-white" : "border-transparent bg-card"}`}>{otp[i] ? "•" : ""}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k) => (
                k === "" ? <span key="blank" /> :
                <motion.button key={k} whileTap={{ scale: 0.92 }} onClick={() => setOtp((o) => (k === "del" ? o.slice(0, -1) : o.length < 6 ? o + k : o))}
                  className="flex h-14 items-center justify-center rounded-[22px] bg-white text-[1.5rem] font-semibold shadow-sm" aria-label={k === "del" ? "Delete" : k}>
                  {k === "del" ? <Delete size={24} /> : k}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      {atOtp && mode === "control" && (
        <div className="mt-4 rounded-[22px] bg-[#FFF4DC] p-4 text-center">
          <p className="text-[1.1rem] font-semibold">{hi ? "मम्मी ओटीपी डाल रही हैं…" : "Mummy is typing the OTP…"}</p>
          <p className="mt-1 text-[0.95rem] text-mute">{hi ? "ओटीपी सिर्फ़ उनके फ़ोन पर दिखता है। आपको माँगना नहीं है।" : "The OTP shows only on her phone. You never need to ask for it."}</p>
          <Button variant="secondary" className="mt-3 w-full" onClick={() => setFinished(true)}>{hi ? "डेमो: मम्मी ने डाल दिया" : "Demo: Mummy typed it"}</Button>
        </div>
      )}
    </div>
  );
}
