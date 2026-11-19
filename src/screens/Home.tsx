import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Bell, HeartHandshake, KeyRound, Printer, Sparkles, Clock, FileText, Send, Plus } from "lucide-react";
import { CATEGORIES, READY_FOR, readyDefaultWho, type Doc, type Request } from "../data";
import { useStore } from "../store";
import { Button, Chip, MicButton, Sheet } from "../components/ui";

import { Avatar, DocArt } from "../art";
import { WatermarkPreview, stampText } from "../components/Watermark";
import { CatArt, GlassFolder, HeroScene, LendArt, ReadyArt, SuccessBurst, type PeekPaper } from "../illustrations";
import { matchBundleItem } from "../search";
import { daysUntil, fmtDate, timeAgo } from "../i18n";

const rise = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 * i, type: "spring" as const, stiffness: 240, damping: 24 } });

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { settings, setSettings } = useStore();
  return (
    <div className={`relative flex rounded-full p-1 text-[0.92rem] font-semibold ${dark ? "bg-white/15" : "bg-white ring-1 ring-[#D8D8DE]"}`} role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button key={l} onClick={() => setSettings({ lang: l })} aria-pressed={settings.lang === l}
          className={`relative z-10 h-11 min-w-12 rounded-full px-3 ${settings.lang === l ? "text-white" : "text-ink"}`}>
          {settings.lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: "spring", stiffness: 420, damping: 30 }} />}
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

function greeting(lang: string) {
  if (lang === "hi") return "नमस्ते";
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}


/* ---------- a card in the "My Lists" style: meta row, big centred title, stickers peeking out ---------- */
function StickerCard({ metaLeft, metaRight, title, sub, onClick, children, guide, index = 0, tone = "bg-white lift" }: {
  metaLeft: React.ReactNode; metaRight?: React.ReactNode; title: string; sub?: string; onClick?: () => void; children?: React.ReactNode; guide?: string; index?: number; tone?: string;
}) {
  return (
    <motion.button {...rise(index)} whileTap={{ scale: 0.98 }} whileHover="lift" onClick={onClick} data-guide={guide}
      className={`relative flex min-h-[218px] w-full flex-col justify-start overflow-hidden rounded-[28px] ${tone} px-4 pt-3.5 text-center`}>
      <span className="flex items-center justify-between text-[0.88rem] text-mute">
        <span className="flex items-center gap-1.5">{metaLeft}</span>
        <span className="flex items-center gap-1.5">{metaRight}</span>
      </span>
      <span className="title-tight mt-2 block text-[1.55rem] leading-tight font-bold">{title}</span>
      {sub && <span className="mt-1 block text-[0.95rem] text-mute">{sub}</span>}
      <motion.span className="relative -mb-6 mt-auto flex items-end justify-center gap-1 pt-3" variants={{ lift: { y: -10 } }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        {children}
      </motion.span>
    </motion.button>
  );
}

function DocSticker({ doc, tilt = 0, w = 112 }: { doc: Doc; tilt?: number; w?: number }) {
  const { person } = useStore();
  return (
    <span className="sticker block shrink-0" style={{ width: w }} data-tilt={tilt}>
      {doc.paperOnly ? (
        <span className="flex aspect-[1.5] w-full flex-col items-center justify-center rounded-lg bg-[#F0EEE8] text-[0.7rem] font-semibold text-mute">
          <FileText size={22} />{doc.title.slice(0, 16)}
        </span>
      ) : (
        <DocArt doc={doc} ownerName={(person(doc.personId)?.name ?? "") + " Sharma"} className="block h-auto w-full rounded-lg" />
      )}
    </span>
  );
}

/* ---------- filters ---------- */
type Filter = "all" | "mine" | "other" | "due";
function useFiltered(filter: Filter) {
  const { data } = useStore();
  return useMemo(() => {
    if (filter === "mine") return data.docs.filter((d) => d.personId === "sunita");
    if (filter === "other") return data.docs.filter((d) => d.personId === "ramesh");
    if (filter === "due") return data.docs.filter((d) => d.expiry && daysUntil(d.expiry) <= 60);
    return data.docs;
  }, [data.docs, filter]);
}

function FilterChips({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  const { lang, settings, data, person } = useStore();
  const hi = lang === "hi";
  const keeper = settings.role === "keeper";
  const due = data.docs.filter((d) => d.expiry && daysUntil(d.expiry) <= 60).length;
  const opts: { id: Filter; label: React.ReactNode }[] = [
    { id: "all", label: hi ? "सब" : "All" },
    { id: "mine", label: keeper ? (hi ? "मेरे" : "Mine") : hi ? "मम्मी" : "Mummy" },
    { id: "other", label: keeper ? (hi ? "रमेश जी" : "Ramesh") : hi ? "पापा" : "Papa" },
    { id: "due", label: <>{hi ? "जल्द करना" : "Due soon"}<span className="ml-1 rounded-full bg-danger px-1.5 text-[0.75rem] text-white">{due}</span></> },
  ];
  return (
    <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
      {opts.map((o) => <Chip key={o.id} active={value === o.id} onClick={() => onChange(o.id)}>{o.label}</Chip>)}
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-white ring-1 ring-[#D8D8DE] px-3">
        <span className="text-[0.95rem] font-medium">{hi ? "साझा" : "Shared"}</span>
        <span className="flex -space-x-2">{["ramesh", "rahul", "priya"].map((p) => <Avatar key={p} person={person(p)} size={26} ring />)}</span>
      </span>
    </div>
  );
}

function paperTone(d: Doc): PeekPaper["tone"] {
  if (d.paperOnly) return "paper";
  if (d.expiry && daysUntil(d.expiry) <= 60) return "due";
  if (d.source === "digilocker") return "verified";
  return "plain";
}

function Folders({ docs, view }: { docs: Doc[]; view: "grid" | "list" }) {
  const { lang, go, data } = useStore();
  const cats = CATEGORIES.map((c) => ({ c, ds: docs.filter((d) => d.category === c.id) })).filter((x) => x.ds.length || docs === data.docs);
  if (view === "list") {
    return (
      <div className="flex flex-col gap-2">
        {cats.map(({ c, ds }, i) => (
          <motion.button key={c.id} {...rise(i)} whileTap={{ scale: 0.98 }} onClick={() => go(`cat/${c.id}`)}
            className="flex min-h-20 items-center gap-3 rounded-[22px] bg-white lift px-4 text-left">
            <span className="sticker block"><CatArt id={c.id} className="h-11 w-11" /></span>
            <span className="flex-1 text-[1.1rem] font-semibold">{lang === "hi" ? c.hi : c.en}</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.9rem] font-semibold text-mute">{ds.length}</span>
            <ChevronRight size={20} className="text-mute" />
          </motion.button>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {cats.map(({ c, ds }, i) => (
        <GlassFolder key={c.id} id={c.id} index={i} label={lang === "hi" ? c.hi : c.en} count={ds.length}
          papers={(ds.length ? ds : [{ paperOnly: false } as Doc]).slice(0, 3).map((d, k) => ({ tone: ds.length ? paperTone(d) : "plain", tilt: [-4, 3, 7][k] }))}
          onClick={() => go(`cat/${c.id}`)} />
      ))}
    </div>
  );
}



function ReadyCards({ docs }: { docs: Doc[] }) {
  const { lang, go } = useStore();
  const hi = lang === "hi";
  return (
    <div className="flex flex-col gap-3">
      {READY_FOR.map((r, i) => {
        const forWho = docs.filter((d) => d.personId === readyDefaultWho(r.id));
        const found = r.items.flatMap((it) => matchBundleItem(forWho, it.match).slice(0, 1));
        const have = r.items.filter((it) => matchBundleItem(forWho, it.match).length).length;
        const missing = r.items.length - have;
        return (
          <StickerCard key={r.id} index={i} guide={`ready-${r.id}`} onClick={() => go(`ready/${r.id}`)}
            metaLeft={<><Clock size={15} /> {hi ? "तैयारी" : "Get ready"}</>}
            metaRight={<><FileText size={15} /> {r.items.length}</>}
            title={hi ? r.hi : r.en}
            sub={missing ? (hi ? `${r.items.length} में से ${have} ऐप में मिले` : `${have} of ${r.items.length} found in the app`) : hi ? "सब मिल गया, फ़ाइलों के साथ" : "All found, with their files"}>
            <span className="sticker mb-6 block"><ReadyArt id={r.id} className="h-20 w-24" /></span>
            {found.slice(0, 2).map((d, k) => <DocSticker key={d.id + k} doc={d} tilt={[4, -3][k]} w={104} />)}
          </StickerCard>
        );
      })}
    </div>
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
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.1 }}
        className="relative mt-5 rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_-14px_rgba(40,70,20,0.28)]">
        <div className="flex items-start gap-3">
          <span className="relative shrink-0"><Avatar person={from} size={40} /><span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#34C759]" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.94rem] text-mute">{lang === "hi" ? `${fromName} ने माँगा` : `${fromName} asked for`} · {timeAgo(req.at, lang)}</p>
            <p className="text-[1.12rem] leading-snug font-semibold">{doc ? docTitle(doc) : req.docName}</p>
            <p className="text-[0.94rem] text-mute">{t("forPurpose")}: {req.purpose}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 pl-[52px]">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setOpen(true)} className="flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[1rem] font-semibold text-white">
            <Send size={17} /> {t("sendOne")}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => answerRequest(req.id, "declined")} className="h-11 rounded-full px-4 text-[1rem] font-semibold text-ink">{t("notNow")}</motion.button>
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
    <div className="mt-2 flex items-start gap-2 rounded-[22px] bg-white lift p-3 text-[1rem]">
      <span className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-black/20" style={{ background: f?.color }} />
      {locationLine(fileId)}
    </div>
  );
}




export function KeeperHome() {
  return <SimpleHome />;
}

/* ================= sections in the clean style ================= */
const LIFT = "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_-16px_rgba(40,70,20,0.28)]";

function H2({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center justify-between">
      <h2 className="title-tight text-[1.3rem] font-bold">{children}</h2>
      {right}
    </div>
  );
}
function SeeAllLink({ to }: { to: string }) {
  const { go, t } = useStore();
  return <button onClick={() => go(to)} className="min-h-11 px-1 text-[1rem] font-semibold text-brand">{t("seeAll")}</button>;
}


function ComingUp({ limit = 3 }: { limit?: number }) {
  const { data, lang, t, go, personName } = useStore();
  const list = data.reminders.filter((r) => !r.done).sort((a, b) => a.due.localeCompare(b.due)).slice(0, limit);
  if (!list.length) return null;
  return (
    <>
      <H2 right={<SeeAllLink to="reminders" />}>{t("comingUp")}</H2>
      <div className={`overflow-hidden rounded-[22px] ${LIFT}`}>
        {list.map((r, i) => {
          const n = daysUntil(r.due);
          const urgent = n <= 14;
          const d = new Date(r.due);
          return (
            <motion.button key={r.id} whileTap={{ scale: 0.99 }} onClick={() => (r.docId ? go(`doc/${r.docId}`) : go("reminders"))}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left ${i ? "border-t border-[#ECECF0]" : ""}`}>
              <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl leading-none ${urgent ? "bg-danger text-white" : "bg-brand-soft text-brand"}`}>
                <span className="text-[1.12rem] font-bold">{d.getDate()}</span>
                <span className="mt-0.5 text-[0.75rem] font-semibold uppercase">{d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short" })}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.06rem] leading-snug font-semibold">{lang === "hi" ? r.titleHi : r.title}</span>
                <span className={`block text-[0.94rem] ${urgent ? "font-semibold text-danger" : "text-mute"}`}>{n} {t("daysLeft")} · {r.notify.map((p) => personName(p)).join(", ")}</span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-mute" />
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function WhatIsWhere() {
  const { data, lang, go } = useStore();
  const hi = lang === "hi";
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => go("where")} className={`mt-3 flex w-full items-center gap-4 rounded-[22px] p-3 pr-4 text-left ${LIFT}`}>
      <span className="flex h-20 w-20 shrink-0 items-end justify-center overflow-hidden rounded-[18px] bg-brand-soft"><HeroScene className="h-[4.75rem] w-[4.75rem]" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1.12rem] leading-tight font-semibold">{hi ? "क्या कहाँ रखा है" : "What is where"}</span>
        <span className="mt-1 block text-[0.94rem] text-mute">{data.files.length} {hi ? "फ़ाइलें" : "files"} · {data.places.length} {hi ? "जगहें" : "places"}</span>
      </span>
      <ChevronRight size={20} className="shrink-0 text-mute" />
    </motion.button>
  );
}

function SafetyLinks() {
  const { t, settings, lang, go } = useStore();
  const items = [
    { icon: HeartHandshake, label: settings.role === "keeper" ? t("unwellTitle") : lang === "hi" ? "अगर मम्मी-पापा की तबियत ख़राब हो" : "If Mummy or Papa is unwell", to: "unwell" },
    { icon: KeyRound, label: t("diaryTitle"), to: "diary" },
    ...(settings.role === "keeper" ? [{ icon: Printer, label: t("printIndex"), to: "print" }] : []),
  ];
  return (
    <div className={`overflow-hidden rounded-[22px] ${LIFT}`}>
      {items.map((i, k) => (
        <motion.button key={i.to} whileTap={{ scale: 0.99 }} onClick={() => go(i.to)} className={`flex min-h-[3.75rem] w-full items-center gap-3 px-4 text-left ${k ? "border-t border-[#ECECF0]" : ""}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><i.icon size={20} aria-hidden /></span>
          <span className="flex-1 text-[1.06rem] font-semibold">{i.label}</span>
          <ChevronRight size={20} className="text-mute" aria-hidden />
        </motion.button>
      ))}
    </div>
  );
}

function QuickPair({ items }: { items: { icon: any; label: string; to: string; guide?: string }[] }) {
  const { go } = useStore();
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {items.map((x) => (
        <motion.button key={x.to} whileTap={{ scale: 0.98 }} onClick={() => go(x.to)} data-guide={x.guide} className={`flex items-center gap-3 rounded-[20px] p-3 pr-4 text-left ${LIFT}`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><x.icon size={21} /></span>
          <span className="text-[1.06rem] leading-tight font-semibold">{x.label}</span>
        </motion.button>
      ))}
    </div>
  );
}


function SimpleTop() {
  const { lang, go, data } = useStore();
  const hi = lang === "hi";
  const due = data.reminders.filter((r) => !r.done && daysUntil(r.due) <= 14).length;
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[1rem] text-mute">{greeting(lang)}</p>
        <h1 className="title-tight text-[2rem] leading-[1.12] font-bold">{hi ? "सुनीता जी" : "Sunita ji"}</h1>
      </div>
      <div className="flex items-center gap-2">
        <LangToggle />
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => go("reminders")} aria-label="Reminders"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-10px_rgba(0,0,0,0.35)]">
          <Bell size={20} />
          {due > 0 && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger" />}
        </motion.button>
      </div>
    </div>
  );
}

function FindField({ big = false }: { big?: boolean }) {
  const { go, lang } = useStore();
  return (
    <div className={`flex items-center gap-2 rounded-full bg-white pr-1.5 pl-5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_24px_-14px_rgba(40,70,20,0.3)] ${big ? "h-16" : "h-14"}`}>
      <motion.button whileTap={{ scale: 0.99 }} onClick={() => go("find")} data-guide="home-find" className="flex h-full min-w-0 flex-1 items-center gap-3 text-left text-[1.06rem] text-mute">
        <Search size={21} className="shrink-0 text-ink" aria-hidden />
        <span className="truncate">{lang === "hi" ? "कागज़ ढूँढें" : "Find a paper"}</span>
      </motion.button>
      <MicButton size="md" onText={(text, final) => final && go(`find?q=${encodeURIComponent(text)}`)} />
    </div>
  );
}



export function SimpleHome() {
  const { data, lang } = useStore();
  const hi = lang === "hi";
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  return (
    <div className="pb-28">
      <div className="wash pt-safe px-4 pb-2">
        <SimpleTop />
        <SimpleB pending={pending} />
      </div>
      <div className="px-4">
        <H2>{hi ? "मेरी फ़ाइलें" : "My files"}</H2>
        <Folders docs={data.docs} view="grid" />
        <H2>{hi ? "किसके लिए तैयारी?" : "Get ready for"}</H2>
        <ReadyCards docs={data.docs} />
        <ComingUp />
        <H2>{hi ? "घर का हिसाब" : "Just in case"}</H2>
        <SafetyLinks />
        <WhatIsWhere />
      </div>
    </div>
  );
}


/* B: the documents themselves are the buttons */
function SimpleB({ pending }: { pending: Request[] }) {
  const { data, lang, go, person, docTitle } = useStore();
  const hi = lang === "hi";
  const often = data.docs.filter((d) => !d.paperOnly && d.personId === "sunita").slice(0, 4);
  return (
    <>
      <div className="mt-6"><FindField /></div>
      {pending.map((q) => <RequestCard key={q.id} req={q} />)}
      <p className="mt-6 mb-3 text-[1.12rem] font-semibold">{hi ? "जल्दी खोलें" : "Quick access"}</p>
      <div className="no-scrollbar -mx-4 flex items-start gap-3 overflow-x-auto px-4 pb-1">
        {often.map((d, i) => (
          <motion.button key={d.id} {...rise(i)} whileTap={{ scale: 0.97 }} onClick={() => go(`doc/${d.id}`)} className="flex w-[8.5rem] shrink-0 flex-col text-left">
            <span className="block overflow-hidden rounded-[14px] bg-white p-1.5 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]">
              <DocArt doc={d} ownerName={(person(d.personId)?.name ?? "") + " Sharma"} className="block h-auto w-full rounded-[10px]" />
            </span>
            <span className="mt-2 block text-[1rem] leading-tight font-semibold">{docTitle(d)}</span>
          </motion.button>
        ))}
      </div>
      <QuickPair items={[
        { icon: Sparkles, label: hi ? "कैसे करें" : "Show me how", to: "help", guide: "home-help" },
        { icon: Plus, label: hi ? "कागज़ जोड़ें" : "Add a paper", to: "add", guide: "home-add" },
      ]} />
    </>
  );
}


export function HelperHome() {
  const { data, t, lang, go, docTitle, startLend, person } = useStore();
  const hi = lang === "hi";
  const [filter, setFilter] = useState<Filter>("all");
  const docs = useFiltered(filter);
  const mine = data.requests.filter((q) => q.from === "rahul").slice(0, 3);
  const lend = data.lend;
  const due = data.reminders.filter((r) => !r.done && daysUntil(r.due) <= 14).length;
  return (
    <div className="pb-28">
      <div className="wash pt-safe px-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-[1rem] text-mute">{hi ? "नागपुर · बेंगलुरु से" : "Nagpur · from Bengaluru"}</p>
          <div className="flex items-center gap-2">
            <LangToggle />
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => go("reminders")} aria-label="Reminders" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-10px_rgba(0,0,0,0.35)]">
              <Bell size={20} />{due > 0 && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger" />}
            </motion.button>
          </div>
        </div>
        <h1 className="title-tight mt-1 text-[2rem] leading-[1.12] font-bold">{hi ? "मम्मी-पापा के कागज़" : "Mummy & Papa's papers"}</h1>
        <div className="mt-3"><FindField /></div>
        <FilterChips value={filter} onChange={setFilter} />
      </div>
      <div className="px-4">
        {lend?.status === "waiting" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-[22px] p-4 ${LIFT}`}>
            <div className="flex items-center gap-3">
              <span className="block"><LendArt className="h-14 w-20" live /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[1.12rem] font-semibold">{hi ? "मम्मी को मदद चाहिए" : "Mummy needs your help"}</p>
                <p className="text-[0.94rem] text-mute">{lend.app === "train" ? (hi ? "ट्रेन टिकट" : "Train tickets") : hi ? "बैंक ऐप" : "Bank app"} · 15 {hi ? "मिनट" : "min"}</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { startLend(); go("lend"); }} className="mt-3 ml-[5.75rem] flex h-11 items-center rounded-full bg-brand px-5 font-semibold text-white">{hi ? "मदद करें" : "Help now"}</motion.button>
          </motion.div>
        )}
        {lend?.status === "active" && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => go("lend")} className="mt-5 flex h-12 items-center rounded-full bg-brand px-5 font-semibold text-white">{hi ? "मम्मी के फ़ोन पर वापस जाएँ" : "Back to Mummy's phone"}</motion.button>
        )}
        {mine.length > 0 && (
          <>
            <H2>{t("yourRequests")}</H2>
            <div className={`overflow-hidden rounded-[22px] ${LIFT}`}>
              {mine.map((q, i) => {
                const doc = data.docs.find((d) => d.id === q.docId);
                return (
                  <motion.button key={q.id} whileTap={{ scale: 0.99 }} onClick={doc && q.status === "sent" ? () => go(`doc/${doc.id}`) : undefined}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${i ? "border-t border-[#ECECF0]" : ""}`}>
                    <Avatar person={person("sunita")} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.06rem] leading-snug font-semibold">{doc ? docTitle(doc) : q.docName}</span>
                      <span className="block text-[0.94rem] leading-snug text-mute">{q.purpose} · {timeAgo(q.at, lang)}</span>
                      <span className={`mt-1.5 inline-block rounded-full px-3 py-0.5 text-[0.88rem] font-semibold ${q.status === "sent" ? "bg-brand-soft text-brand" : "bg-white ring-1 ring-[#D8D8DE] text-ink"}`}>
                        {q.status === "sent" ? t("received") : q.status === "declined" ? (hi ? "बाद में" : "Later") : t("waiting")}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
        <QuickPair items={[
          { icon: Send, label: hi ? "मम्मी से माँगें" : "Ask Mummy", to: "ask", guide: "home-ask" },
          { icon: Sparkles, label: hi ? "कैसे करें" : "Show me how", to: "help", guide: "home-help" },
        ]} />
        <H2>{hi ? "फ़ाइलें" : "Files"}</H2>
        <Folders docs={docs} view="grid" />
        <ComingUp limit={4} />
        <H2>{hi ? "किसके लिए तैयारी?" : "Get ready for"}</H2>
        <ReadyCards docs={docs} />
        <H2>{hi ? "अगर ज़रूरत पड़े" : "Just in case"}</H2>
        <SafetyLinks />
      </div>
    </div>
  );
}
