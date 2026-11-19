import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search, X, ShieldCheck, MessageCircle, Camera, Bell, Eye, Link2, Maximize2, Send , MapPin } from "lucide-react";
import { CATEGORIES } from "../data";
import { useStore } from "../store";
import { searchDocs } from "../search";
import { Avatar, DocArt, PlaceView } from "../art";
import { Button, Card, Chip, EmptyNote, MicButton, Screen, SectionTitle, Sheet } from "../components/ui";
import { DocRow } from "../components/DocRow";
import { LocationPicker } from "../components/LocationPicker";
import { WatermarkPreview, makeStampedImage, shareStamped, stampText } from "../components/Watermark";
import { daysUntil, fmtDate } from "../i18n";
import { fileToDataUrl } from "../image";

/* ================= FIND ================= */
export function Find() {
  const { data, t, lang, route, settings, go } = useStore();
  const [q, setQ] = useState(route.params.get("q") ?? "");
  const [who, setWho] = useState<"all" | "sunita" | "ramesh">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!route.params.get("q")) inputRef.current?.focus();
  }, []); // eslint-disable-line

  const results = useMemo(() => {
    const base = who === "all" ? data.docs : data.docs.filter((d) => d.personId === who);
    return q.trim() ? searchDocs(base, q) : [];
  }, [q, who, data.docs]);

  const examples = lang === "hi"
    ? ["आधार", "पैन कार्ड", "एलआईसी", "ब्लड रिपोर्ट", "पासबुक", "गैस"]
    : ["Aadhaar", "PAN card", "LIC", "Blood report", "Passbook", "Gas book"];
  const meLabel = settings.role === "keeper" ? t("me") : lang === "hi" ? "मम्मी" : "Mummy";
  const otherLabel = settings.role === "keeper" ? (lang === "hi" ? "रमेश जी" : "Ramesh") : lang === "hi" ? "पापा" : "Papa";

  return (
    <Screen title={t("find")}>
      <div className="flex items-center gap-2">
        <div className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-full bg-white ring-1 ring-[#D8D8DE] px-4 focus-within:ring-2 focus-within:ring-ink">
          <Search size={24} className="shrink-0 text-mute" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("findPlaceholder")}
            className="h-full min-w-0 flex-1 bg-transparent text-[1.1rem] outline-none"
            aria-label={t("findPlaceholder")}
            enterKeyHint="search"
          />
          {q && <button onClick={() => setQ("")} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-hair" aria-label={t("close")}><X size={22} /></button>}
        </div>
        <MicButton onText={(text) => setQ(text)} />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        <Chip active={who === "all"} onClick={() => setWho("all")}>{t("everyone")}</Chip>
        <Chip active={who === "sunita"} onClick={() => setWho("sunita")}>{meLabel}</Chip>
        <Chip active={who === "ramesh"} onClick={() => setWho("ramesh")}>{otherLabel}</Chip>
      </div>

      {!q.trim() && (
        <>
          <SectionTitle>{t("trySaying")}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {examples.map((e, i) => <Chip key={e} icon="Search" guide={`find-chip-${i}`} onClick={() => setQ(e)}>{e}</Chip>)}
          </div>
        </>
      )}

      {q.trim() && (
        <>
          <p className="mt-4 mb-2 text-[0.95rem] text-mute">{results.length} {t("results")}</p>
          {results.length === 0 ? (
            <div className="flex flex-col gap-3">
              <EmptyNote icon="SearchX">{t("noResults")}</EmptyNote>
              {settings.role === "helper" ? (
                <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileTap={{ scale: 0.97 }} data-guide="find-ask"
                  onClick={() => go(`ask?name=${encodeURIComponent(q.trim())}`)}
                  className="relative flex min-h-24 items-center gap-4 overflow-hidden rounded-[26px] bg-[#FFF4DC] px-4 text-left">
                  <span className="min-w-0 flex-1">
                    <span className="title-tight block text-[1.25rem] leading-tight font-bold">{lang === "hi" ? "मम्मी से माँगें" : "Ask Mummy for it"}</span>
                    <span className="block text-[0.92rem] text-mute">{lang === "hi" ? `"${q.trim()}" के लिए एक छोटा सा अनुरोध भेजें` : `She gets one card: "${q.trim()}", with a Send button`}</span>
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white"><Send size={22} /></span>
                </motion.button>
              ) : <AddNamed name={q} />}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((d, i) => (
                <motion.div key={d.id} data-guide={`result-${i}`} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 24 }}>
                  <DocRow doc={d} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </Screen>
  );
}

function AddNamed({ name }: { name: string }) {
  const { t, go } = useStore();
  return <Button variant="secondary" icon="Plus" onClick={() => go(`add?name=${encodeURIComponent(name)}`)}>{t("addIt")}</Button>;
}

/* ================= DOCUMENT ================= */
export function DocDetail({ id }: { id: string }) {
  const { data, t, lang, go, person, personName, docTitle, docOwnerLabel, catName, locationParts, updateDoc, log, settings, viewerId, showToast } = useStore();
  const doc = data.docs.find((d) => d.id === id);
  const [moving, setMoving] = useState(false);
  const [newFile, setNewFile] = useState<string | null>(doc?.fileId ?? null);
  const camRef = useRef<HTMLInputElement>(null);
  const logged = useRef(false);

  useEffect(() => {
    if (doc && settings.role === "helper" && !logged.current) {
      logged.current = true;
      log({ who: viewerId, action: "viewed", docId: doc.id });
    }
  }, [doc?.id]); // eslint-disable-line

  if (!doc) return <Screen title="">{t("noResults")}</Screen>;
  const owner = person(doc.personId);
  const loc = locationParts(doc.fileId);
  const cat = CATEGORIES.find((c) => c.id === doc.category);
  const viewers = data.members.filter((m) => m.personId !== doc.personId && (m.access === "all" || (m.access === "some" && m.folders.includes(doc.category))));
  const n = doc.expiry ? daysUntil(doc.expiry) : null;

  return (
    <Screen title={docTitle(doc)} sub={`${docOwnerLabel(doc.personId)} · ${catName(doc.category)}`}>
      {doc.paperOnly ? (
        <div className="flex flex-col items-center gap-3 rounded-[22px] border-2 border-dashed border-black/15 bg-white p-6 text-center">
          <p className="text-[1.05rem] text-mute">{t("onlyPaper")}</p>
          {settings.role === "helper"
            ? <Button icon="Send" guide="doc-ask" onClick={() => go(`ask?name=${encodeURIComponent(doc.title)}`)}>{lang === "hi" ? "मम्मी से फ़ोटो माँगें" : "Ask Mummy for a photo"}</Button>
            : <Button icon="Camera" onClick={() => camRef.current?.click()}>{t("takePhotoNow")}</Button>}
          <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const img = await fileToDataUrl(f);
              updateDoc(doc.id, { image: img, paperOnly: false, source: "camera" });
              showToast(t("savedToast"));
            }} />
        </div>
      ) : (
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => go(`counter/${doc.id}`)} className="relative block w-full rounded-[28px] bg-white lift p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]" aria-label={t("showCounter")}
          initial={{ rotateX: 18, y: 16, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 18 }} style={{ transformPerspective: 800 }}>
          <DocArt doc={doc} ownerName={(owner?.name ?? "") + " Sharma"} className="h-auto w-full" />
          <span className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-white"><Maximize2 size={20} /></span>
        </motion.button>
      )}

      {doc.source === "digilocker" && (
        <p className="mt-2 flex items-center gap-2 text-[0.95rem] font-medium text-brand"><ShieldCheck size={20} /> {t("fromDigilocker")}</p>
      )}
      {doc.source === "whatsapp" && (
        <p className="mt-2 flex items-center gap-2 text-[0.95rem] text-mute"><MessageCircle size={20} /> {t("fromWhatsapp")}</p>
      )}

      {!doc.paperOnly && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button big icon="Maximize" guide="counter-btn" onClick={() => go(`counter/${doc.id}`)}>{t("showCounter")}</Button>
          <Button big variant="secondary" icon="Share2" guide="share-btn" onClick={() => go(`share/${doc.id}`)}>{t("shareSafely")}</Button>
        </div>
      )}

      <SectionTitle>{t("originalKept")}</SectionTitle>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_-16px_rgba(40,70,20,0.28)]">
        {loc?.place && (
          <div className="bg-[#F6F9F2] px-4 pt-5 pb-6">
            <PlaceView place={loc.place} files={data.files} highlight={doc.fileId} person={loc.place.personId ? person(loc.place.personId) : undefined} />
          </div>
        )}
        {loc ? (
          <ol className="px-4">
            {[
              { k: lang === "hi" ? "जगह" : "Place", v: loc.placeName },
              { k: lang === "hi" ? "खाना" : "Shelf", v: loc.spotName },
              { k: lang === "hi" ? "फ़ाइल" : "File", v: loc.fileName, color: loc.file.color },
            ].map((x, i) => (
              <li key={x.k} className={`flex items-center gap-3 py-3.5 ${i ? "border-t border-[#ECECF0]" : ""}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[0.94rem] font-bold text-brand">{i + 1}</span>
                <span className="w-16 shrink-0 text-[0.94rem] text-mute">{x.k}</span>
                <span className="flex min-w-0 flex-1 items-center gap-2 text-[1.06rem] font-semibold">
                  {x.color && <span className="inline-block h-5 w-4 shrink-0 rounded-[3px] ring-1 ring-black/15" style={{ background: x.color }} />}
                  {x.v}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-4 pt-4 text-mute">{lang === "hi" ? "जगह अभी नहीं लिखी" : "Place not noted yet"}</p>
        )}
        {doc.note && <p className="mx-4 mb-2 rounded-2xl bg-[#F6F9F2] p-3 text-[0.94rem] text-mute">{doc.note}</p>}
        <div className="border-t border-[#ECECF0] px-2 py-1">
          <button onClick={() => { setNewFile(doc.fileId); setMoving(true); }} className="flex min-h-12 items-center gap-2 px-2 text-[1rem] font-semibold text-brand">
            <MapPin size={18} /> {t("changePlace")}
          </button>
        </div>
      </div>

      {doc.expiry && n !== null && (
        <Card className="mt-4 flex items-center gap-3" tone={n <= 30 ? "bg-danger-soft" : "bg-white"} onClick={() => go("reminders")}>
          <Bell size={26} className="shrink-0" aria-hidden />
          <span className="flex-1">
            <span className="block font-semibold">{t("expires")}: {fmtDate(doc.expiry, lang)}</span>
            <span className="text-[0.92rem] text-mute">{n} {t("daysLeft")} · {lang === "hi" ? "आपको और राहुल को याद दिलाएँगे" : "You and Rahul will be reminded"}</span>
          </span>
        </Card>
      )}

      <SectionTitle>{t("whoCanSee")}</SectionTitle>
      <Card className="flex flex-col gap-3" onClick={settings.role === "keeper" ? () => go("family") : undefined}>
        <div className="flex items-center -space-x-2">
          {owner && <Avatar person={owner} size={40} ring />}
          {viewers.map((m) => <Avatar key={m.personId} person={person(m.personId)} size={40} ring />)}
        </div>
        <p className="text-[0.98rem] text-mute">
          {[personName(doc.personId), ...viewers.map((m) => personName(m.personId))].join(", ")}
        </p>
        <p className="flex items-center gap-2 text-[0.92rem] text-mute">
          <Eye size={18} aria-hidden /> {t("addedBy")}: {personName(doc.addedBy)} · {fmtDate(doc.addedOn, lang)} · {cat ? (lang === "hi" ? cat.hi : cat.en) : ""}
        </p>
      </Card>

      <p className="mt-4 text-[0.88rem] text-mute">{t("copyNote")}</p>

      <Sheet open={moving} onClose={() => setMoving(false)} title={t("stepWhere")}>
        <LocationPicker value={newFile} onChange={setNewFile} />
        <Button big className="mt-4 w-full" icon="Check" onClick={() => {
          updateDoc(doc.id, { fileId: newFile });
          log({ who: viewerId, action: "moved", docId: doc.id });
          setMoving(false);
          showToast(lang === "hi" ? "नई जगह सेव हो गई।" : "New place saved.");
        }}>{t("save")}</Button>
      </Sheet>
    </Screen>
  );
}

/* ================= SHOW AT COUNTER ================= */
export function Counter({ id }: { id: string }) {
  const { data, back, t, person, docTitle } = useStore();
  const doc = data.docs.find((d) => d.id === id);
  if (!doc) return null;
  const owner = person(doc.personId);
  return (
    <motion.button
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={back}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white p-3"
      aria-label={t("tapToClose")}
    >
      <p className="title-tight text-center text-[1.6rem] leading-tight font-bold">{docTitle(doc)}<span className="block text-[1.1rem] font-medium text-mute">{owner?.name} Sharma</span></p>
      <div className="w-full">
        <DocArt doc={doc} ownerName={(owner?.name ?? "") + " Sharma"} className="h-auto w-full" />
      </div>
      {doc.number && <p className="rounded-full bg-white ring-1 ring-[#D8D8DE] px-6 py-2 text-[2rem] font-bold tracking-widest">{doc.number}</p>}
      <p className="text-[1rem] text-mute">{t("tapToClose")}</p>
    </motion.button>
  );
}

/* ================= SHARE SAFELY ================= */
const PURPOSES = [
  { en: "SBI KYC", hi: "एसबीआई केवाईसी" },
  { en: "Hospital", hi: "अस्पताल" },
  { en: "Train booking", hi: "ट्रेन बुकिंग" },
  { en: "Gas agency", hi: "गैस एजेंसी" },
  { en: "Insurance claim", hi: "बीमा क्लेम" },
];

export function Share({ id }: { id: string }) {
  const { data, t, lang, person, docTitle, log, viewerId, showToast, back } = useStore();
  const doc = data.docs.find((d) => d.id === id);
  const [purpose, setPurpose] = useState<string>("");
  const [custom, setCustom] = useState("");
  const [masked, setMasked] = useState(doc?.art === "aadhaar");
  const [busy, setBusy] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  if (!doc) return null;
  const owner = person(doc.personId);
  const p = purpose === "__custom" ? custom.trim() : purpose;
  const stamp = p ? stampText(p, fmtDate(new Date().toISOString(), lang), lang) : "";

  async function share() {
    if (!p) return;
    setBusy(true);
    try {
      const blob = await makeStampedImage(doc!, stampText(p, fmtDate(new Date().toISOString(), "en"), "en"), masked, (owner?.name ?? "") + " Sharma");
      const r = await shareStamped(blob, `${doc!.title.replace(/\s+/g, "-")}-for-${p.replace(/\s+/g, "-")}.png`, stampText(p, fmtDate(new Date().toISOString(), lang), lang));
      if (r !== "cancelled") {
        log({ who: viewerId, action: "shared", docId: doc!.id, detail: stamp });
        showToast(r === "downloaded" ? (lang === "hi" ? "कॉपी डाउनलोड हो गई। अब व्हाट्सऐप में भेजें।" : "Copy downloaded. Now send it on WhatsApp.") : t("sharedToast"));
      }
    } catch {
      showToast(lang === "hi" ? "कुछ गड़बड़ हुई, फिर कोशिश करें।" : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title={t("shareTitle")} sub={docTitle(doc)}>
      <p className="text-[1.05rem] font-semibold">{t("shareFor")}</p>
      <p className="mb-2 text-[0.95rem] text-mute">{t("shareForNote")}</p>
      <div className="flex flex-wrap gap-2">
        {PURPOSES.map((x, i) => {
          const v = lang === "hi" ? x.hi : x.en;
          return <Chip key={x.en} guide={`purpose-${i}`} active={purpose === v} onClick={() => setPurpose(v)}>{v}</Chip>;
        })}
        <Chip active={purpose === "__custom"} onClick={() => setPurpose("__custom")} icon="Pencil">{lang === "hi" ? "कुछ और" : "Something else"}</Chip>
      </div>
      {purpose === "__custom" && (
        <input value={custom} onChange={(e) => setCustom(e.target.value)} autoFocus placeholder={lang === "hi" ? "जैसे: पोस्ट ऑफिस" : "e.g. Post office"}
          className="mt-3 h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] focus:border-ink px-4 text-[1.1rem] outline-none" />
      )}

      {doc.art === "aadhaar" && (
        <label className="mt-4 flex min-h-14 cursor-pointer items-center gap-3 rounded-[22px] bg-white lift px-3">
          <input type="checkbox" checked={masked} onChange={(e) => setMasked(e.target.checked)} className="h-6 w-6 accent-[#1E5B4F]" />
          <span className="text-[1rem]">{t("maskAadhaar")}</span>
        </label>
      )}

      <SectionTitle>{lang === "hi" ? "जो कॉपी जाएगी" : "The copy that will be sent"}</SectionTitle>
      {p ? (
        <WatermarkPreview doc={doc} stamp={stamp} masked={masked} ownerName={(owner?.name ?? "") + " Sharma"} />
      ) : (
        <EmptyNote icon="Stamp">{lang === "hi" ? "पहले चुनें कि किसके लिए भेज रहे हैं।" : "First choose who it is for. We stamp it on the copy."}</EmptyNote>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <Button big icon="MessageCircle" guide="share-wa" disabled={!p || busy} onClick={share}>{busy ? "…" : t("shareWhatsapp")}</Button>
        <Button variant="secondary" icon="Link2" disabled={!p} onClick={() => setLinkOpen(true)}>{t("shareLink")}</Button>
      </div>

      <Sheet open={linkOpen} onClose={() => setLinkOpen(false)} title={lang === "hi" ? "24 घंटे वाला लिंक" : "24-hour link"}>
        <div className="flex items-center gap-3 rounded-[22px] bg-white p-3">
          <Link2 size={24} className="text-brand" />
          <span className="flex-1 truncate font-mono text-[0.95rem]">almari.link/s/{doc.id}-{Math.random().toString(36).slice(2, 6)}</span>
        </div>
        <p className="mt-3 text-[0.98rem] text-mute">{lang === "hi" ? "लिंक खोलने वाले को सिर्फ़ ठप्पे वाली कॉपी दिखेगी। 24 घंटे बाद लिंक बंद। आप कभी भी पहले बंद कर सकते हैं।" : "Whoever opens it sees only the stamped copy. The link stops working after 24 hours, and you can stop it earlier."}</p>
        <Button big className="mt-4 w-full" icon="Copy" onClick={() => { log({ who: viewerId, action: "shared", docId: doc.id, detail: stamp + " (link)" }); setLinkOpen(false); showToast(t("linkToast")); back(); }}>
          {lang === "hi" ? "लिंक कॉपी करें" : "Copy link"}
        </Button>
      </Sheet>
    </Screen>
  );
}
