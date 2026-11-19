import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Image as ImageIcon, MessageCircle, ShieldCheck, FileText, Check } from "lucide-react";
import { CATEGORIES, type Art, type CategoryId, type Doc } from "../data";
import { useStore } from "../store";
import { Avatar, DocArt } from "../art";
import { Button, Chip, Icon, MicButton, Screen, Sheet } from "../components/ui";
import { LocationPicker } from "../components/LocationPicker";
import { fileToDataUrl } from "../image";
import { fmtDate } from "../i18n";

type Method = "camera" | "gallery" | "whatsapp" | "digilocker" | "paper";

const ALL_SUGGESTIONS = CATEGORIES.flatMap((c) => c.suggest.map((s) => ({ ...s, category: c.id })));

function guessFromName(name: string): { category: CategoryId; art: Art } | null {
  const n = name.toLowerCase();
  const hit = ALL_SUGGESTIONS.find((s) => n.includes(s.en.toLowerCase().split(" ")[0]) || name.includes(s.hi.split(" ")[0]));
  return hit ? { category: hit.category, art: hit.art } : null;
}

const STEP_KEYS = ["stepPhoto", "stepWhat", "stepFolder", "stepWhere", "stepDate", "save"] as const;

export function Add() {
  const { data, t, lang, route, go, addDoc, updateDoc, addReminder, answerRequest, showToast, viewerId, settings, person, personName } = useStore();
  const p = route.params;
  const reqId = p.get("req");
  const existingId = p.get("doc");
  const existing = existingId ? data.docs.find((d) => d.id === existingId) : undefined;
  const preName = p.get("name") ?? "";
  const preCat = (p.get("cat") as CategoryId) || null;
  const preArt = (p.get("art") as Art) || null;

  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method | null>(null);
  const [image, setImage] = useState<string | undefined>();
  const [title, setTitle] = useState(existing?.title ?? preName);
  const [personId, setPersonId] = useState(existing?.personId ?? "sunita");
  const [category, setCategory] = useState<CategoryId | null>(existing?.category ?? preCat ?? (preName ? guessFromName(preName)?.category ?? null : null));
  const [art, setArt] = useState<Art>(existing?.art ?? preArt ?? (preName ? guessFromName(preName)?.art ?? "paper" : "paper"));
  const [fileId, setFileId] = useState<string | null>(existing?.fileId ?? null);
  const [expiry, setExpiry] = useState<string>("");
  const [hasDate, setHasDate] = useState<boolean | null>(null);
  const [notify, setNotify] = useState<string[]>(["rahul"]);
  const [dlOpen, setDlOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [digi, setDigi] = useState<{ title: string; titleHi: string; art: Art; category: CategoryId; personId: string; number?: string } | null>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);

  const people = data.people.filter((x) => x.owner);
  const suggestions = useMemo(() => {
    const q = title.trim().toLowerCase();
    const list = q ? ALL_SUGGESTIONS.filter((s) => s.en.toLowerCase().includes(q) || s.hi.includes(title.trim())) : ALL_SUGGESTIONS.slice(0, 8);
    return list.slice(0, 8);
  }, [title]);

  async function onFile(f?: File | null, m: Method = "camera") {
    if (!f) return;
    const img = await fileToDataUrl(f);
    setImage(img);
    setMethod(m);
    setStep(1);
  }

  function pickSuggestion(s: (typeof ALL_SUGGESTIONS)[number]) {
    setTitle(lang === "hi" ? s.hi : s.en);
    setCategory(s.category);
    setArt(s.art);
  }

  const canNext = [
    !!method,
    title.trim().length > 1,
    !!category,
    !!fileId,
    hasDate === false || (hasDate === true && !!expiry),
    true,
  ][step];

  function save() {
    const isHi = /[ऀ-ॿ]/.test(title);
    const sug = ALL_SUGGESTIONS.find((s) => s.en === title || s.hi === title);
    const docFields: Omit<Doc, "id" | "addedOn"> = {
      title: sug ? sug.en : title.trim(),
      titleHi: sug ? sug.hi : isHi ? title.trim() : title.trim(),
      aliases: [title.trim().toLowerCase(), ...(sug ? [sug.en.toLowerCase(), sug.hi] : [])],
      personId,
      category: category!,
      art,
      image,
      paperOnly: method === "paper" && !image,
      fileId,
      source: method === "digilocker" ? "digilocker" : method === "whatsapp" ? "whatsapp" : method === "gallery" ? "gallery" : method === "paper" ? "paper" : "camera",
      number: digi?.number,
      expiry: hasDate ? expiry : undefined,
      addedBy: viewerId,
    };
    let id: string;
    if (existing) {
      updateDoc(existing.id, { image, paperOnly: !image, fileId, expiry: docFields.expiry, source: docFields.source });
      id = existing.id;
    } else {
      id = addDoc(docFields);
    }
    if (hasDate && expiry) {
      addReminder({ docId: id, title: `${docFields.title} renewal`, titleHi: `${docFields.titleHi} रिन्यू`, due: expiry, notify: [personId, ...notify.filter((n) => n !== personId)] });
    }
    if (reqId) {
      answerRequest(reqId, "sent", id);
      const req = data.requests.find((q) => q.id === reqId);
      showToast(lang === "hi" ? `सेव हो गया और ${personName(req?.from ?? "rahul")} को भेज दिया।` : `Saved and sent to ${personName(req?.from ?? "rahul")}.`);
      go("");
    } else {
      showToast(t("savedToast"));
      window.location.replace(`#/doc/${id}`);
    }
  }

  const previewDoc: Doc = {
    id: "preview", title: title || "Document", titleHi: title, aliases: [], personId, category: category ?? "identity", art, image,
    paperOnly: false, fileId, source: "camera", number: digi?.number, addedBy: viewerId, addedOn: new Date().toISOString(),
  };
  const owner = person(personId);

  return (
    <Screen title={existing ? (lang === "hi" ? "फ़ोटो जोड़ें" : "Add a photo") : t("addTitle")} sub={`${step + 1} / ${STEP_KEYS.length}`}>
      {/* progress */}
      <div className="mb-4 flex gap-1.5" aria-hidden>
        {STEP_KEYS.map((_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-ink" : "bg-card"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
          {step === 0 && (
            <div>
              <h2 className="title-tight mb-3 text-[1.5rem] font-bold">{t("stepPhoto")}</h2>
              <div className="flex flex-col gap-2">
                <MethodBtn icon={Camera} title={t("takePhoto")} sub={t("takePhotoSub")} onClick={() => camRef.current?.click()} primary />
                <MethodBtn icon={ImageIcon} title={t("fromGallery")} sub={t("fromGallerySub")} onClick={() => galRef.current?.click()} />
                <MethodBtn icon={MessageCircle} title={t("fromWhatsappBtn")} sub={t("fromWhatsappSub")} onClick={() => setWaOpen(true)} />
                {!existing && <MethodBtn icon={ShieldCheck} title={t("fromDigilockerBtn")} sub={t("fromDigilockerSub")} onClick={() => setDlOpen(true)} />}
                {!existing && <MethodBtn icon={FileText} title={t("paperOnlyBtn")} sub={t("paperOnlySub")} onClick={() => { setMethod("paper"); setStep(1); }} />}
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0], "camera")} />
              <input ref={galRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0], "gallery")} />
            </div>
          )}

          {step === 1 && (
            <div>
              {image && <img src={image} alt="" className="mb-3 max-h-40 w-full rounded-[22px] border border-hair object-contain" />}
              <h2 className="title-tight mb-2 text-[1.5rem] font-bold">{t("stepWhat")}</h2>
              <div className="flex items-center gap-2">
                <input value={title} onChange={(e) => { setTitle(e.target.value); const g = guessFromName(e.target.value); if (g) { setCategory(g.category); setArt(g.art); } }}
                  placeholder={t("typeOrSpeak")} disabled={!!existing}
                  className="h-14 min-w-0 flex-1 rounded-[22px] border-2 border-transparent bg-card focus:border-ink px-4 text-[1.15rem] outline-none disabled:opacity-60" />
                {!existing && <MicButton onText={(txt) => { setTitle(txt); const g = guessFromName(txt); if (g) { setCategory(g.category); setArt(g.art); } }} />}
              </div>
              {!existing && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <Chip key={s.en} active={title === s.en || title === s.hi} onClick={() => pickSuggestion(s)}>{lang === "hi" ? s.hi : s.en}</Chip>
                  ))}
                </div>
              )}
              <h2 className="mt-6 mb-2 text-[1.2rem] font-semibold">{t("whose")}</h2>
              <div className="flex gap-2">
                {people.map((pp) => (
                  <button key={pp.id} disabled={!!existing} onClick={() => setPersonId(pp.id)}
                    className={`flex min-h-16 flex-1 items-center gap-2 rounded-[22px] border-2 px-3 ${personId === pp.id ? "border-ink bg-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)]" : "border-transparent bg-card"}`}>
                    <Avatar person={pp} size={36} />
                    <span className="text-[1.05rem] font-semibold">{personName(pp.id)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="title-tight mb-3 text-[1.5rem] font-bold">{t("stepFolder")}</h2>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCategory(c.id)}
                    className={`flex min-h-20 flex-col justify-between rounded-[22px] border-4 p-3 text-left ${c.tone} ${category === c.id ? "border-brand" : "border-transparent"}`}>
                    <span className="flex items-center justify-between"><Icon name={c.icon} size={26} />{category === c.id && <Check size={24} className="text-brand" />}</span>
                    <span className="text-[1.02rem] font-semibold">{lang === "hi" ? c.hi : c.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="title-tight mb-1 text-[1.5rem] font-bold">{t("stepWhere")}</h2>
              <p className="mb-3 text-[0.98rem] text-mute">{lang === "hi" ? "ताकि परिवार को असली कागज़ ढूँढने के लिए आपको फ़ोन न करना पड़े।" : "So nobody has to call you to find the original."}</p>
              <LocationPicker value={fileId} onChange={setFileId} />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="title-tight mb-3 text-[1.5rem] font-bold">{t("stepDate")}</h2>
              <div className="flex flex-col gap-2">
                <Chip active={hasDate === false} onClick={() => { setHasDate(false); setExpiry(""); }} className="justify-start">{t("noDate")}</Chip>
                <Chip active={hasDate === true} onClick={() => setHasDate(true)} icon="CalendarDays" className="justify-start">{lang === "hi" ? "हाँ, तारीख़ चुनें" : "Yes, pick the date"}</Chip>
              </div>
              {hasDate && (
                <>
                  <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} min={new Date().toISOString().slice(0, 10)}
                    className="mt-3 h-14 w-full rounded-[22px] border-2 border-transparent bg-card focus:border-ink px-4 text-[1.1rem]" aria-label={t("expires")} />
                  <p className="mt-4 mb-2 font-semibold">{t("remindAlso")}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.people.filter((x) => x.id !== personId && x.id !== "meena").map((x) => (
                      <Chip key={x.id} active={notify.includes(x.id)} onClick={() => setNotify((n) => (n.includes(x.id) ? n.filter((y) => y !== x.id) : [...n, x.id]))}>
                        {personName(x.id)}
                      </Chip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="title-tight mb-3 text-[1.5rem] font-bold">{lang === "hi" ? "एक बार देख लें" : "Check once and save"}</h2>
              <div className="rounded-[22px] bg-card p-3">
                {method === "paper" && !image ? (
                  <p className="rounded-2xl bg-paper p-4 text-center text-mute">{t("onlyPaper")}</p>
                ) : (
                  <DocArt doc={previewDoc} ownerName={(owner?.name ?? "") + " Sharma"} className="h-auto w-full" />
                )}
                <p className="mt-3 text-[1.2rem] font-semibold">{title}</p>
                <p className="text-mute">{personName(personId)} · {CATEGORIES.find((c) => c.id === category)?.[lang === "hi" ? "hi" : "en"]}</p>
                <SummaryLine fileId={fileId} />
                {hasDate && expiry && <p className="mt-2 text-[1rem]">🔔 {t("expires")}: {fmtDate(expiry, lang)}</p>}
              </div>
              <p className="mt-3 text-[0.98rem] text-mute">
                {lang === "hi" ? "ये लोग इसे देख सकेंगे: " : "Who will be able to see it: "}
                {data.members.filter((m) => m.access === "all" || (m.access === "some" && category && m.folders.includes(category))).map((m) => personName(m.personId)).join(", ")}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex gap-2 border-t border-hair bg-paper px-4 pt-3 pb-4">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>{t("back")}</Button>
          {step < 5 ? (
            <Button big className="flex-1" disabled={!canNext} onClick={() => setStep((s) => (existing && s === 1 ? 3 : s + 1))}>{t("next")}</Button>
          ) : (
            <Button big className="flex-1" icon="Check" onClick={save}>{reqId ? (lang === "hi" ? "सेव करें और भेजें" : "Save and send") : t("save")}</Button>
          )}
        </div>
      )}

      {/* WhatsApp: explains the real share route; the sample lets testers continue */}
      <Sheet open={waOpen} onClose={() => setWaOpen(false)} title={t("fromWhatsappBtn")}>
        <div className="rounded-[22px] bg-[#E7F5E9] p-4 text-[1.05rem]">{t("whatsappHow")}</div>
        <Button variant="secondary" className="mt-3 w-full" icon="Image" onClick={() => { setWaOpen(false); galRef.current?.click(); setMethod("whatsapp"); }}>
          {lang === "hi" ? "व्हाट्सऐप से सेव की फ़ोटो चुनें" : "Pick a photo saved from WhatsApp"}
        </Button>
        <Button className="mt-2 w-full" onClick={() => { setWaOpen(false); setMethod("whatsapp"); setArt("report"); setStep(1); }}>{t("tryWithSample")}</Button>
      </Sheet>

      {/* DigiLocker: consent, then pick issued documents */}
      <Sheet open={dlOpen} onClose={() => setDlOpen(false)} title={t("fromDigilockerBtn")}>
        <p className="text-[1.05rem] font-semibold">{t("digilockerConsent")}</p>
        <p className="mt-1 text-[0.95rem] text-mute">{t("digilockerNote")}</p>
        <div className="mt-4 flex flex-col gap-2">
          {[
            { title: "Driving licence", titleHi: "ड्राइविंग लाइसेंस", art: "licence" as Art, category: "vehicle" as CategoryId, personId: "sunita" },
            { title: "Vehicle RC", titleHi: "गाड़ी की आरसी", art: "card" as Art, category: "vehicle" as CategoryId, personId: "ramesh" },
            { title: "Class 10 marksheet", titleHi: "10वीं की मार्कशीट", art: "paper" as Art, category: "identity" as CategoryId, personId: "sunita" },
            { title: "ABHA health card", titleHi: "आभा हेल्थ कार्ड", art: "card" as Art, category: "health" as CategoryId, personId: "ramesh" },
          ].map((d) => (
            <button key={d.title} onClick={() => {
              setDigi(d); setTitle(lang === "hi" ? d.titleHi : d.title); setArt(d.art); setCategory(d.category); setPersonId(d.personId);
              setMethod("digilocker"); setDlOpen(false); setStep(3);
            }} className="flex min-h-16 items-center gap-3 rounded-[22px] bg-card px-3 text-left">
              <ShieldCheck size={24} className="text-brand" />
              <span className="flex-1">
                <span className="block font-semibold">{lang === "hi" ? d.titleHi : d.title}</span>
                <span className="text-[0.9rem] text-mute">{personName(d.personId)} · {lang === "hi" ? "सत्यापित" : "verified"}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.88rem] text-mute">{lang === "hi" ? "डिजीलॉकर से जोड़ने के लिए सरकार की मंज़ूरी चाहिए। यहाँ यह कैसा दिखेगा, वो दिखाया है।" : "Connecting to DigiLocker needs government partner approval. This shows how it would work."}</p>
      </Sheet>
    </Screen>
  );
}

function MethodBtn({ icon: I, title, sub, onClick, primary }: { icon: any; title: string; sub: string; onClick: () => void; primary?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`flex min-h-[88px] items-center gap-4 rounded-[28px] px-4 text-left ${primary ? "bg-brand text-white" : "bg-card"}`}>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${primary ? "bg-white/15" : "bg-white"}`}><I size={26} aria-hidden /></span>
      <span>
        <span className="title-tight block text-[1.25rem] leading-tight font-bold">{title}</span>
        <span className={`block text-[0.92rem] ${primary ? "text-white/80" : "text-mute"}`}>{sub}</span>
      </span>
    </motion.button>
  );
}

function SummaryLine({ fileId }: { fileId: string | null }) {
  const { locationLine, file, t } = useStore();
  const f = file(fileId);
  return (
    <div className="mt-2 flex items-start gap-2 rounded-2xl bg-saffron-soft p-3 text-[1rem]">
      <span className="mt-1 h-4 w-4 shrink-0 rounded-sm border border-black/20" style={{ background: f?.color }} />
      <span><b>{t("originalKept")}:</b> {locationLine(fileId)}</span>
    </div>
  );
}
