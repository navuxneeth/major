import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, Download, Copy, Trash2, Plus, ArrowLeft, Link2 } from "lucide-react";
import { useStore } from "../store";

/* Facilitator's testing kit: task script, timer, outcome codes, ease rating, notes, CSV export.
   Stored only in this browser. Use it on the facilitator's own laptop or phone. */

type Outcome = "I" | "H1" | "H2" | "H3" | "F" | "S" | "";
interface TaskResult { outcome: Outcome; ms: number; seq: number; notes: string; quote: string }
interface Session {
  id: string;
  code: string;
  type: "Older adult" | "Caregiver";
  mode: "In person" | "Remote";
  lang: "English" | "Hindi" | "Mixed";
  date: string;
  pre: { q1: string; q2: string; q3: string };
  results: Record<string, TaskResult>;
  post: { use: string; stop: string; trust: string; away?: string };
}

const TASKS: { id: string; who: "all" | "caregiver" | "older"; en: string; hi: string; tests: string; start: string; target: string; note?: string }[] = [
  { id: "T1", who: "all", target: "90 s", en: "You are at a railway counter and need your Aadhaar. Show it, then tell me where the original is kept.", hi: "आप रेलवे काउंटर पर हैं और आधार दिखाना है। उसे दिखाइए, फिर बताइए असली कागज़ कहाँ रखा है।", tests: "Find, full screen, read the place", start: "Home" },
  { id: "T2", who: "all", target: "60 s helper, 90 s older adult", en: "This month's gas bill has come. Add it to the app. The paper goes in the white Bills file in the kitchen drawer.", hi: "इस महीने का गैस बिल आया है। इसे ऐप में जोड़िए। कागज़ रसोई की दराज़ में सफ़ेद बिल वाली फ़ाइल में रखा है।", tests: "Add flow, folder, place picker", start: "Home", note: "Typing \"Gas bill\" picks the Bills folder by itself, so that step is skipped. If Next is greyed out, the app now says what is missing: note whether they read it." },
  { id: "T3", who: "all", target: "60 s", en: "The bank wants your Aadhaar for KYC. Send it to them safely.", hi: "बैंक को केवाईसी के लिए आपका आधार चाहिए। उसे सुरक्षित तरीके से भेजिए।", tests: "Share safely: purpose stamp, masking", start: "Home" },
  { id: "T4", who: "all", target: "120 s", en: "When is the next pension life certificate due, and what does Ramesh (Papa) have to do for it?", hi: "पेंशन का अगला जीवन प्रमाण कब है, और रमेश जी (पापा) को उसके लिए क्या करना होगा?", tests: "Reminders, with what to do", start: "Home", note: "Success needs both parts: the date, and that he must go himself for the face scan or thumb." },
  { id: "T5", who: "caregiver", target: "180 s", en: "The app has an idea for helping your parent from another city. Find it, and tell me in your own words what it would let you do, and what it would not.", hi: "ऐप में दूसरे शहर से मम्मी-पापा की मदद का एक आइडिया है। उसे ढूँढिए, और अपने शब्दों में बताइए इससे आप क्या कर पाएँगे, और क्या नहीं।", tests: "Concept check: Lend my phone (explored idea, not built)", start: "Home", note: "This is a concept, not a working feature. Score on finding it and explaining it: the helper sees and points, the parent types the OTP, and it can be ended any time. Never score on switching into a helper view: none exists. Then ask: would you use it, and what would worry you?" },
  { id: "T6a", who: "caregiver", target: "60 s", en: "You need Mummy's ration card for a KYC update. Get it from her using the app.", hi: "केवाईसी अपडेट के लिए आपको मम्मी का राशन कार्ड चाहिए। ऐप से उनसे मँगवाइए।", tests: "Search, nothing found, Ask Mummy", start: "Home", note: "The ration card is not in the app on purpose. The empty search shows Ask Mummy for it. Asking from Home also counts." },
  { id: "T6b", who: "older", target: "90 s", en: "Rahul has asked you for something. Send it to him, or tell him where it is.", hi: "राहुल ने आपसे कुछ माँगा है। उन्हें भेज दीजिए, या बता दीजिए कहाँ रखा है।", tests: "Answer a request for a paper-only document", start: "Home", note: "The gas book is only on paper. Take a photo now and Just tell where it is both count as success." },
  { id: "T7", who: "older", target: "120 s", en: "You are not sure how to send your Aadhaar to the bank. Ask the app to show you how, and do it.", hi: "आपको नहीं पता बैंक को आधार कैसे भेजें। ऐप से पूछिए कि कैसे करें, और कर के दिखाइए।", tests: "Show me how (guided ring and voice)", start: "Home" },
  { id: "T9", who: "all", target: "180 s", en: "Tomorrow is a hospital visit for Mummy (you). Get ready: what do you take, and where is each one? What would you do about anything missing?", hi: "कल मम्मी (आप) को अस्पताल जाना है। तैयारी कीजिए: क्या ले जाना है, और हर चीज़ कहाँ है? जो नहीं है उसका क्या करेंगे?", tests: "Get ready for: found and packed counts, missing papers", start: "Home", note: "Two papers are not in the app for her. Ticking them once in the bag, asking Mummy (helper), or adding them all count as success. Skipping them without a plan is H2." },
];

const KEY = "almari-lab-v1";
const blankResult = (): TaskResult => ({ outcome: "", ms: 0, seq: 0, notes: "", quote: "" });
const newSession = (n: number): Session => ({
  id: Math.random().toString(36).slice(2, 8), code: `P${n}`, type: "Older adult", mode: "Remote", lang: "Mixed",
  date: new Date().toISOString().slice(0, 16).replace("T", " "),
  pre: { q1: "", q2: "", q3: "" }, results: {}, post: { use: "", stop: "", trust: "" },
});

function fmt(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Lab() {
  const { back, showToast } = useStore();
  const [sessions, setSessions] = useState<Session[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [activeId, setActiveId] = useState<string | null>(sessions[0]?.id ?? null);
  const [running, setRunning] = useState<{ task: string; t0: number } | null>(null);
  const [, tick] = useState(0);
  const timer = useRef<number>();

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(sessions)); } catch { /* ignore */ } }, [sessions]);
  useEffect(() => {
    if (running) timer.current = window.setInterval(() => tick((x) => x + 1), 500);
    return () => window.clearInterval(timer.current);
  }, [running]);

  const s = sessions.find((x) => x.id === activeId) ?? null;
  const upd = (patch: Partial<Session>) => setSessions((all) => all.map((x) => (x.id === activeId ? { ...x, ...patch } : x)));
  const setRes = (task: string, patch: Partial<TaskResult>) =>
    s && upd({ results: { ...s.results, [task]: { ...(s.results[task] ?? blankResult()), ...patch } } });

  const tasks = s ? TASKS.filter((tk) => tk.who === "all" || (tk.who === "caregiver" ? s.type === "Caregiver" : s.type === "Older adult")) : [];

  function startStop(task: string) {
    if (running?.task === task) {
      const prev = s?.results[task]?.ms ?? 0;
      setRes(task, { ms: prev + (Date.now() - running.t0) });
      setRunning(null);
    } else {
      if (running) {
        const prev = s?.results[running.task]?.ms ?? 0;
        setRes(running.task, { ms: prev + (Date.now() - running.t0) });
      }
      setRunning({ task, t0: Date.now() });
    }
  }

  const summary = useMemo(() => {
    return TASKS.map((tk) => {
      const rs = sessions.map((x) => x.results[tk.id]).filter((r) => r && r.outcome && r.outcome !== "S") as TaskResult[];
      const n = rs.length;
      const indep = rs.filter((r) => r.outcome === "I").length;
      const success = rs.filter((r) => ["I", "H1", "H2"].includes(r.outcome)).length;
      const times = rs.map((r) => r.ms).filter(Boolean).sort((a, b) => a - b);
      const med = times.length ? times[Math.floor((times.length - 1) / 2)] : 0;
      const seqs = rs.map((r) => r.seq).filter(Boolean);
      const seq = seqs.length ? seqs.reduce((a, b) => a + b, 0) / seqs.length : 0;
      return { id: tk.id, tests: tk.tests, n, indep, success, med, seq };
    });
  }, [sessions]);

  function csv() {
    const head = ["code", "type", "mode", "lang", "date", "pre_where_papers", "pre_last_lost", "pre_who_knows", "task", "outcome", "time_s", "seq", "notes", "quote", "post_would_use", "post_what_stops", "post_trust", "post_if_away"];
    const rows = [head];
    for (const x of sessions)
      for (const tk of TASKS) {
        const r = x.results[tk.id];
        if (!r) continue;
        rows.push([x.code, x.type, x.mode, x.lang, x.date, x.pre.q1, x.pre.q2, x.pre.q3, tk.id, r.outcome, String(Math.round(r.ms / 1000)), String(r.seq || ""), r.notes, r.quote, x.post.use, x.post.stop, x.post.trust, x.post.away ?? ""]);
      }
    const text = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = `almari-usability-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function copySummary() {
    const lines = [
      `Almari usability test · ${sessions.length} participants (${sessions.filter((x) => x.type === "Older adult").length} older adults, ${sessions.filter((x) => x.type === "Caregiver").length} caregivers)`,
      "",
      "| Task | What it tests | n | Independent | Success (I, H1, H2) | Median time | Mean ease (1-7) |",
      "|---|---|---|---|---|---|---|",
      ...summary.filter((r) => r.n).map((r) => `| ${r.id} | ${r.tests} | ${r.n} | ${r.indep}/${r.n} | ${r.success}/${r.n} | ${fmt(r.med)} | ${r.seq ? r.seq.toFixed(1) : "-"} |`),
    ].join("\n");
    navigator.clipboard?.writeText(lines).then(() => showToast("Summary copied as a table."), () => showToast("Could not copy."));
  }

  const base = `${location.origin}${location.pathname}`;
  const links = [
    { label: "Older adult, English (fresh data)", url: `${base}?fresh=1&as=keeper&lang=en#/` },
    { label: "Older adult, Hindi (fresh data)", url: `${base}?fresh=1&as=keeper&lang=hi#/` },
    { label: "Caregiver, English (fresh data)", url: `${base}?fresh=1&as=helper&lang=en#/` },
    { label: "Caregiver, Hindi (fresh data)", url: `${base}?fresh=1&as=helper&lang=hi#/` },
  ];

  const field = "w-full rounded-xl border-2 border-hair bg-white p-2.5 text-[0.95rem] outline-none focus:border-brand";

  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button onClick={back} className="flex h-11 items-center gap-1 rounded-full px-3 font-semibold active:bg-hair"><ArrowLeft size={20} /> App</button>
          <h1 className="flex-1 text-[1.5rem] font-semibold">Almari testing kit</h1>
          <button onClick={copySummary} className="flex h-11 items-center gap-2 rounded-xl border-2 border-hair bg-white px-3 font-semibold"><Copy size={18} /> Copy results table</button>
          <button onClick={csv} className="flex h-11 items-center gap-2 rounded-xl bg-brand px-3 font-semibold text-white"><Download size={18} /> Export CSV</button>
        </div>

        <div className="mb-4 rounded-2xl border border-hair bg-white p-4 text-[0.95rem]">
          <p className="font-semibold">Send the participant one of these links on WhatsApp (each starts fresh, so earlier testers' changes don't carry over):</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {links.map((l) => (
              <li key={l.url} className="flex flex-wrap items-center gap-2">
                <span className="min-w-56">{l.label}</span>
                <button className="flex items-center gap-1 rounded-lg border border-hair px-2 py-1 text-[0.85rem]" onClick={() => navigator.clipboard?.writeText(l.url).then(() => showToast("Link copied"))}><Link2 size={14} /> Copy link</button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-mute">Script: 1) Consent: "We are testing the app, not you. You can stop any time." 2) Three short questions. 3) Tasks: read each one exactly, start the timer when they start, stop when they finish or give up. Hint ladder: H1 neutral nudge ("What would you try next?"), H2 narrowed nudge, H3 you show them. 4) After each task: "How easy was that, 1 (very hard) to 7 (very easy)?" 5) Closing questions.</p>
          <p className="mt-2 text-mute">Outcome codes: I = on their own. H1 or H2 = finished after a nudge (counts as success). H3 = you showed them. F = could not finish. S = skipped. Helpers who are not a son still use the Family helper's phone: tell them the app calls the helper Rahul.</p>
          <p className="mt-2 text-mute">One week later (optional): ask the older adult to open the app on their own and find one paper. Log it as a new participant with the same code plus W1.</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {sessions.map((x) => (
            <button key={x.id} onClick={() => setActiveId(x.id)} className={`h-11 rounded-full border-2 px-4 font-semibold ${x.id === activeId ? "border-brand bg-brand text-white" : "border-hair bg-white"}`}>
              {x.code} · {x.type === "Older adult" ? "OA" : "CG"}
            </button>
          ))}
          <button onClick={() => { const n = newSession(sessions.length + 1); setSessions((a) => [...a, n]); setActiveId(n.id); }} className="flex h-11 items-center gap-1 rounded-full border-2 border-dashed border-brand px-4 font-semibold text-brand"><Plus size={18} /> New participant</button>
        </div>

        {s && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 rounded-2xl border border-hair bg-white p-4 sm:grid-cols-5">
              <label className="text-[0.85rem] text-mute">Code<input className={field} value={s.code} onChange={(e) => upd({ code: e.target.value })} /></label>
              <label className="text-[0.85rem] text-mute">Type<select className={field} value={s.type} onChange={(e) => upd({ type: e.target.value as Session["type"] })}><option>Older adult</option><option>Caregiver</option></select></label>
              <label className="text-[0.85rem] text-mute">Mode<select className={field} value={s.mode} onChange={(e) => upd({ mode: e.target.value as Session["mode"] })}><option>Remote</option><option>In person</option></select></label>
              <label className="text-[0.85rem] text-mute">Language<select className={field} value={s.lang} onChange={(e) => upd({ lang: e.target.value as Session["lang"] })}><option>Mixed</option><option>English</option><option>Hindi</option></select></label>
              <label className="text-[0.85rem] text-mute">Date<input className={field} value={s.date} onChange={(e) => upd({ date: e.target.value })} /></label>
            </div>

            <div className="rounded-2xl border border-hair bg-white p-4">
              <p className="mb-2 font-semibold">Before tasks (short interview)</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <label className="text-[0.85rem] text-mute">Where do you keep your important papers?<textarea rows={2} className={field} value={s.pre.q1} onChange={(e) => upd({ pre: { ...s.pre, q1: e.target.value } })} /></label>
                <label className="text-[0.85rem] text-mute">Last time you couldn't find one?<textarea rows={2} className={field} value={s.pre.q2} onChange={(e) => upd({ pre: { ...s.pre, q2: e.target.value } })} /></label>
                <label className="text-[0.85rem] text-mute">Who else knows where they are?<textarea rows={2} className={field} value={s.pre.q3} onChange={(e) => upd({ pre: { ...s.pre, q3: e.target.value } })} /></label>
              </div>
            </div>

            {tasks.map((tk) => {
              const r = s.results[tk.id] ?? blankResult();
              const live = running?.task === tk.id ? Date.now() - running.t0 : 0;
              return (
                <div key={tk.id} className={`rounded-2xl border-2 bg-white p-4 ${running?.task === tk.id ? "border-saffron" : "border-hair"}`}>
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="rounded-lg bg-brand px-2 py-1 font-bold text-white">{tk.id}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[1.05rem] font-semibold">“{tk.en}”</p>
                      <p className="text-[1rem] text-mute">“{tk.hi}”</p>
                      <p className="mt-1 text-[0.85rem] text-mute">Tests: {tk.tests} · Start on: {tk.start} · Target: {tk.target}</p>
                      {tk.note && <p className="mt-1 rounded-lg bg-paper px-2 py-1 text-[0.85rem]">Moderator note: {tk.note}</p>}
                    </div>
                    <button onClick={() => startStop(tk.id)} className={`flex h-12 items-center gap-2 rounded-xl px-4 font-semibold ${running?.task === tk.id ? "bg-saffron" : "bg-brand text-white"}`}>
                      {running?.task === tk.id ? <Square size={18} /> : <Play size={18} />} {fmt(r.ms + live)}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[0.85rem] text-mute">Outcome</span>
                    {(["I", "H1", "H2", "H3", "F", "S"] as Outcome[]).map((o) => (
                      <button key={o} onClick={() => setRes(tk.id, { outcome: o })} className={`h-10 min-w-11 rounded-lg border-2 px-2 font-semibold ${r.outcome === o ? "border-brand bg-brand text-white" : "border-hair"}`}>{o}</button>
                    ))}
                    <span className="ml-2 text-[0.85rem] text-mute">Ease</span>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <button key={n} onClick={() => setRes(tk.id, { seq: n })} className={`h-10 w-10 rounded-lg border-2 font-semibold ${r.seq === n ? "border-saffron bg-saffron" : "border-hair"}`}>{n}</button>
                    ))}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <textarea rows={2} placeholder="Where they hesitated, what they tapped" className={field} value={r.notes} onChange={(e) => setRes(tk.id, { notes: e.target.value })} />
                    <textarea rows={2} placeholder="One exact quote" className={field} value={r.quote} onChange={(e) => setRes(tk.id, { quote: e.target.value })} />
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-hair bg-white p-4">
              <p className="mb-2 font-semibold">Closing questions</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-[0.85rem] text-mute">Would you use this? Why?<textarea rows={2} className={field} value={s.post.use} onChange={(e) => upd({ post: { ...s.post, use: e.target.value } })} /></label>
                <label className="text-[0.85rem] text-mute">What would stop you?<textarea rows={2} className={field} value={s.post.stop} onChange={(e) => upd({ post: { ...s.post, stop: e.target.value } })} /></label>
                <label className="text-[0.85rem] text-mute">Who would you let see it?<textarea rows={2} className={field} value={s.post.trust} onChange={(e) => upd({ post: { ...s.post, trust: e.target.value } })} /></label>
                <label className="text-[0.85rem] text-mute">{s.type === "Caregiver" ? "If you were unwell or away for 3 days, what would happen?" : "If Rahul could not help for a week, who would you ask?"}<textarea rows={2} className={field} value={s.post.away ?? ""} onChange={(e) => upd({ post: { ...s.post, away: e.target.value } })} /></label>
              </div>
            </div>
            <button onClick={() => { if (confirmDelete()) { setSessions((a) => a.filter((x) => x.id !== s.id)); setActiveId(null); } else showToast("Tap again within 3 seconds to delete"); }} className="flex h-11 w-fit items-center gap-2 rounded-xl px-3 text-danger"><Trash2 size={18} /> Delete this participant</button>
          </div>
        )}

        <h2 className="mt-8 mb-2 text-[1.2rem] font-semibold">Results so far</h2>
        <div className="overflow-x-auto rounded-2xl border border-hair bg-white">
          <table className="w-full text-left text-[0.92rem]">
            <thead className="bg-paper"><tr>{["Task", "Tests", "n", "Independent", "Success (I, H1, H2)", "Median time", "Mean ease"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {summary.map((r) => (
                <tr key={r.id} className="border-t border-hair">
                  <td className="px-3 py-2 font-semibold">{r.id}</td><td className="px-3 py-2">{r.tests}</td><td className="px-3 py-2">{r.n}</td>
                  <td className="px-3 py-2">{r.n ? `${r.indep}/${r.n}` : "-"}</td><td className="px-3 py-2">{r.n ? `${r.success}/${r.n}` : "-"}</td>
                  <td className="px-3 py-2">{r.med ? fmt(r.med) : "-"}</td><td className="px-3 py-2">{r.seq ? r.seq.toFixed(1) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.85rem] text-mute">Stored only in this browser. Export the CSV after every session as a backup.</p>
      </div>
    </div>
  );
}

function confirmDelete() {
  // A two-step delete without a browser dialog: the first click arms it for 3 seconds.
  const w = window as any;
  if (w.__almariArmed && Date.now() - w.__almariArmed < 3000) { w.__almariArmed = 0; return true; }
  w.__almariArmed = Date.now();
  return false;
}
