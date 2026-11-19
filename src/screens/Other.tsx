import { useState } from "react";
import { motion } from "motion/react";
import { HandHelping, Smartphone, Check, Plus, Phone, KeyRound, ShieldAlert, Printer, Bell, Users, FlaskConical, RotateCcw, ChevronRight, ChevronDown, Lock, HeartHandshake, Info } from "lucide-react";
import { CATEGORIES, READY_FOR, type Access, type CategoryId } from "../data";
import { useStore } from "../store";
import { matchBundleItem } from "../search";
import { Avatar, PlaceView } from "../art";
import { Button, Card, Chip, EmptyNote, Icon, Screen, SectionTitle, Sheet, StickerBand } from "../components/ui";
import { DocRow, LocationDot } from "../components/DocRow";
import { LangToggle } from "./Home";
import { CatArt, FamilyArt, ReadyArt, SuccessBurst } from "../illustrations";
import { daysUntil, fmtDate, timeAgo } from "../i18n";

/* ================= FOLDER ================= */
export function Category({ id }: { id: CategoryId }) {
  const { data, lang, t, go } = useStore();
  const cat = CATEGORIES.find((c) => c.id === id)!;
  const docs = data.docs.filter((d) => d.category === id);
  const missing = cat.suggest.filter((s) => !docs.some((d) => d.title.toLowerCase().includes(s.en.toLowerCase().split(" ")[0].toLowerCase())));
  return (
    <Screen title={lang === "hi" ? cat.hi : cat.en} sub={`${docs.length} ${t("documents")}`}>

      <div className="flex flex-col gap-2">
        {docs.map((d, i) => <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}><DocRow doc={d} /></motion.div>)}
        {!docs.length && <EmptyNote>{lang === "hi" ? "अभी इस फ़ोल्डर में कुछ नहीं है।" : "Nothing in this folder yet."}</EmptyNote>}
      </div>
      {missing.length > 0 && (
        <>
          <SectionTitle>{t("suggested")}</SectionTitle>
          <div className="flex flex-col gap-2">
            {missing.map((s) => (
              <motion.button key={s.en} whileTap={{ scale: 0.98 }}
                onClick={() => go(`add?name=${encodeURIComponent(lang === "hi" ? s.hi : s.en)}&cat=${id}&art=${s.art}`)}
                className="flex min-h-14 items-center gap-3 rounded-[22px] border-2 border-dashed border-black/15 bg-white px-4 text-left">
                <Plus size={22} className="text-brand" />
                <span className="flex-1 text-[1.05rem]">{lang === "hi" ? s.hi : s.en}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </Screen>
  );
}

/* ================= READY FOR… ================= */
export function Ready({ id }: { id: string }) {
  const { data, lang, t, go } = useStore();
  const b = READY_FOR.find((r) => r.id === id)!;
  const [packed, setPacked] = useState<string[]>([]);
  const { settings } = useStore();
  const [who, setWho] = useState<"sunita" | "ramesh" | "both">(id === "pension" ? "ramesh" : "sunita");
  const nameOf = (p: "sunita" | "ramesh") => settings.role === "keeper" ? (p === "sunita" ? t("me") : lang === "hi" ? "रमेश जी" : "Ramesh") : p === "sunita" ? (lang === "hi" ? "मम्मी" : "Mummy") : lang === "hi" ? "पापा" : "Papa";
  const docs = who === "both" ? data.docs : data.docs.filter((d) => d.personId === who);
  return (
    <Screen title={lang === "hi" ? b.hi : b.en}>
      <StickerBand art={<ReadyArt id={b.id} className="h-32 w-40" />}
        title={lang === "hi" ? "क्या ले जाना है, और कहाँ रखा है" : "What to take, and which file it's in"}
        sub={`${packed.length} / ${b.items.length} ${t("packed").toLowerCase()}`} />
      <p className="mb-2 text-[1.05rem] font-semibold">{lang === "hi" ? "किसके लिए?" : "Who is going?"}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={who === "sunita"} onClick={() => setWho("sunita")}>{nameOf("sunita")}</Chip>
        <Chip active={who === "ramesh"} onClick={() => setWho("ramesh")}>{nameOf("ramesh")}</Chip>
        <Chip active={who === "both"} onClick={() => setWho("both")}>{lang === "hi" ? "दोनों" : "Both"}</Chip>
      </div>
      <div className="flex flex-col gap-3">
        {b.items.map((it) => {
          const found = matchBundleItem(docs, it.match);
          const key = it.en;
          const isPacked = packed.includes(key);
          return (
            <motion.div key={key} layout className={`rounded-[26px] p-3 transition-colors ${isPacked ? "bg-[#EAF6EE]" : "bg-white ring-1 ring-black/[0.08]"}`}>
              <div className="flex items-start gap-3">
                <motion.button whileTap={{ scale: 0.85 }} data-guide={b.items[0].en === key ? "ready-pack-0" : undefined}
                  onClick={() => setPacked((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]))}
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 ${isPacked ? "border-[#2E9E5B] bg-[#2E9E5B] text-white" : "border-black/20 bg-white"}`}
                  aria-label={t("packed")} aria-pressed={isPacked}
                >
                  {isPacked && <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}><Check size={26} /></motion.span>}
                </motion.button>
                <div className="min-w-0 flex-1">
                  <p className="text-[1.12rem] font-semibold">{lang === "hi" ? it.hi : it.en}</p>
                  <p className="text-[0.92rem] text-mute">{lang === "hi" ? it.whyHi : it.why}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {found.length ? found.map((d) => <DocRow key={d.id} doc={d} />) : (
                  <button onClick={() => go(`add?name=${encodeURIComponent(lang === "hi" ? it.hi : it.en)}`)} className="flex min-h-12 items-center gap-2 rounded-full bg-[#FFF4DC] px-4 text-left font-semibold">
                    <Plus size={20} /> {t("notAdded")} · {t("addIt")}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-hair"><motion.div className="h-full rounded-full bg-brand" animate={{ width: `${(packed.length / b.items.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} /></div>
      <p className="mt-2 text-center text-[1rem] font-semibold text-brand">{packed.length} / {b.items.length} {t("packed").toLowerCase()}</p>
      {packed.length === b.items.length && <div className="mt-2 flex justify-center"><SuccessBurst size={110} /></div>}
    </Screen>
  );
}

/* ================= FAMILY ================= */
const ACCESS: { id: Access; key: "accessAll" | "accessSome" | "accessEmergency"; icon: string }[] = [
  { id: "all", key: "accessAll", icon: "Eye" },
  { id: "some", key: "accessSome", icon: "FolderOpen" },
  { id: "emergency", key: "accessEmergency", icon: "Siren" },
];

export function Family() {
  const { data, t, lang, person, personName, setMember, removeMember, showToast, settings, docTitle } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const m = data.members.find((x) => x.personId === editing);
  const isKeeper = settings.role === "keeper";

  const verb = (a: string) => ({ viewed: t("viewed"), added: t("addedA"), shared: t("shared"), asked: t("asked"), sent: t("sentA"), moved: t("moved"), access: "" } as Record<string, string>)[a] ?? a;

  return (
    <Screen title={t("familyTitle")}>
      <div className="flex flex-col gap-2">
        {data.people.filter((p) => p.owner && !data.members.some((m) => m.personId === p.id)).map((p) => (
          <Card key={p.id} className="flex items-center gap-3">
            <Avatar person={p} size={48} />
            <span className="flex-1">
              <span className="block text-[1.1rem] font-semibold">{personName(p.id)}</span>
              <span className="text-[0.92rem] text-mute">{lang === "hi" ? "कागज़ इनके हैं" : "Owner of these documents"}</span>
            </span>
          </Card>
        ))}
        {data.members.map((mm) => {
          const p = person(mm.personId)!;
          const a = ACCESS.find((x) => x.id === mm.access)!;
          return (
            <Card key={mm.personId} onClick={isKeeper ? () => setEditing(mm.personId) : undefined} className="flex items-center gap-3">
              <Avatar person={p} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block text-[1.1rem] font-semibold">{personName(p.id)} <span className="font-normal text-mute">· {lang === "hi" ? p.relationHi : p.relation}, {lang === "hi" ? p.cityHi : p.city}</span></span>
                <span className="flex items-center gap-1.5 text-[0.95rem] text-mute">
                  <Icon name={a.icon} size={18} /> {t(a.key)}
                  {mm.access === "some" && `: ${mm.folders.map((f) => CATEGORIES.find((c) => c.id === f)?.[lang === "hi" ? "hi" : "en"]).join(", ")}`}
                </span>
                {mm.canAdd && <span className="block text-[0.9rem] text-brand">{t("canAdd")}</span>}
              </span>
              {isKeeper && <ChevronRight size={22} className="text-mute" />}
            </Card>
          );
        })}
      </div>
      {isKeeper && <Button variant="secondary" icon="UserPlus" className="mt-3 w-full" onClick={() => setInviting(true)}>{t("invite")}</Button>}

      <SectionTitle>{t("activity")}</SectionTitle>
      <div className="flex flex-col gap-2">
        {data.activity.slice(0, 14).map((a) => {
          const d = data.docs.find((x) => x.id === a.docId);
          return (
            <div key={a.id} className="flex items-start gap-3 rounded-[20px] bg-white lift px-3 py-2.5">
              <Avatar person={person(a.who)} size={34} />
              <p className="flex-1 text-[1rem] leading-snug">
                <b>{personName(a.who)}</b> {verb(a.action)} <b>{d ? docTitle(d) : ""}</b>
                {a.detail ? <span className="text-mute"> · {a.detail}</span> : null}
                <span className="block text-[0.88rem] text-mute">{timeAgo(a.at, lang)}</span>
              </p>
            </div>
          );
        })}
      </div>

      <Sheet open={!!m} onClose={() => setEditing(null)} title={m ? personName(m.personId) : ""}>
        {m && (
          <div className="flex flex-col gap-2">
            {ACCESS.map((a) => (
              <button key={a.id} onClick={() => setMember({ ...m, access: a.id, folders: a.id === "some" && !m.folders.length ? ["health"] : m.folders })}
                className={`flex min-h-16 items-center gap-3 rounded-[22px] border-2 px-4 text-left ${m.access === a.id ? "border-ink bg-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)]" : "border-transparent bg-white lift"}`}>
                <Icon name={a.icon} size={24} />
                <span className="flex-1 text-[1.05rem] font-semibold">{t(a.key)}</span>
                {m.access === a.id && <Check size={24} className="text-brand" />}
              </button>
            ))}
            {m.access === "some" && (
              <div className="mt-1 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c.id} active={m.folders.includes(c.id)} onClick={() => setMember({ ...m, folders: m.folders.includes(c.id) ? m.folders.filter((f) => f !== c.id) : [...m.folders, c.id] })}>
                    {lang === "hi" ? c.hi : c.en}
                  </Chip>
                ))}
              </div>
            )}
            {m.access === "emergency" && <p className="text-[0.95rem] text-mute">{personName(m.personId)} {t("emergencyOnlyNote")}</p>}
            <label className="mt-2 flex min-h-14 items-center gap-3 rounded-[22px] bg-white lift px-4">
              <input type="checkbox" className="h-6 w-6 accent-[#1E5B4F]" checked={m.canAdd} onChange={(e) => setMember({ ...m, canAdd: e.target.checked })} />
              <span className="text-[1rem]">{t("canAdd")}</span>
            </label>
            <Button variant="danger" icon="UserMinus" className="mt-2" onClick={() => { removeMember(m.personId); setEditing(null); showToast(lang === "hi" ? "हटा दिया।" : "Removed from the circle."); }}>{t("remove")}</Button>
            <Button className="mt-1" onClick={() => setEditing(null)}>{t("done")}</Button>
          </div>
        )}
      </Sheet>

      <Sheet open={inviting} onClose={() => setInviting(false)} title={t("invite")}>
        <p className="text-[1rem] text-mute">{lang === "hi" ? "उन्हें व्हाट्सऐप पर एक लिंक जाएगा। वो अपने नंबर से जुड़ेंगे, और आप तय करेंगी कि वो क्या देखें।" : "They get a link on WhatsApp, join with their own number, and you decide what they can see."}</p>
        <input placeholder={lang === "hi" ? "नाम" : "Name"} className="mt-3 h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] px-4 text-[1.1rem]" />
        <input placeholder={lang === "hi" ? "मोबाइल नंबर" : "Mobile number"} inputMode="tel" className="mt-2 h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] px-4 text-[1.1rem]" />
        <Button big className="mt-3 w-full" icon="MessageCircle" onClick={() => { setInviting(false); showToast(t("inviteToast")); }}>{lang === "hi" ? "व्हाट्सऐप पर बुलाएँ" : "Invite on WhatsApp"}</Button>
      </Sheet>
    </Screen>
  );
}

/* ================= ASK (helper) ================= */
const ASK_DOCS = [
  { en: "Gas connection book", hi: "गैस कनेक्शन बुक" },
  { en: "Flat agreement", hi: "फ्लैट एग्रीमेंट" },
  { en: "Bank passbook", hi: "बैंक पासबुक" },
  { en: "Doctor's prescription", hi: "डॉक्टर का पर्चा" },
  { en: "Electricity bill", hi: "बिजली बिल" },
];
const ASK_WHY = [
  { en: "KYC update", hi: "केवाईसी अपडेट" },
  { en: "Form filling", hi: "फ़ॉर्म भरना" },
  { en: "Insurance claim", hi: "बीमा क्लेम" },
  { en: "Doctor appointment", hi: "डॉक्टर अपॉइंटमेंट" },
];

export function Ask() {
  const { data, t, lang, sendRequest, showToast, go, docTitle, route } = useStore();
  const [doc, setDoc] = useState(() => route.params.get("name") ?? "");
  const [why, setWhy] = useState("");
  const match = data.docs.find((d) => d.title.toLowerCase() === doc.toLowerCase() || d.titleHi === doc || d.aliases.includes(doc.toLowerCase()));
  return (
    <Screen title={t("askTitle")}>
      <p className="mb-2 text-[1.1rem] font-semibold">{t("askWhich")}</p>
      <div className="flex flex-wrap gap-2">
        {ASK_DOCS.map((d) => {
          const v = lang === "hi" ? d.hi : d.en;
          return <Chip key={d.en} active={[v, d.en].some((x) => x.toLowerCase() === doc.trim().toLowerCase())} onClick={() => setDoc(d.en)}>{v}</Chip>;
        })}
      </div>
      <input value={doc} onChange={(e) => setDoc(e.target.value)} placeholder={lang === "hi" ? "या नाम लिखें" : "Or type a name"}
        className="mt-3 h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] px-4 text-[1.1rem] outline-none focus:border-brand" />
      {match && (
        <div className="mt-2 flex items-start gap-2 rounded-[20px] bg-white lift p-3 text-[0.98rem]">
          <Info size={20} className="mt-0.5 shrink-0 text-brand" />
          <span>{lang === "hi" ? `यह पहले से है: ${docTitle(match)}।` : `Already here: ${docTitle(match)}.`} {match.paperOnly ? (lang === "hi" ? "पर सिर्फ़ कागज़ पर है, मम्मी फ़ोटो लेकर भेजेंगी।" : "But it is only on paper, so Mummy will take a photo and send it.") : (lang === "hi" ? "आप इसे अभी खोल सकते हैं।" : "You can open it now.")}</span>
        </div>
      )}
      <p className="mt-5 mb-2 text-[1.1rem] font-semibold">{t("askWhy")}</p>
      <div className="flex flex-wrap gap-2">
        {ASK_WHY.map((w) => {
          const v = lang === "hi" ? w.hi : w.en;
          return <Chip key={w.en} active={why === v} onClick={() => setWhy(v)}>{v}</Chip>;
        })}
      </div>
      <Button big className="mt-6 w-full" icon="Send" disabled={!doc.trim() || !why}
        onClick={() => {
          sendRequest({ from: "rahul", to: "sunita", docName: match ? match.title : doc.trim(), docId: match?.id, purpose: why });
          showToast(t("askedToast"));
          go("");
        }}>{t("askSend")}</Button>
      {match && !match.paperOnly && <Button variant="ghost" className="mt-2 w-full" onClick={() => go(`doc/${match.id}`)}>{lang === "hi" ? "अभी खोलें" : "Open it now"}</Button>}
    </Screen>
  );
}

/* ================= REMINDERS ================= */
export function Reminders() {
  const { data, t, lang, personName, toggleReminder, addReminder, showToast, go } = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const list = [...data.reminders].sort((a, b) => Number(!!a.done) - Number(!!b.done) || a.due.localeCompare(b.due));
  return (
    <Screen title={t("remindersTitle")}>
      <div className="flex flex-col gap-2">
        {list.map((r) => {
          const n = daysUntil(r.due);
          return (
            <div key={r.id} className={`rounded-[22px] bg-white lift p-3 ${r.done ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-3">
                <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[22px] text-center leading-none ${n <= 14 && !r.done ? "bg-white text-danger" : "bg-white"} shadow-[0_4px_12px_-6px_rgba(0,0,0,0.25)]`}>
                  <span className="text-[1.15rem] font-bold">{new Date(r.due).getDate()}</span>
                  <span className="text-[0.7rem]">{new Date(r.due).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short" })}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[1.08rem] leading-snug font-semibold ${r.done ? "line-through" : ""}`}>{lang === "hi" ? r.titleHi : r.title}</span>
                  <span className="block text-[0.92rem] text-mute">{fmtDate(r.due, lang)} · {n} {t("daysLeft")}</span>
                  <span className="mt-1 flex items-center gap-1 text-[0.9rem] text-mute"><Bell size={16} /> {r.notify.map((p) => personName(p)).join(", ")}</span>
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant={r.done ? "secondary" : "primary"} icon="Check" onClick={() => toggleReminder(r.id)}>{r.done ? (lang === "hi" ? "वापस करें" : "Undo") : t("markDone")}</Button>
                {r.docId && <Button variant="secondary" icon="FileText" onClick={() => go(`doc/${r.docId}`)}>{lang === "hi" ? "कागज़" : "Paper"}</Button>}
              </div>
            </div>
          );
        })}
      </div>
      <Button variant="secondary" icon="Plus" className="mt-3 w-full" onClick={() => setAdding(true)}>{t("addReminder")}</Button>
      <Sheet open={adding} onClose={() => setAdding(false)} title={t("addReminder")}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === "hi" ? "जैसे: बिजली बिल भरना" : "e.g. Pay electricity bill"} className="h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] focus:border-ink px-4 text-[1.1rem]" />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="mt-2 h-14 w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] px-4 text-[1.1rem]" />
        <p className="mt-2 text-[0.95rem] text-mute">{lang === "hi" ? "आपको और राहुल को याद आएगी।" : "You and Rahul will both get it."}</p>
        <Button big className="mt-3 w-full" disabled={!title.trim() || !due} onClick={() => {
          addReminder({ title: title.trim(), titleHi: title.trim(), due, notify: ["sunita", "rahul"] });
          setAdding(false); setTitle(""); setDue("");
          showToast(lang === "hi" ? "रिमाइंडर लग गया।" : "Reminder set.");
        }}>{t("save")}</Button>
      </Sheet>
    </Screen>
  );
}

/* ================= IF I'M UNWELL ================= */
export function Unwell() {
  const { data, t, lang, person, personName, settings, go } = useStore();
  const u = data.unwell;
  const key = ["d9", "d10", "d7", "d11", "d14", "d1", "d3"].map((id) => data.docs.find((d) => d.id === id)).filter(Boolean);
  return (
    <Screen title={settings.role === "keeper" ? t("unwellTitle") : lang === "hi" ? "अगर मम्मी-पापा की तबियत ख़राब हो" : "If Mummy or Papa is unwell"} sub={t("unwellSub")}>
      <div className="rounded-[28px] bg-[#FDECEA] p-4">
        <p className="flex items-center gap-2 text-[1.1rem] font-semibold"><HeartHandshake size={24} /> {t("callFirst")}</p>
        <ol className="mt-2 flex flex-col gap-2">
          {u.call.map((pid, i) => {
            const p = person(pid)!;
            return (
              <li key={pid} className="flex items-center gap-3 rounded-2xl bg-white p-2.5">
                <span className="w-6 text-center text-[1.2rem] font-bold">{i + 1}</span>
                <Avatar person={p} size={36} />
                <span className="flex-1 font-semibold">{personName(pid)} <span className="font-normal text-mute">· {lang === "hi" ? p.relationHi : p.relation}</span></span>
                <Phone size={22} className="text-brand" aria-hidden />
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2">
        <Card><p className="text-[0.9rem] text-mute">{t("doctor")}</p><p className="text-[1.05rem] font-semibold">{u.doctor}</p></Card>
        <Card><p className="text-[0.9rem] text-mute">{t("hospital")}</p><p className="text-[1.05rem] font-semibold">{u.hospital}</p></Card>
      </div>
      <div className="mt-3 rounded-[22px] bg-[#FFF4DC] p-4 text-[1.02rem]">{lang === "hi" ? u.noteHi : u.note}</div>
      <SectionTitle>{t("importantPapers")}</SectionTitle>
      <div className="flex flex-col gap-2">{key.map((d) => <DocRow key={d!.id} doc={d!} />)}</div>
      <SectionTitle>{t("passwordDiary")}</SectionTitle>
      <Card onClick={() => go("diary")} className="flex items-start gap-3">
        <KeyRound size={24} className="mt-0.5 shrink-0 text-brand" />
        <span className="flex-1 text-[1.02rem]">{lang === "hi" ? data.diary.hi : data.diary.en}</span>
      </Card>
      <p className="mt-4 text-[0.95rem] text-mute">{t("visibleTo")}: {u.visibleTo.map((p) => personName(p)).join(", ")}</p>
    </Screen>
  );
}

/* ================= PASSWORDS & LOGINS (never the passwords) ================= */
export function Diary() {
  const { data, t, lang, personName, setDiary, showToast, settings } = useStore();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(lang === "hi" ? data.diary.hi : data.diary.en);
  return (
    <Screen title={t("diaryTitle")}>
      <div className="flex items-start gap-3 rounded-[22px] bg-brand text-white p-4">
        <ShieldAlert size={28} className="shrink-0" />
        <p className="text-[1.02rem] leading-snug">{t("diaryNever")}</p>
      </div>
      <SectionTitle right={settings.role === "keeper" ? <button className="min-h-10 font-semibold text-brand" onClick={() => setEditing(true)}>{t("edit")}</button> : undefined}>{t("diaryWhere")}</SectionTitle>
      <Card className="flex items-start gap-3">
        <KeyRound size={26} className="mt-0.5 shrink-0 text-saffron" />
        <p className="text-[1.08rem]">{lang === "hi" ? data.diary.hi : data.diary.en}</p>
      </Card>
      <SectionTitle>{t("accountsTitle")}</SectionTitle>
      <div className="flex flex-col gap-2">
        {data.accounts.map((a) => (
          <Card key={a.id}>
            <p className="text-[1.05rem] font-semibold">{lang === "hi" ? a.nameHi : a.name} <span className="font-normal text-mute">· {personName(a.personId)}</span></p>
            <p className="text-[0.98rem] text-mute">{lang === "hi" ? a.loginWithHi : a.loginWith}</p>
          </Card>
        ))}
      </div>
      <Sheet open={editing} onClose={() => setEditing(false)} title={t("diaryWhere")}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-[22px] bg-white ring-1 ring-[#D8D8DE] focus:border-ink p-3 text-[1.08rem]" />
        <Button big className="mt-3 w-full" onClick={() => { setDiary(text); setEditing(false); showToast(lang === "hi" ? "सेव हो गया।" : "Saved."); }}>{t("save")}</Button>
      </Sheet>
    </Screen>
  );
}

/* ================= MORE / SETTINGS ================= */
export function More() {
  const { t, lang, settings, setSettings, go, reset, showToast, setUnlocked } = useStore();
  const links = [
    { icon: Users, label: t("familyTitle"), to: "family" },
    { icon: HandHelping, label: lang === "hi" ? "मदद: कैसे करें, दिखाओ" : "Help: show me how", to: "help" },
    { icon: Smartphone, label: lang === "hi" ? "फ़ोन उधार दें (आज़माया गया आइडिया)" : "Lend my phone (explored idea)", to: "lend" },
    { icon: Bell, label: t("remindersTitle"), to: "reminders" },
    { icon: HeartHandshake, label: t("unwellTitle"), to: "unwell" },
    { icon: KeyRound, label: t("diaryTitle"), to: "diary" },
    { icon: Printer, label: t("printIndex"), to: "print" },
  ];
  return (
    <Screen title={t("moreTitle")} noBack>
      <SectionTitle>{t("language")}</SectionTitle>
      <LangToggle />
      <SectionTitle>{t("textSize")}</SectionTitle>
      <div className="flex gap-2">
        {([0, 1, 2] as const).map((s) => (
          <button key={s} onClick={() => setSettings({ scale: s })} aria-pressed={settings.scale === s}
            className={`flex h-14 flex-1 items-center justify-center rounded-full border-2 font-semibold ${settings.scale === s ? "border-ink bg-brand text-white" : "border-transparent bg-white ring-1 ring-[#D8D8DE]"}`}
            style={{ fontSize: [16, 20, 24][s] }}>A{s > 0 ? "+".repeat(s) : ""}</button>
        ))}
      </div>
      <SectionTitle>{t("whoIsUsing")}</SectionTitle>
      <div className="flex gap-2">
        <Chip active={settings.role === "keeper"} onClick={() => { setSettings({ role: "keeper" }); go(""); }}>{lang === "hi" ? "सुनीता (मम्मी)" : "Sunita (Mummy)"}</Chip>
        <Chip active={settings.role === "helper"} onClick={() => { setSettings({ role: "helper" }); go(""); }}>{lang === "hi" ? "राहुल (बेटा)" : "Rahul (son)"}</Chip>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {links.map((l) => (
          <Card key={l.to} onClick={() => go(l.to)} className="flex items-center gap-3">
            <l.icon size={24} className="text-brand" />
            <span className="flex-1 text-[1.05rem] font-semibold">{l.label}</span>
            <ChevronRight size={22} className="text-mute" />
          </Card>
        ))}
      </div>
      <label className="mt-4 flex min-h-14 items-center gap-3 rounded-[22px] bg-white lift px-4">
        <Lock size={22} className="text-brand" />
        <span className="flex-1 text-[1rem]">{t("lockApp")}</span>
        <input type="checkbox" className="h-6 w-6 accent-[#1E5B4F]" checked={settings.lock} onChange={(e) => { setSettings({ lock: e.target.checked }); if (!e.target.checked) setUnlocked(true); }} />
      </label>
      <div className="mt-6 flex flex-col gap-2">
        <Button variant="secondary" icon="FlaskConical" onClick={() => go("lab")}>{t("testKit")}</Button>
        <Button variant="ghost" icon="RotateCcw" onClick={() => { reset(); showToast(lang === "hi" ? "सैंपल डेटा फिर से शुरू।" : "Sample data reset."); go(""); }}>{t("resetDemo")}</Button>
      </div>
      <p className="mt-6 text-center text-[0.88rem] text-mute">{t("sampleData")}</p>
      <p className="mt-1 text-center text-[0.88rem] text-mute">Almari · MIT Institute of Design · Group 4 · 2026</p>
    </Screen>
  );
}

/* ================= PRINT THE ALMIRAH LIST ================= */
/* What is where: every place, every file in it, and the papers inside. */
export function Where() {
  const { data, lang, go, person, docTitle } = useStore();
  const hi = lang === "hi";
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Screen title={hi ? "क्या कहाँ रखा है" : "What is where"} sub={`${data.files.length} ${hi ? "फ़ाइलें" : "files"} · ${data.places.length} ${hi ? "जगहें" : "places"}`}>
      <div className="flex flex-col gap-4">
        {data.places.map((pl) => {
          const files = data.files.filter((f) => f.placeId === pl.id);
          if (!files.length) return null;
          const count = data.docs.filter((d) => files.some((f) => f.id === d.fileId)).length;
          return (
            <section key={pl.id} className="overflow-hidden rounded-[22px] bg-white lift">
              <div className="flex items-baseline justify-between gap-3 px-4 pt-4">
                <h2 className="text-[1.15rem] font-bold">{hi ? pl.nameHi : pl.name}</h2>
                <span className="shrink-0 text-[0.94rem] text-mute">{count} {hi ? "कागज़" : count === 1 ? "paper" : "papers"}</span>
              </div>
              <div className="mx-4 mt-3 rounded-[16px] bg-[#F6F9F2] px-2 pt-3 pb-2">
                <PlaceView place={pl} files={data.files} compact person={pl.personId ? person(pl.personId) : undefined} />
              </div>
              <ul className="mt-1">
                {files.map((f, i) => {
                  const docs = data.docs.filter((d) => d.fileId === f.id);
                  const spot = pl.spots.find((x) => x.id === f.spotId);
                  const isOpen = open === f.id;
                  return (
                    <li key={f.id} className={i ? "border-t border-[#ECECF0]" : ""}>
                      <button onClick={() => setOpen(isOpen ? null : f.id)} aria-expanded={isOpen} className="flex min-h-[3.75rem] w-full items-center gap-3 px-4 py-2 text-left">
                        <span className="h-8 w-6 shrink-0 rounded-[4px]" style={{ background: f.color }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[1.06rem] leading-snug font-semibold">{hi ? `${f.colorNameHi} फ़ाइल (${f.labelHi})` : `${f.colorName} file (${f.label})`}</span>
                          <span className="block text-[0.94rem] text-mute">{hi ? spot?.hi : spot?.en} · {docs.length} {hi ? "कागज़" : docs.length === 1 ? "paper" : "papers"}</span>
                        </span>
                        <ChevronDown size={20} className={`shrink-0 text-mute transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <ul className="px-4 pb-3">
                          {docs.map((d) => (
                            <li key={d.id}>
                              <button onClick={() => go(`doc/${d.id}`)} className="flex min-h-12 w-full items-center gap-3 rounded-xl pl-9 text-left">
                                <span className="min-w-0 flex-1 text-[1rem]">{docTitle(d)}</span>
                                <ChevronRight size={18} className="shrink-0 text-mute" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      <Button variant="secondary" icon="Printer" className="mx-auto mt-6" onClick={() => go("print")}>{hi ? "यह लिस्ट प्रिंट करें" : "Print this list"}</Button>
    </Screen>
  );
}

export function PrintSheet() {
  const { data, lang, back, file } = useStore();
  const byFile = data.files.map((f) => ({ f, docs: data.docs.filter((d) => d.fileId === f.id) })).filter((x) => x.docs.length);
  return (
    <div className="print-area min-h-full bg-white p-6 text-ink">
      <div className="no-print mb-4 flex gap-2">
        <Button variant="secondary" icon="ArrowLeft" onClick={back}>{lang === "hi" ? "पीछे" : "Back"}</Button>
        <Button icon="Printer" onClick={() => window.print()}>{lang === "hi" ? "प्रिंट करें" : "Print"}</Button>
      </div>
      <h1 className="text-[2rem] leading-tight font-bold">{lang === "hi" ? "हमारी अलमारी में क्या कहाँ है" : "What is where in our almirah"}</h1>
      <p className="mt-1 text-mute">Sharma family · {fmtDate(new Date().toISOString(), lang)} · Almari</p>
      {data.places.map((pl) => {
        const groups = byFile.filter((x) => x.f.placeId === pl.id);
        if (!groups.length) return null;
        return (
          <section key={pl.id} className="mt-6 break-inside-avoid">
            <h2 className="border-b-2 border-ink pb-1 text-[1.3rem] font-semibold">{lang === "hi" ? pl.nameHi : pl.name}</h2>
            {groups.map(({ f, docs }) => {
              const spot = pl.spots.find((s) => s.id === f.spotId);
              return (
                <div key={f.id} className="mt-3 flex gap-3">
                  <span className="mt-1 h-10 w-6 shrink-0 rounded" style={{ background: f.color }} />
                  <div>
                    <p className="font-semibold">{lang === "hi" ? `${f.colorNameHi} फ़ाइल (${f.labelHi})` : `${f.colorName} file (${f.label})`} <span className="font-normal text-mute">· {lang === "hi" ? spot?.hi : spot?.en}</span></p>
                    <ul className="list-disc pl-5 text-[0.98rem]">
                      {docs.map((d) => <li key={d.id}>{lang === "hi" ? d.titleHi : d.title} ({d.personId === "sunita" ? "Sunita" : "Ramesh"}){d.expiry ? ` · renew by ${fmtDate(d.expiry, lang)}` : ""}</li>)}
                    </ul>
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
      <p className="mt-8 text-[0.85rem] text-mute">{lang === "hi" ? "पासवर्ड इस लिस्ट में नहीं हैं। पासवर्ड डायरी: " : "Passwords are not on this list. Password diary: "}{lang === "hi" ? data.diary.hi : data.diary.en}</p>
    </div>
  );
}
