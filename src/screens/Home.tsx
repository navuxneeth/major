import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Bell, HeartHandshake, KeyRound, Printer, Mic, Sparkles, HandHelping, IdCard, LayoutGrid, Rows3, Clock, FileText, Send, Plus } from "lucide-react";
import { CATEGORIES, READY_FOR, type CategoryId, type Doc, type Request } from "../data";
import { useStore } from "../store";
import { Button, Chip, MicButton, Sheet } from "../components/ui";
import { DocRow } from "../components/DocRow";
import { Avatar, DocArt } from "../art";
import { WatermarkPreview, stampText } from "../components/Watermark";
import { CatArt, GlassFolder, HeroScene, HelpArt, LendArt, ReadyArt, SuccessBurst, type PeekPaper } from "../illustrations";
import { matchBundleItem } from "../search";
import { daysUntil, fmtDate, timeAgo } from "../i18n";

const rise = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 * i, type: "spring" as const, stiffness: 240, damping: 24 } });

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { settings, setSettings } = useStore();
  return (
    <div className={`relative flex rounded-full p-1 text-[0.92rem] font-semibold ${dark ? "bg-white/15" : "bg-card"}`} role="group" aria-label="Language">
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

/* ---------- top of the screen: greeting, big title, search ---------- */
function Top({ hello, title }: { hello: string; title: string }) {
  const { go, t } = useStore();
  return (
    <div className="pt-safe px-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 text-[1rem] leading-snug text-mute">{hello}</p>
        <LangToggle />
      </div>
      <h1 className="title-tight mt-1 text-[2rem] leading-[1.12] font-bold">{title}</h1>
      <div className="mt-4 flex items-center gap-2">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => go("find")} data-guide="home-find"
          className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full bg-card px-5 text-left text-[1.05rem] text-mute">
          <Search size={22} className="shrink-0 text-ink" aria-hidden />
          <span className="truncate">{t("findPlaceholder")}</span>
        </motion.button>
        <MicButton onText={(text, final) => final && go(`find?q=${encodeURIComponent(text)}`)} />
      </div>
    </div>
  );
}

/* ---------- a card in the "My Lists" style: meta row, big centred title, stickers peeking out ---------- */
function StickerCard({ metaLeft, metaRight, title, sub, onClick, children, guide, index = 0, tone = "bg-card" }: {
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
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-card px-3">
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
            className="flex min-h-20 items-center gap-3 rounded-[22px] bg-card px-4 text-left">
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

function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mt-8 mb-3 flex items-center justify-between">
      <h2 className="title-tight text-[1.3rem] font-bold">{children}</h2>
      {right}
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  const { lang } = useStore();
  return (
    <div className="relative flex rounded-full bg-card p-1">
      {(["grid", "list"] as const).map((v) => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={view === v} aria-label={v === "grid" ? (lang === "hi" ? "ग्रिड" : "Grid") : lang === "hi" ? "लिस्ट" : "List"}
          className="relative z-10 flex h-11 w-12 items-center justify-center rounded-full">
          {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 420, damping: 30 }} />}
          {v === "grid" ? <LayoutGrid size={18} /> : <Rows3 size={18} />}
        </button>
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
        const found = r.items.flatMap((it) => matchBundleItem(docs, it.match).slice(0, 1));
        const missing = r.items.length - r.items.filter((it) => matchBundleItem(docs, it.match).length).length;
        return (
          <StickerCard key={r.id} index={i} guide={`ready-${r.id}`} onClick={() => go(`ready/${r.id}`)}
            metaLeft={<><Clock size={15} /> {hi ? "तैयारी" : "Get ready"}</>}
            metaRight={<><FileText size={15} /> {r.items.length}</>}
            title={hi ? r.hi : r.en}
            sub={missing ? (hi ? `${missing} अभी जोड़ना है` : `${missing} still to add`) : hi ? "सब मिल गया, फ़ाइलों के साथ" : "All found, with their files"}>
            <span className="sticker mb-6 block"><ReadyArt id={r.id} className="h-20 w-24" /></span>
            {found.slice(0, 2).map((d, k) => <DocSticker key={d.id + k} doc={d} tilt={[4, -3][k]} w={104} />)}
          </StickerCard>
        );
      })}
    </div>
  );
}

function Reminders({ limit = 3 }: { limit?: number }) {
  const { data, lang, t, go, personName } = useStore();
  const list = data.reminders.filter((r) => !r.done).sort((a, b) => a.due.localeCompare(b.due)).slice(0, limit);
  if (!list.length) return null;
  return (
    <>
      <SectionLabel right={<button onClick={() => go("reminders")} className="min-h-11 px-2 font-semibold">{t("seeAll")}</button>}>{t("comingUp")}</SectionLabel>
      <div className="flex flex-col gap-2">
        {list.map((r, i) => {
          const n = daysUntil(r.due);
          const urgent = n <= 14;
          return (
            <motion.button key={r.id} {...rise(i)} whileTap={{ scale: 0.98 }} onClick={() => (r.docId ? go(`doc/${r.docId}`) : go("reminders"))}
              className="flex min-h-18 items-center gap-3 rounded-[22px] bg-card px-4 py-3 text-left">
              <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[22px] leading-none ${urgent ? "bg-danger text-white" : "bg-white"}`}>
                <span className="text-[1.15rem] font-bold">{new Date(r.due).getDate()}</span>
                <span className="text-[0.68rem] uppercase">{new Date(r.due).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short" })}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.05rem] leading-snug font-semibold">{lang === "hi" ? r.titleHi : r.title}</span>
                <span className="block text-[0.88rem] text-mute">{n} {t("daysLeft")} · {r.notify.map((p) => personName(p)).join(", ")}</span>
              </span>
              <motion.span animate={urgent ? { rotate: [0, -14, 14, -8, 0] } : {}} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.5 }}><Bell size={20} className={urgent ? "text-danger" : "text-mute"} /></motion.span>
            </motion.button>
          );
        })}
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
    <div className="mt-2 flex items-start gap-2 rounded-[22px] bg-card p-3 text-[1rem]">
      <span className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-black/20" style={{ background: f?.color }} />
      {locationLine(fileId)}
    </div>
  );
}

function HelpCards() {
  const { lang, go, settings } = useStore();
  const hi = lang === "hi";
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { id: "help", to: "help", guide: "home-help", art: <HelpArt className="h-24 w-24" />, en: "Show me how", hi: "कैसे करें, दिखाओ", subEn: "A ring shows where to tap", subHi: "घेरा दिखाएगा कहाँ दबाना है" },
        settings.role === "keeper"
          ? { id: "rem", to: "reminders", guide: "home-rem", art: <span className="block"><CatArt id="money" className="h-20 w-20" /></span>, en: "Reminders", hi: "याद दिलाना", subEn: "Renewals before they lapse", subHi: "समय से पहले याद" }
          : { id: "ask", to: "ask", guide: "home-ask", art: <span className="block"><CatArt id="home" className="h-20 w-20" /></span>, en: "Ask Mummy", hi: "मम्मी से माँगें", subEn: "For a document", subHi: "कोई कागज़" },
      ].map((x, i) => (
        <motion.button key={x.id} {...rise(i)} whileTap={{ scale: 0.97 }} whileHover="lift" onClick={() => go(x.to)} data-guide={x.guide}
          className="relative flex min-h-48 flex-col justify-start overflow-hidden rounded-[26px] bg-card px-3 pt-3 text-left">
          <span className="title-tight block text-[1.15rem] leading-tight font-bold">{hi ? x.hi : x.en}</span>
          <motion.span className="sticker relative -mb-3 mt-auto block self-center pt-2" variants={{ lift: { y: -6 } }}>{x.art}</motion.span>
        </motion.button>
      ))}
    </div>
  );
}

function AlmirahCard() {
  const { data, lang, go } = useStore();
  const hi = lang === "hi";
  return (
    <StickerCard tone="bg-card" onClick={() => go("print")}
      metaLeft={<><LayoutGrid size={15} /> {data.files.length} {hi ? "फ़ाइलें" : "files"}</>}
      metaRight={<>{data.places.length} {hi ? "जगहें" : "places"}</>}
      title={hi ? "क्या कहाँ रखा है" : "What is where"}
      sub={hi ? "पूरी अलमारी की लिस्ट" : "Your whole almirah, file by file"}>
      <span className="sticker block"><HeroScene className="h-40 w-48" /></span>
    </StickerCard>
  );
}

function QuickLinks() {
  const { t, go, settings, lang } = useStore();
  const items = [
    { icon: HeartHandshake, label: settings.role === "keeper" ? t("unwellTitle") : lang === "hi" ? "अगर मम्मी-पापा की तबियत ख़राब हो" : "If Mummy or Papa is unwell", to: "unwell" },
    { icon: KeyRound, label: t("diaryTitle"), to: "diary" },
    ...(settings.role === "keeper" ? [{ icon: Printer, label: t("printIndex"), to: "print" }] : []),
  ];
  return (
    <div className="mt-8 overflow-hidden rounded-[24px] bg-card">
      {items.map((i, k) => (
        <motion.button key={i.to} whileTap={{ scale: 0.98 }} onClick={() => go(i.to)} className={`flex min-h-16 w-full items-center gap-3 px-4 text-left ${k ? "border-t border-white" : ""}`}>
          <i.icon size={22} aria-hidden />
          <span className="flex-1 text-[1.02rem] font-semibold">{i.label}</span>
          <ChevronRight size={20} className="text-mute" aria-hidden />
        </motion.button>
      ))}
    </div>
  );
}

export function KeeperHome() {
  const { data, lang, settings } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const docs = useFiltered(filter);
  if (settings.simple) return <SimpleHome />;
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  const hi = lang === "hi";
  return (
    <div className="pb-32">
      <Top hello={`${greeting(lang)}, ${hi ? "सुनीता जी" : "Sunita ji"}`} title={hi ? "मेरे कागज़" : "My papers"} />
      <div className="px-4">
        <FilterChips value={filter} onChange={setFilter} />
        {pending.map((q) => <RequestCard key={q.id} req={q} />)}
        <SectionLabel right={<ViewToggle view={view} onChange={setView} />}>{hi ? "फ़ाइलें" : "Files"}</SectionLabel>
        <Folders docs={docs} view={view} />
        <SectionLabel>{hi ? "मदद" : "Help"}</SectionLabel>
        <HelpCards />
        <SectionLabel>{hi ? "किसके लिए तैयारी?" : "Ready for…"}</SectionLabel>
        <ReadyCards docs={docs} />
        <Reminders />
        <div className="mt-8"><AlmirahCard /></div>
        <QuickLinks />
      </div>
    </div>
  );
}

/* Simple mode. Three layouts to compare: ?layout=a | b | c (remembered on this device). */
const LAYOUT = (() => {
  try {
    const q = new URLSearchParams(window.location.search).get("layout");
    if (q) localStorage.setItem("almari-layout", q);
    return localStorage.getItem("almari-layout") ?? "a";
  } catch { return "a"; }
})();

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

function SimpleActions() {
  const { lang } = useStore();
  const hi = lang === "hi";
  return [
    { key: "id", icon: IdCard, en: "Show my ID", hi: "मेरा आईडी दिखाएँ", to: "counter/d1", guide: "home-id" },
    { key: "how", icon: Sparkles, en: "Show me how", hi: "कैसे करें, दिखाओ", to: "help", guide: "home-help" },
    { key: "add", icon: Plus, en: "Add a paper", hi: "कागज़ जोड़ें", to: "add", guide: "home-add" },
  ].map((x) => ({ ...x, label: hi ? x.hi : x.en }));
}

function SimpleFooter() {
  const { data, lang, go, setSettings } = useStore();
  const hi = lang === "hi";
  return (
    <>
      <SectionLabel>{hi ? "मेरी फ़ाइलें" : "My files"}</SectionLabel>
      <Folders docs={data.docs} view="grid" />
      <button onClick={() => setSettings({ simple: false })} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-semibold text-brand">
        <LayoutGrid size={20} /> {hi ? "सारे फ़ीचर दिखाएँ" : "Show all features"}
      </button>
      <button onClick={() => go("more")} className="flex min-h-12 w-full items-center justify-center rounded-full font-medium text-mute">{hi ? "सेटिंग" : "Settings"}</button>
    </>
  );
}

export function SimpleHome() {
  const { data } = useStore();
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  const Layout = LAYOUT === "b" ? SimpleB : LAYOUT === "c" ? SimpleC : SimpleA;
  return (
    <div className="pb-16">
      <div className="wash pt-safe px-4 pb-6">
        <SimpleTop />
        <Layout pending={pending} />
      </div>
      <div className="px-4"><SimpleFooter /></div>
    </div>
  );
}

/* A: search first, then a clean list of the three other things */
function SimpleA({ pending }: { pending: Request[] }) {
  const { go } = useStore();
  const acts = SimpleActions();
  return (
    <>
      <div className="mt-6"><FindField big /></div>
      {pending.map((q) => <RequestCard key={q.id} req={q} />)}
      <div className="mt-5 overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_-16px_rgba(40,70,20,0.25)]">
        {acts.map((x, k) => (
          <motion.button key={x.key} {...rise(k)} whileTap={{ scale: 0.99 }} onClick={() => go(x.to)} data-guide={x.guide}
            className={`flex min-h-[4.25rem] w-full items-center gap-4 px-4 text-left ${k ? "border-t border-[#ECECF0]" : ""}`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><x.icon size={22} /></span>
            <span className="flex-1 text-[1.12rem] font-semibold">{x.label}</span>
            <ChevronRight size={20} className="text-mute" />
          </motion.button>
        ))}
      </div>
    </>
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
      <p className="mt-6 mb-3 text-[1.12rem] font-semibold">{hi ? "अक्सर चाहिए" : "Often needed"}</p>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {often.map((d, i) => (
          <motion.button key={d.id} {...rise(i)} whileTap={{ scale: 0.97 }} onClick={() => go(`doc/${d.id}`)} className="w-[8.5rem] shrink-0 text-left">
            <span className="block overflow-hidden rounded-[14px] bg-white p-1.5 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)]">
              <DocArt doc={d} ownerName={(person(d.personId)?.name ?? "") + " Sharma"} className="block h-auto w-full rounded-[10px]" />
            </span>
            <span className="mt-2 block text-[1rem] leading-tight font-semibold">{docTitle(d)}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => go("help")} data-guide="home-help" className="flex items-center gap-3 rounded-[20px] bg-white p-3 pr-4 text-left shadow-[0_8px_22px_-16px_rgba(0,0,0,0.3)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Sparkles size={21} /></span>
          <span className="text-[1rem] leading-tight font-semibold">{hi ? "कैसे करें" : "Show me how"}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => go("add")} data-guide="home-add" className="flex items-center gap-3 rounded-[20px] bg-white p-3 pr-4 text-left shadow-[0_8px_22px_-16px_rgba(0,0,0,0.3)]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Plus size={21} /></span>
          <span className="text-[1rem] leading-tight font-semibold">{hi ? "कागज़ जोड़ें" : "Add a paper"}</span>
        </motion.button>
      </div>
    </>
  );
}

/* C: one green card for finding, quick actions as round buttons */
function SimpleC({ pending }: { pending: Request[] }) {
  const { go, lang } = useStore();
  const hi = lang === "hi";
  const acts = SimpleActions();
  return (
    <>
      <div className="mt-6 rounded-[26px] bg-brand p-4 pt-5 text-white">
        <p className="text-[1.3rem] leading-tight font-bold">{hi ? "कोई भी कागज़, एक बार में" : "Find any paper"}</p>
        <p className="mt-0.5 mb-4 text-[0.98rem] text-white/85">{hi ? "नाम बोलिए या लिखिए" : "Say or type its name"}</p>
        <FindField />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {acts.map((x, k) => (
          <motion.button key={x.key} {...rise(k)} whileTap={{ scale: 0.95 }} onClick={() => go(x.to)} data-guide={x.guide} className="flex flex-col items-center gap-2 py-1">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand shadow-[0_10px_22px_-14px_rgba(40,70,20,0.45)]"><x.icon size={26} /></span>
            <span className="text-center text-[0.94rem] leading-tight font-semibold">{x.label}</span>
          </motion.button>
        ))}
      </div>
      {pending.map((q) => <RequestCard key={q.id} req={q} />)}
    </>
  );
}

export function HelperHome() {
  const { data, t, lang, go, docTitle, startLend } = useStore();
  const hi = lang === "hi";
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const docs = useFiltered(filter);
  const mine = data.requests.filter((q) => q.from === "rahul").slice(0, 3);
  const lend = data.lend;
  return (
    <div className="pb-32">
      <Top hello={hi ? "नागपुर · आप बेंगलुरु से देख रहे हैं" : "Nagpur · viewing from Bengaluru"} title={hi ? "मम्मी-पापा के कागज़" : "Mummy & Papa's papers"} />
      <div className="px-4">
        <FilterChips value={filter} onChange={setFilter} />
        {lend?.status === "waiting" && (
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-5 overflow-hidden rounded-[28px] bg-ink p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="sticker block"><LendArt className="h-16 w-24" live /></span>
              <div>
                <p className="title-tight text-[1.25rem] font-bold">{hi ? "मम्मी को मदद चाहिए" : "Mummy needs your help"}</p>
                <p className="text-[0.95rem] text-white/75">{lend.app === "train" ? (hi ? "ट्रेन टिकट" : "Train tickets") : hi ? "बैंक ऐप" : "Bank app"} · 15 {hi ? "मिनट" : "min"}</p>
              </div>
            </div>
            <Button big variant="secondary" className="mt-3 w-full bg-white" icon="Check" onClick={() => { startLend(); go("lend"); }}>{hi ? "मदद करें" : "Accept and help"}</Button>
          </motion.div>
        )}
        {lend?.status === "active" && <Button big className="mt-5 w-full" icon="HandHelping" onClick={() => go("lend")}>{hi ? "मम्मी के फ़ोन पर वापस जाएँ" : "Back to Mummy's phone"}</Button>}
        {mine.length > 0 && (
          <>
            <SectionLabel>{t("yourRequests")}</SectionLabel>
            <div className="flex flex-col gap-2">
              {mine.map((q, i) => {
                const doc = data.docs.find((d) => d.id === q.docId);
                return (
                  <motion.button key={q.id} {...rise(i)} whileTap={{ scale: 0.98 }} onClick={doc && q.status === "sent" ? () => go(`doc/${doc.id}`) : undefined}
                    className="flex min-h-16 w-full items-center gap-3 rounded-[22px] bg-card px-4 text-left">
                    <Send size={20} className="shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 py-3">
                      <span className="block font-semibold leading-snug">{doc ? docTitle(doc) : q.docName}</span>
                      <span className="block text-[0.94rem] leading-snug text-mute">{q.purpose} · {timeAgo(q.at, lang)}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[0.88rem] font-semibold ${q.status === "sent" ? "bg-white text-ink ring-1 ring-[#D8D8DE]" : "bg-white text-mute ring-1 ring-[#D8D8DE]"}`}>
                      {q.status === "sent" ? t("received") : q.status === "declined" ? (hi ? "बाद में" : "Later") : t("waiting")}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
        <SectionLabel right={<ViewToggle view={view} onChange={setView} />}>{hi ? "फ़ाइलें" : "Files"}</SectionLabel>
        <Folders docs={docs} view={view} />
        <SectionLabel>{hi ? "मदद" : "Help"}</SectionLabel>
        <HelpCards />
        <Reminders limit={4} />
        <SectionLabel>{hi ? "किसके लिए तैयारी?" : "Ready for…"}</SectionLabel>
        <ReadyCards docs={docs} />
        <QuickLinks />
      </div>
    </div>
  );
}

