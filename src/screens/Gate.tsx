import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Fingerprint } from "lucide-react";
import { useStore } from "../store";
import { AppMark } from "../components/ui";
import { Avatar } from "../art";
import { HeroScene } from "../illustrations";

/* First run: language and who is using the phone (the second matters only for testing). */
export function Onboard() {
  const { data, settings, setSettings } = useStore();
  const [step, setStep] = useState(0);
  const hi = settings.lang === "hi";
  return (
    <div className="wash absolute inset-0 z-[70] flex flex-col overflow-y-auto px-4 pb-8 text-ink" style={{ paddingTop: "calc(var(--top) + 16px)" }}>
      <div className="flex items-center gap-3">
        <AppMark size={44} />
        <span className="text-[1.3rem] font-bold tracking-[-0.01em]">Almari</span>
      </div>
      <h1 className="title-tight mt-8 text-[2rem] leading-[1.12] font-bold">{hi ? "हर कागज़ कहाँ है, पता रहे" : "Know where every paper is"}</h1>
      <p className="mt-2 text-[1.06rem] leading-snug text-mute">{hi ? "फ़ोन पर भी, अलमारी में भी।" : "On the phone, and in the almirah."}</p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mt-6 flex h-56 shrink-0 items-end justify-center overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_30px_-16px_rgba(40,70,20,0.3)]">
        <span className="-mb-2 block"><HeroScene className="h-52 w-60" /></span>
      </motion.div>
      <div className="mt-auto pt-8">
        {step === 0 ? (
          <>
            <p className="mb-3 text-[1.12rem] font-semibold">Choose your language · अपनी भाषा चुनें</p>
            <div className="flex flex-col gap-3">
              {(["en", "hi"] as const).map((l) => (
                <motion.button key={l} whileTap={{ scale: 0.98 }} onClick={() => { setSettings({ lang: l }); setStep(1); }}
                  className={`h-14 rounded-full text-[1.12rem] font-semibold ${l === "en" ? "bg-brand text-white" : "bg-white text-ink shadow-[0_8px_22px_-16px_rgba(0,0,0,0.35)]"}`}>{l === "en" ? "English" : "हिंदी"}</motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-3 text-[1.12rem] font-semibold">{hi ? "यह फ़ोन किसका है?" : "Whose phone is this?"}</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "keeper" as const, p: "sunita", en: "Sunita", hi: "सुनीता", subEn: "Keeps the family's papers", subHi: "घर के कागज़ रखती हैं" },
                { role: "helper" as const, p: "rahul", en: "Rahul", hi: "राहुल", subEn: "Helps from Bengaluru", subHi: "बेंगलुरु से मदद करते हैं" },
              ].map((o) => (
                <motion.button key={o.role} whileTap={{ scale: 0.98 }} onClick={() => setSettings({ role: o.role, onboarded: true })}
                  className="flex min-h-[4.5rem] items-center gap-3 rounded-[22px] bg-white px-4 text-left text-ink shadow-[0_8px_22px_-16px_rgba(0,0,0,0.35)]">
                  <Avatar person={data.people.find((x) => x.id === o.p)} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.12rem] font-semibold">{hi ? o.hi : o.en}</span>
                    <span className="block text-[0.94rem] text-mute">{hi ? o.subHi : o.subEn}</span>
                  </span>
                  <ChevronRight size={20} className="text-mute" />
                </motion.button>
              ))}
            </div>
            <p className="mt-4 text-center text-[0.94rem] text-mute">{hi ? "सैंपल परिवार। सारे नाम काल्पनिक हैं।" : "A sample family. All names are made up."}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* Opens with the phone's own lock: no new password to remember. */
export function Lock() {
  const { t, setUnlocked, settings } = useStore();
  const [pattern, setPattern] = useState(false);
  const [dots, setDots] = useState<number[]>([]);
  const [scanning, setScanning] = useState(false);
  const hi = settings.lang === "hi";
  const open = () => { setScanning(true); setTimeout(() => setUnlocked(true), 550); };
  return (
    <div className="wash absolute inset-0 z-[65] flex flex-col items-center px-6 pb-10 text-center" style={{ paddingTop: "calc(var(--top) + 56px)" }}>
      <AppMark size={80} />
      <span className="mt-4 text-[1.75rem] leading-none font-bold tracking-[-0.02em]">Almari</span>
      <p className="mt-2 text-[1.06rem] text-mute">{settings.role === "keeper" ? (hi ? "सुनीता जी का फ़ोन" : "Sunita's phone") : (hi ? "राहुल का फ़ोन" : "Rahul's phone")}</p>
      {!pattern ? (
        <>
          <motion.button
            whileTap={{ scale: 0.94 }}
            animate={scanning ? {} : { boxShadow: ["0 0 0 0 rgba(42,96,18,0.28)", "0 0 0 22px rgba(42,96,18,0)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            onClick={open}
            className={`mt-auto flex h-24 w-24 items-center justify-center rounded-full ${scanning ? "bg-brand text-white" : "bg-white text-brand shadow-[0_10px_26px_-14px_rgba(40,70,20,0.45)]"}`}
            aria-label={t("touchToOpen")}
          >
            <Fingerprint size={52} strokeWidth={1.6} />
          </motion.button>
          <p className="mt-5 text-[1.12rem] font-semibold">{hi ? "खोलने के लिए छुएँ" : "Touch to open"}</p>
          <button onClick={() => setPattern(true)} className="mt-1 min-h-11 px-4 text-[1rem] font-semibold text-brand">{t("usePattern")}</button>
        </>
      ) : (
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <button key={i} onClick={() => {
                const next = dots.includes(i) ? dots : [...dots, i];
                setDots(next);
                if (next.length >= 4) open();
              }} className={`h-16 w-16 rounded-full ${dots.includes(i) ? "bg-brand" : "bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.4)]"}`} aria-label={`dot ${i + 1}`} />
            ))}
          </div>
          <p className="mt-4 text-[1rem] text-mute">{hi ? "कोई भी 4 बिंदु छुएँ" : "Tap any 4 dots"}</p>
        </div>
      )}
      <p className="mt-auto max-w-xs text-[0.94rem] leading-snug text-mute">{t("noNewPassword")}</p>
    </div>
  );
}
