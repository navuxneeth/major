import { useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Bell, HeartHandshake, KeyRound, Printer, Send } from "lucide-react";
import { CATEGORIES, READY_FOR, type Request } from "../data";
import { useStore } from "../store";
import { Button, Card, Icon, MicButton, SectionTitle, Sheet } from "../components/ui";
import { DocRow } from "../components/DocRow";
import { Avatar } from "../art";
import { WatermarkPreview, stampText } from "../components/Watermark";
import { daysUntil, fmtDate, timeAgo } from "../i18n";

export function LangToggle() {
  const { settings, setSettings } = useStore();
  return (
    <div className="flex rounded-full border-2 border-hair bg-white p-0.5 text-[0.95rem] font-semibold" role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setSettings({ lang: l })}
          className={`h-10 min-w-12 rounded-full px-3 ${settings.lang === l ? "bg-brand text-white" : "text-ink"}`}
          aria-pressed={settings.lang === l}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

function SearchBar() {
  const { t, go } = useStore();
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => go("find")}
        className="flex h-14 flex-1 items-center gap-3 rounded-2xl border-2 border-hair bg-white px-4 text-left text-[1.08rem] text-mute"
      >
        <Search size={24} aria-hidden />
        {t("findPlaceholder")}
      </motion.button>
      <MicButton onText={(text, final) => final && go(`find?q=${encodeURIComponent(text)}`)} />
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
      <div className="flex flex-col gap-2">
        {list.map((r) => {
          const n = daysUntil(r.due);
          return (
            <Card key={r.id} onClick={() => (r.docId ? go(`doc/${r.docId}`) : go("reminders"))} className="flex items-center gap-3">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${n <= 14 ? "bg-danger-soft text-danger" : "bg-saffron-soft text-ink"}`}>
                <Bell size={24} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.05rem] font-semibold leading-snug">{lang === "hi" ? r.titleHi : r.title}</span>
                <span className="block text-[0.92rem] text-mute">
                  {fmtDate(r.due, lang)} · {n} {t("daysLeft")} · {r.notify.map((p) => personName(p)).join(", ")}
                </span>
              </span>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function Folders() {
  const { data, lang, go } = useStore();
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map((c) => {
        const n = data.docs.filter((d) => d.category === c.id).length;
        return (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => go(`cat/${c.id}`)}
            className={`flex min-h-24 flex-col justify-between rounded-2xl ${c.tone} p-3 text-left`}
          >
            <Icon name={c.icon} size={28} />
            <span>
              <span className="block text-[1.05rem] leading-tight font-semibold">{lang === "hi" ? c.hi : c.en}</span>
              <span className="text-[0.9rem] text-mute">{n}</span>
            </span>
          </motion.button>
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
      <div className="grid grid-cols-2 gap-2">
        {READY_FOR.map((r) => (
          <motion.button
            key={r.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => go(`ready/${r.id}`)}
            className="flex min-h-16 items-center gap-2 rounded-2xl border-2 border-hair bg-white px-3 text-left"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${r.tone}`}><Icon name={r.icon} size={24} /></span>
            <span className="text-[1rem] leading-tight font-semibold">{lang === "hi" ? r.hi : r.en}</span>
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
  const from = person(req.from);
  const doc = data.docs.find((d) => d.id === req.docId);
  const fromName = personName(req.from);
  const stamp = stampText(lang === "hi" ? `${fromName} (${req.purpose})` : `${fromName} · ${req.purpose}`, fmtDate(new Date().toISOString(), lang), lang);
  return (
    <>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 rounded-3xl border-2 border-saffron bg-saffron-soft p-4">
        <div className="flex items-center gap-3">
          <Avatar person={from} size={48} />
          <div className="min-w-0">
            <p className="text-[1.15rem] leading-snug font-semibold">
              {lang === "hi" ? `${fromName} ${t("needsThis")}` : `${fromName} ${t("needsThis")}`}
            </p>
            <p className="text-[0.9rem] text-mute">{timeAgo(req.at, lang)}</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-3">
          <p className="text-[1.25rem] font-semibold">{doc ? docTitle(doc) : req.docName}</p>
          <p className="text-[1rem] text-mute">{t("forPurpose")}: {req.purpose}</p>
        </div>
        <div className="mt-3 flex gap-2">
          <Button big className="flex-1" icon="Send" onClick={() => setOpen(true)}>{t("sendOne")}</Button>
          <Button big variant="secondary" onClick={() => { answerRequest(req.id, "declined"); }}>{t("notNow")}</Button>
        </div>
      </motion.div>
      <Sheet open={open} onClose={() => setOpen(false)} title={doc ? docTitle(doc) : req.docName}>
        {doc && !doc.paperOnly ? (
          <>
            <WatermarkPreview doc={doc} stamp={stamp} masked={doc.art === "aadhaar"} ownerName={(person(doc.personId)?.name ?? "") + " Sharma"} />
            <p className="mt-2 text-[0.95rem] text-mute">{t("shareForNote")}</p>
            <Button big className="mt-4 w-full" icon="Send" onClick={() => { answerRequest(req.id, "sent"); setOpen(false); showToast(lang === "hi" ? `भेज दिया। ${fromName} को मिल गया।` : `Sent. ${fromName} has it now.`); }}>
              {lang === "hi" ? `${fromName} को भेजें` : `Send to ${fromName}`}
            </Button>
          </>
        ) : (
          <>
            <p className="text-[1.05rem]">{t("onlyPaper")}</p>
            {doc && <PlaceLine fileId={doc.fileId} />}
            <Button big className="mt-4 w-full" icon="Camera" onClick={() => { setOpen(false); go(`add?req=${req.id}&name=${encodeURIComponent(doc ? doc.title : req.docName)}${doc ? `&doc=${doc.id}` : ""}`); }}>
              {t("takePhotoNow")}
            </Button>
            {doc && (
              <Button variant="secondary" className="mt-2 w-full" icon="MapPin" onClick={() => { answerRequest(req.id, "sent"); setOpen(false); showToast(lang === "hi" ? `${fromName} को जगह बता दी।` : `Told ${fromName} where it is.`); }}>
                {lang === "hi" ? "सिर्फ़ जगह बताएँ" : "Just tell where it is"}
              </Button>
            )}
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
    { icon: HeartHandshake, label: settings.role === "keeper" ? t("unwellTitle") : lang === "hi" ? "अगर मम्मी-पापा की तबियत ख़राब हो" : "If Mummy or Papa is unwell", to: "unwell" },
    { icon: KeyRound, label: t("diaryTitle"), to: "diary" },
    ...(settings.role === "keeper" ? [{ icon: Printer, label: t("printIndex"), to: "print" }] : []),
  ];
  return (
    <div className="mt-6 flex flex-col gap-2">
      {items.map((i) => (
        <Card key={i.to} onClick={() => go(i.to)} className="flex items-center gap-3">
          <i.icon size={26} className="shrink-0 text-brand" aria-hidden />
          <span className="flex-1 text-[1.05rem] font-semibold">{i.label}</span>
          <ChevronRight size={22} className="text-mute" aria-hidden />
        </Card>
      ))}
    </div>
  );
}

export function KeeperHome() {
  const { data, t, lang } = useStore();
  const pending = data.requests.filter((q) => q.to === "sunita" && q.status === "pending");
  const hour = new Date().getHours();
  const greet = lang === "hi" ? "नमस्ते" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="px-4 pt-3 pb-28">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[2rem] leading-none text-brand">Almari</span>
        <LangToggle />
      </div>
      <h1 className="mt-4 text-[1.6rem] leading-tight font-semibold">{greet}, {lang === "hi" ? "सुनीता जी" : "Sunita ji"}</h1>
      <p className="mb-3 text-[1rem] text-mute">{lang === "hi" ? `${data.docs.length} कागज़, सबकी जगह पता है` : `${data.docs.length} documents, and where every original is`}</p>
      <SearchBar />
      {pending.map((q) => <RequestCard key={q.id} req={q} />)}
      <ReadyFor />
      <Reminders />
      <SectionTitle>{t("allFolders")}</SectionTitle>
      <Folders />
      <QuickLinks />
    </div>
  );
}

export function HelperHome() {
  const { data, t, lang, go, personName, docTitle } = useStore();
  const mine = data.requests.filter((q) => q.from === "rahul").slice(0, 3);
  const recent = data.activity.filter((a) => a.who !== "rahul" && a.docId).slice(0, 3);
  return (
    <div className="px-4 pt-3 pb-28">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[2rem] leading-none text-brand">Almari</span>
        <LangToggle />
      </div>
      <h1 className="mt-4 text-[1.6rem] leading-tight font-semibold">{t("parentsDocs")}</h1>
      <p className="mb-3 text-[1rem] text-mute">{lang === "hi" ? "नागपुर · आप बेंगलुरु से देख रहे हैं" : "Nagpur · you are viewing from Bengaluru"}</p>
      <SearchBar />
      <Button big className="mt-3 w-full" icon="HandHelping" onClick={() => go("ask")}>{t("askMummy")}</Button>
      {mine.length > 0 && (
        <>
          <SectionTitle>{t("yourRequests")}</SectionTitle>
          <div className="flex flex-col gap-2">
            {mine.map((q) => {
              const doc = data.docs.find((d) => d.id === q.docId);
              return (
                <Card key={q.id} onClick={doc && q.status === "sent" ? () => go(`doc/${doc.id}`) : undefined} className="flex items-center gap-3">
                  <Send size={22} className="shrink-0 text-brand" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{doc ? docTitle(doc) : q.docName}</span>
                    <span className="block text-[0.9rem] text-mute">{q.purpose} · {timeAgo(q.at, lang)}</span>
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[0.85rem] font-semibold ${q.status === "sent" ? "bg-sage" : q.status === "declined" ? "bg-hair" : "bg-saffron-soft"}`}>
                    {q.status === "sent" ? t("received") : q.status === "declined" ? (lang === "hi" ? "बाद में" : "Later") : t("waiting")}
                  </span>
                </Card>
              );
            })}
          </div>
        </>
      )}
      <Reminders limit={3} />
      <SectionTitle>{t("allFolders")}</SectionTitle>
      <Folders />
      {recent.length > 0 && (
        <>
          <SectionTitle>{lang === "hi" ? "हाल में जोड़ा गया" : "Recently at home"}</SectionTitle>
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
  );
}
