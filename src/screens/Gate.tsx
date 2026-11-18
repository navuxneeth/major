import { useState } from "react";
import { motion } from "motion/react";
import { Fingerprint } from "lucide-react";
import { useStore } from "../store";
import { Avatar } from "../art";

/* First run: language and who is using the phone (the second matters only for testing). */
export function Onboard() {
  const { data, settings, setSettings } = useStore();
  const [step, setStep] = useState(0);
  const hi = settings.lang === "hi";
  return (
    <div className="absolute inset-0 z-[70] flex flex-col bg-brand px-6 pt-14 pb-10 text-white">
      <span className="font-serif text-[3.2rem] leading-none">Almari</span>
      <p className="mt-2 text-[1.2rem] text-white/85">{hi ? "हर कागज़ कहाँ है, पता रहे" : "Know where every paper is"}</p>
      <div className="mt-auto">
        {step === 0 ? (
          <>
            <p className="mb-3 text-[1.15rem] font-semibold">Choose your language · अपनी भाषा चुनें</p>
            <div className="flex flex-col gap-3">
              {(["en", "hi"] as const).map((l) => (
                <motion.button key={l} whileTap={{ scale: 0.97 }} onClick={() => { setSettings({ lang: l }); setStep(1); }}
                  className="h-16 rounded-2xl bg-white text-[1.3rem] font-semibold text-ink">{l === "en" ? "English" : "हिंदी"}</motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-3 text-[1.15rem] font-semibold">{hi ? "यह फ़ोन किसका है?" : "Whose phone is this?"}</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "keeper" as const, p: "sunita", en: "Sunita", hi: "सुनीता", subEn: "I keep the family's papers", subHi: "घर के कागज़ मैं रखती हूँ" },
                { role: "helper" as const, p: "rahul", en: "Rahul", hi: "राहुल", subEn: "I help my parents from Bengaluru", subHi: "मैं बेंगलुरु से मम्मी-पापा की मदद करता हूँ" },
              ].map((o) => (
                <motion.button key={o.role} whileTap={{ scale: 0.97 }} onClick={() => setSettings({ role: o.role, onboarded: true })}
                  className="flex min-h-20 items-center gap-3 rounded-2xl bg-white px-4 text-left text-ink">
                  <Avatar person={data.people.find((x) => x.id === o.p)} size={48} />
                  <span>
                    <span className="block text-[1.25rem] font-semibold">{hi ? o.hi : o.en}</span>
                    <span className="block text-[0.98rem] text-mute">{hi ? o.subHi : o.subEn}</span>
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="mt-4 text-center text-[0.9rem] text-white/70">{hi ? "सैंपल परिवार। सारे नाम और नंबर काल्पनिक हैं।" : "A sample family. All names and numbers are made up."}</p>
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
  const open = () => { setScanning(true); setTimeout(() => setUnlocked(true), 550); };
  return (
    <div className="absolute inset-0 z-[65] flex flex-col items-center bg-paper px-6 pt-16 pb-10 text-center">
      <span className="font-serif text-[2.8rem] leading-none text-brand">Almari</span>
      <p className="mt-2 text-[1.05rem] text-mute">{settings.role === "keeper" ? (settings.lang === "hi" ? "सुनीता जी का फ़ोन" : "Sunita's phone") : (settings.lang === "hi" ? "राहुल का फ़ोन" : "Rahul's phone")}</p>
      {!pattern ? (
        <>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={open}
            className={`mt-auto flex h-32 w-32 items-center justify-center rounded-full border-4 ${scanning ? "border-saffron bg-saffron-soft" : "border-brand bg-brand-soft"}`}
            aria-label={t("touchToOpen")}
          >
            <Fingerprint size={72} className={scanning ? "text-saffron" : "text-brand"} />
          </motion.button>
          <p className="mt-4 text-[1.15rem] font-semibold">{t("touchToOpen")}</p>
          <button onClick={() => setPattern(true)} className="mt-3 min-h-12 px-4 font-semibold text-brand">{t("usePattern")}</button>
        </>
      ) : (
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <button key={i} onClick={() => {
                const next = dots.includes(i) ? dots : [...dots, i];
                setDots(next);
                if (next.length >= 4) open();
              }} className={`h-16 w-16 rounded-full border-4 ${dots.includes(i) ? "border-brand bg-brand" : "border-hair bg-white"}`} aria-label={`dot ${i + 1}`} />
            ))}
          </div>
          <p className="mt-4 text-[1rem] text-mute">{settings.lang === "hi" ? "कोई भी 4 बिंदु छुएँ" : "Tap any 4 dots"}</p>
        </div>
      )}
      <p className="mt-auto max-w-xs text-[0.98rem] text-mute">{t("noNewPassword")}</p>
    </div>
  );
}
