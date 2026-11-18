import { useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Bell, HeartHandshake, KeyRound, Printer, Send, Mic, Sparkles, HandHelping, IdCard, LayoutGrid } from "lucide-react";
import { CATEGORIES, READY_FOR, type Request } from "../data";
import { useStore } from "../store";
import { Button, Card, MicButton, SectionTitle, Sheet } from "../components/ui";
import { DocRow } from "../components/DocRow";
import { Avatar } from "../art";
import { WatermarkPreview, stampText } from "../components/Watermark";
import { Blobs, FolderTile, HeroScene, LendArt, ReadyArt, SuccessBurst } from "../illustrations";
import { daysUntil, fmtDate, timeAgo } from "../i18n";

const rise = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.04 * i, type: "spring" as const, stiffness: 260, damping: 24 } });

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { settings, setSettings } = useStore();
  return (
    <div className={`relative flex rounded-full p-0.5 text-[0.95rem] font-semibold ${dark ? "bg-white/15" : "border-2 border-hair bg-white"}`} role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button key={l} onClick={() => setSettings({ lang: l })} aria-pressed={settings.lang === l}
          className={`relative z-10 h-10 min-w-12 rounded-full px-3 ${settings.lang === l ? (dark ? "text-brand" : "text-white") : dark ? "text-white" : "text-ink"}`}>
          {settings.lang === l && <motion.span layoutId={dark ? "lang-pill-d" : "lang-pill"} className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-white" : "bg-brand"}`} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

function Hero({ title, sub, stats }: { title: string; sub: string; stats: { n: number | string; label: string }[] }) {
  const { go } = useStore();
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-b-[36px] bg-brand px-4 pt-3 pb-5 text-white">
      <Blobs className="absolute inset-0 h-full w-full" />
      <div className="relative flex items-center justify-between">
        <span className="font-serif text-[2rem] leading-none">Almari</span>
        <LangToggle dark />
      </div>
      <div className="relative mt-2 flex items-end gap-2">
        <div className="min-w-0 flex-1 pb-2">
          <h1 className="text-[1.55rem] leading-tight font-semibold">{title}</h1>
          <p className="mt-1 text-[0.98rem] text-white/80">{sub}</p>
        </div>
        <HeroScene className="h-36 w-40 shrink-0" />
      </div>
      <div className="relative mt-1 flex gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...rise(i + 2)} className="flex-1 rounded-2xl bg-white/12 px-3 py-2 backdrop-blur">
            <p className="text-[1.35rem] leading-none font-bold">{s.n}</p>
            <p className="mt-1 text-[0.8rem] leading-tight text-white/80">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-3 flex items-center gap-2">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => go("find")} data-guide="home-find"
          className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 text-left text-[1.05rem] text-mute shadow-lg">
          <Search size={24} className="shrink-0 text-brand" aria-hidden />
          <span className="truncate">{useStore().t("findPlaceholder")}</span>
        </motion.button>
        <MicOnHero />
      </div>
    </motion.div>
  );
}

function MicOnHero() {
  const { go } = useStore();
  return (
    <div className="rounded-full ring-4 ring-white/25">
      <MicButton onText={(text, final) => final && go(`find?q=${encodeURIComponent(text)}`)} />
    </div>
  );
}

function QuickActions() {
  const { lang, go } = useStore();
  const hi = lang === "hi";
  const items = [
    { id: "help", icon: Sparkles, en: "Show me how", hi: "कैसे करें, दिखाओ", to: "help", tone: "bg-saffron-soft", guide: "home-help" },
    { id: "lend", icon: HandHelping, en: "Lend my phone", hi: "फ़ोन उधार दें", to: "lend", tone: "bg-sky", guide: "home-lend" },
    { id: "id", icon: IdCard, en: "My ID card", hi: "मेरा आईडी", to: "counter/d1", tone: "bg-sage", guide: "home-id" },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {items.map((i, k) => (
        <motion.button key={i.id} {...rise(k)} whileTap={{ scale: 0.95 }} onClick={() => go(i.to)} data-guide={i.guide}
          className={`flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl ${i.tone} px-1 text-center`}>
          <motion.span whileHover={{ rotate: -8 }} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><i.icon size={24} className="text-brand" /></motion.span>
          <span className="text-[0.92rem] leading-tight font-semibold">{hi ? i.hi : i.en}</span>
        </motion.button>
      ))}
    </div>
  );
}

function Reminders({ limit = 2 }: { limit?: number }) {
  const { data, lang, t, go, personName } = useStore();
  const list = data.reminders.filter((r) => !r.done).sort((a, b) => a.due.localeCompare(b.due)).slice(0, limit);
  if (!list.length) return null;
  return (
    <>
      <SectionTitle right={<button onClick={() => go("reminders")} className="min-h-10 px-1 font-semibold text-brand">{t("seeAll")}</button>}>{t("comingUp")}</SectionTitle>
      <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {list.map((r, i) => {
          const n = daysUntil(r.due);
          const urgent = n <= 14;
          return (
            <motion.button key={r.id} {...rise(i)} whileTap={{ scale: 0.97 }} onClick={() => (r.docId ? go(`doc/${r.docId}`) : go("reminders"))}
              className={`flex w-64 shrink-0 snap-start flex-col gap-2 rounded-2xl p-3 text-left ${urgent ? "bg-danger text-white" : "border border-hair bg-white"}`}>
              <span className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${urgent ? "bg-white/20" : "bg-saffron-soft"}`}>
                  <motion.span animate={urgent ? { rotate: [0, -14, 14, -8, 0] } : {}} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.5 }}><Bell size={22} /></motion.span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[0.85rem] font-bold ${urgent ? "bg-white text-danger" : "bg-saffron-soft"}`}>{n} {t("daysLeft")}</span>
              </span>
              <span className="text-[1.05rem] leading-snug font-semibold">{lang === "hi" ? r.titleHi : r.title}</span>
              <span className={`text-[0.88rem] ${urgent ? "text-white/85" : "text-mute"}`}>{fmtDate(r.due, lang)} · {r.notify.map((p) => personName(p)).join(", ")}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function Folders() {
  const { data, lang, go } = useStore();
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      {CATEGORIES.map((c, i) => {
        const n = data.docs.filter((d) => d.category === c.id).length;
        return (
          <FolderTile key={c.id} id={c.id} index={i} label={lang === "hi" ? c.hi : c.en}
            count={lang === "hi" ? `${n} कागज़` : `${n} ${n === 1 ? "paper" : "papers"}`} onClick={() => go(`cat/${c.id}`)} />
        );
      })}
    </div>
  );
}

function ReadyFor() {
  const { t, lang, go } = useStore();
  return (
    <>
      <SectionTitle>{t("readyFor")}</SectionTitle>
      <div className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
        {READY_FOR.map((r, i) => (
          <motion.button key={r.id} {...rise(i)} whileTap={{ scale: 0.96 }} onClick={() => go(`ready/${r.id}`)} data-guide={`ready-${r.id}`}
            className={`flex w-40 shrink-0 snap-start flex-col items-start gap-2 rounded-3xl ${r.tone} p-3 text-left`}>
            <ReadyArt id={r.id} className="h-16 w-20" />
            <span className="text-[1.02rem] leading-tight font-semibold">{lang === "hi" ? r.hi : r.en}</span>
          </motion.button>
        ))}
      </div>
    </>
  );
}

/* A request from family, shown big on the keeper's home screen. */
function RequestCard({ req }: { req: Request }) {
  const { data, t, lang, person, personName, docTitle, answerRequest, showToast, go } = useStore();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const from = person(req.from);
  const doc = data.docs.find((d) => d.id === req.docId);
  const fromName = personName(req.from);
  const stamp = stampText(lang === "hi" ? `${fromName} (${req.purpose})` : `${fromName} · ${req.purpose}`, fmtDate(new Date().toISOString(), lang), lang);
  const finish = () => { setSent(true); window.setTimeout(() => { answerRequest(req.id, "sent"); setOpen(false); setSent(false); showToast(lang === "hi" ? `भेज दिया। ${fromName} को मिल गया।` : `Sent. ${fromName} has it now.`); }, 1300); };
  return (
    <>
      <motion.div initial={{ y: 16, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.3 }}
        className="relative mt-4 overflow-hidden rounded-3xl border-2 border-saffron bg-saffron-soft p-4">
        <motion.span className="absolute inset-0 rounded-3xl border-4 border-saffron" animate={{ opacity: [0.7, 0, 0.7] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <div className="relative flex items-center gap-3">
          <span className="relative"><Avatar person={from} size={48} /><span className="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#3E8E5A]" /></span>
          <div className="min-w-0">
            <p className="text-[1.15rem] leading-snug font-semibold">{fromName} {t("needsThis")}</p>
            <p className="text-[0.9rem] text-mute">{timeAgo(req.at, lang)}</p>
          </div>
        </div>
        <div className="relative mt-3 rounded-2xl bg-white p-3">
          <p className="text-[1.25rem] font-semibold">{doc ? docTitle(doc) : req.docName}</p>
          <p className="text-[1rem] text-mute">{t("forPurpose")}: {req.purpose}</p>
        </div>
        <div className="relative mt-3 flex gap-2">
          <Button big className="flex-1" icon="Send" onClick={() => setOpen(true)}>{t("sendOne")}</Button>
          <Button big variant="secondary" onClick={() => answerRequest(req.id, "declined")}>{t("notNow")}</Button>
        </div>
      </motion.div>
      <Sheet open={open} onClose={() => setOpen(false)} title={doc ? docTitle(doc) : req.docName}>
        {sent ? (
          <div className="flex flex-col items-center py-6"><SuccessBurst size={130} /><p className="mt-2 text-[1.2rem] font-semibold">{lang === "hi" ? "भेज दिया" : "Sent"}</p></div>
        ) : doc && !doc.paperOnly ? (
          <>
            <WatermarkPreview doc={doc} stamp={stamp} masked={doc.art === "aadhaar"} ownerName={(person(doc.personId)?.name ?? "") + " Sharma"} />
            <p className="mt-2 text-[0.95rem] text-mute">{t("shareForNote")}</p>
            <Button big className="mt-4 w-full" icon="Send" onClick={finish}>{lang === "hi" ? `${fromName} को भेजें` : `Send to ${fromName}`}</Button>
          </>
        ) : (
          <>
            <p className="text-[1.05rem]">{t("onlyPaper")}</p>
            {doc && <PlaceLine fileId={doc.fileId} />}
            <Button big className="mt-4 w-full" icon="Camera" onClick={() => { setOpen(false); go(`add?req=${req.id}&name=${encodeURIComponent(doc ? doc.title : req.docName)}${doc ? `&doc=${doc.id}` : ""}`); }}>
              {t("takePhotoNow")}
            </Button>
            {doc && <Button variant="secondary" className="mt-2 w-full" icon="MapPin" onClick={finish}>{lang === "hi" ? "सिर्फ़ जगह बताएँ" : "Just tell where it is"}</Button>}
          </>
        )}
      </Sheet>
    </>
  );
}

function PlaceLine({ fileId }: { fileId: string | null }) {
  const { locationLine, file } = useStore();
  const f = file(fileId);
  return (
    <div className="mt-2 flex items-start gap-2 rounded-xl bg-white p-3 text-[1rem]">
      <span className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-black/20" style={{ background: f?.color }} />
      {locationLine(fileId)}
    </div>
  );
}

function QuickLinks() {
  const { t, go, settings, lang } = useStore();
  const items = [
    { icon: HeartHandshake, label: settings.role === "keeper" ? t("unwellTitle") : lang === "hi" ? "अगर मम्मी-पापा की तबियत ख़राब हो" : "If Mummy or Papa is unwell", to: "unwell", tone: "bg-danger-soft text-danger" },
    { icon: KeyRound, label: t("diaryTitle"), to: "diary", tone: "bg-saffron-soft text-ink" },
    ...(settings.role === "keeper" ? [{ icon: Printer, label: t("printIndex"), to: "print", tone: "bg-sky text-ink" }] : []),
  ];
  return (
    <div className="mt-6 flex flex-col gap-2">
      {items.map((i, k) => (
        <motion.div key={i.to} {...rise(k)}>
          <Card onClick={() => go(i.to)} className="flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${i.tone}`}><i.icon size={24} aria-hidden /></span>
            <span className="flex-1 text-[1.05rem] font-semibold">{i.label}</span>
            <ChevronRight size={22} className="text-mute" aria-hidden />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function greeting(lang: string) {
  if (lang === "hi") return "नमस्ते";
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function KeeperHome() {
  const { data, t, lang, settings } = useStore();
  if (settings.simple) return <SimpleHome />;
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  const due = data.reminders.filter((r) => !r.done && daysUntil(r.due) <= 30).length;
  const hi = lang === "hi";
  return (
    <div className="pb-28">
      <Hero
        title={`${greeting(lang)}, ${hi ? "सुनीता जी" : "Sunita ji"}`}
        sub={hi ? "हर कागज़, और उसकी असली जगह" : "Every paper, and where its original is"}
        stats={[
          { n: data.docs.length, label: hi ? "कागज़" : "papers" },
          { n: data.files.length, label: hi ? "फ़ाइलें" : "files" },
          { n: due, label: hi ? "जल्द करना है" : "due soon" },
        ]}
      />
      <div className="px-4">
        {pending.map((q) => <RequestCard key={q.id} req={q} />)}
        <QuickActions />
        <ReadyFor />
        <Reminders limit={4} />
        <SectionTitle>{t("allFolders")}</SectionTitle>
        <Folders />
        <QuickLinks />
      </div>
    </div>
  );
}

/* Simple mode: four big things, nothing else. The helper turns it on during setup. */
export function SimpleHome() {
  const { data, lang, go, setSettings } = useStore();
  const hi = lang === "hi";
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  const tiles = [
    { icon: Mic, en: "Find a paper", hi: "कागज़ ढूँढें", subEn: "Just say its name", subHi: "बस नाम बोलिए", to: "find", tone: "bg-brand text-white", guide: "home-find" },
    { icon: IdCard, en: "Show my ID", hi: "मेरा आईडी दिखाएँ", subEn: "Aadhaar, big and bright", subHi: "आधार, बड़ा और साफ़", to: "counter/d1", tone: "bg-sage", guide: "home-id" },
    { icon: Sparkles, en: "Show me how", hi: "कैसे करें, दिखाओ", subEn: "A ring shows where to tap", subHi: "घेरा दिखाएगा कहाँ दबाना है", to: "help", tone: "bg-saffron-soft", guide: "home-help" },
    { icon: HandHelping, en: "Ask Rahul to help", hi: "राहुल से मदद लें", subEn: "He can use one app, 15 minutes", subHi: "एक ऐप, 15 मिनट", to: "lend", tone: "bg-sky", guide: "home-lend" },
  ];
  return (
    <div className="px-4 pt-3 pb-28">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[2.1rem] leading-none text-brand">Almari</span>
        <LangToggle />
      </div>
      <h1 className="mt-3 text-[1.7rem] leading-tight font-semibold">{greeting(lang)}, {hi ? "सुनीता जी" : "Sunita ji"}</h1>
      {pending.map((q) => <RequestCard key={q.id} req={q} />)}
      <div className="mt-4 flex flex-col gap-3">
        {tiles.map((x, i) => (
          <motion.button key={x.en} {...rise(i)} whileTap={{ scale: 0.97 }} onClick={() => go(x.to)} data-guide={x.guide}
            className={`flex min-h-24 items-center gap-4 rounded-3xl px-5 text-left ${x.tone}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${x.tone.includes("text-white") ? "bg-white/20" : "bg-white"}`}><x.icon size={30} /></span>
            <span>
              <span className="block text-[1.3rem] leading-tight font-semibold">{hi ? x.hi : x.en}</span>
              <span className={`block text-[0.98rem] ${x.tone.includes("text-white") ? "text-white/80" : "text-mute"}`}>{hi ? x.subHi : x.subEn}</span>
            </span>
          </motion.button>
        ))}
      </div>
      <h2 className="mt-7 mb-3 text-[1.3rem] font-semibold">{hi ? "मेरी फ़ाइलें" : "My files"}</h2>
      <Folders />
      <SimpleExtra />
      <button onClick={() => setSettings({ simple: false })} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-hair bg-white font-semibold text-mute">
        <LayoutGrid size={20} /> {hi ? "सारे फ़ीचर दिखाएँ" : "Show all features"}
      </button>
    </div>
  );
}

function SimpleExtra() {
  const { lang, go } = useStore();
  const hi = lang === "hi";
  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      <button onClick={() => go("reminders")} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-hair bg-white font-semibold"><Bell size={20} /> {hi ? "याद दिलाना" : "Reminders"}</button>
      <button onClick={() => go("more")} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-hair bg-white font-semibold">{hi ? "सेटिंग" : "Settings"}</button>
    </div>
  );
}

export function HelperHome() {
  const { data, t, lang, go, personName, docTitle, startLend } = useStore();
  const hi = lang === "hi";
  const mine = data.requests.filter((q) => q.from === "rahul").slice(0, 3);
  const recent = data.activity.filter((a) => a.who !== "rahul" && a.docId).slice(0, 3);
  const due = data.reminders.filter((r) => !r.done && daysUntil(r.due) <= 30).length;
  const lend = data.lend;
  return (
    <div className="pb-28">
      <Hero
        title={t("parentsDocs")}
        sub={hi ? "नागपुर · आप बेंगलुरु से देख रहे हैं" : "Nagpur · you are viewing from Bengaluru"}
        stats={[
          { n: data.docs.length, label: hi ? "कागज़" : "papers" },
          { n: due, label: hi ? "जल्द करना है" : "due soon" },
          { n: data.requests.filter((q) => q.from === "rahul" && q.status === "pending").length, label: hi ? "माँगे गए" : "asked" },
        ]}
      />
      <div className="px-4">
        {lend?.status === "waiting" && (
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 overflow-hidden rounded-3xl bg-danger p-4 text-white">
            <div className="flex items-center gap-3">
              <LendArt className="h-16 w-24 shrink-0" live />
              <div>
                <p className="text-[1.15rem] font-semibold">{hi ? "मम्मी को मदद चाहिए" : "Mummy needs your help"}</p>
                <p className="text-[0.95rem] text-white/85">{lend.app === "train" ? (hi ? "ट्रेन टिकट" : "Train tickets") : hi ? "बैंक ऐप" : "Bank app"} · 15 {hi ? "मिनट" : "min"}</p>
              </div>
            </div>
            <Button big variant="secondary" className="mt-3 w-full" icon="Check" onClick={() => { startLend(); go("lend"); }}>{hi ? "मदद करें" : "Accept and help"}</Button>
          </motion.div>
        )}
        {lend?.status === "active" && (
          <Button big className="mt-4 w-full" icon="HandHelping" onClick={() => go("lend")}>{hi ? "मम्मी के फ़ोन पर वापस जाएँ" : "Back to Mummy's phone"}</Button>
        )}
        <Button big className="mt-4 w-full" icon="HandHelping" onClick={() => go("ask")}>{t("askMummy")}</Button>
        {mine.length > 0 && (
          <>
            <SectionTitle>{t("yourRequests")}</SectionTitle>
            <div className="flex flex-col gap-2">
              {mine.map((q, i) => {
                const doc = data.docs.find((d) => d.id === q.docId);
                return (
                  <motion.div key={q.id} {...rise(i)}>
                    <Card onClick={doc && q.status === "sent" ? () => go(`doc/${doc.id}`) : undefined} className="flex items-center gap-3">
                      <Send size={22} className="shrink-0 text-brand" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{doc ? docTitle(doc) : q.docName}</span>
                        <span className="block text-[0.9rem] text-mute">{q.purpose} · {timeAgo(q.at, lang)}</span>
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[0.85rem] font-semibold ${q.status === "sent" ? "bg-sage" : q.status === "declined" ? "bg-hair" : "bg-saffron-soft"}`}>
                        {q.status === "sent" ? t("received") : q.status === "declined" ? (hi ? "बाद में" : "Later") : t("waiting")}
                      </span>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
        <Reminders limit={4} />
        <SectionTitle>{t("allFolders")}</SectionTitle>
        <Folders />
        {recent.length > 0 && (
          <>
            <SectionTitle>{hi ? "हाल में घर पर" : "Recently at home"}</SectionTitle>
            <div className="flex flex-col gap-2">
              {recent.map((a) => {
                const doc = data.docs.find((d) => d.id === a.docId);
                if (!doc) return null;
                return (
                  <div key={a.id}>
                    <p className="mb-1 text-[0.9rem] text-mute">{personName(a.who)} · {timeAgo(a.at, lang)}</p>
                    <DocRow doc={doc} />
                  </div>
                );
              })}
            </div>
          </>
        )}
        <QuickLinks />
      </div>
    </div>
  );
}
