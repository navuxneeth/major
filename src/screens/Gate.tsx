import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight} from "lucide-react";
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

