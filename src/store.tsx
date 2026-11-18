import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CATEGORIES, seed, type AppData, type CategoryId, type Doc, type Lang, type Member, type Reminder, type Request, type Role, type Activity } from "./data";
import { makeT, pick } from "./i18n";

const DATA_KEY = "almari-data-v3";
const SET_KEY = "almari-settings-v1";

export interface Settings {
  lang: Lang;
  scale: 0 | 1 | 2;
  role: Role;
  lock: boolean;
  onboarded: boolean;
  simple: boolean;
}

const defaultSettings: Settings = { lang: "en", scale: 0, role: "keeper", lock: true, onboarded: false, simple: true };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

/* ---------------- routing (hash based, so links can be shared) ---------------- */
export function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(qs || "");
  return { parts, params, path };
}

const uid = () => Math.random().toString(36).slice(2, 9);
const nowIso = () => new Date().toISOString();

type Ctx = ReturnType<typeof useProvideStore>;
const StoreCtx = createContext<Ctx | null>(null);

function useProvideStore() {
  const [data, setData] = useState<AppData>(() => {
    const d = load<AppData | null>(DATA_KEY, null);
    return d && d.version === 3 ? d : seed();
  });
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...defaultSettings, ...load(SET_KEY, {}) }));
  const [unlocked, setUnlocked] = useState(false);
  const [route, setRoute] = useState(parseHash());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  useEffect(() => save(DATA_KEY, data), [data]);
  useEffect(() => save(SET_KEY, settings), [settings]);
  useEffect(() => {
    document.documentElement.dataset.scale = String(settings.scale);
    document.documentElement.lang = settings.lang === "hi" ? "hi" : "en";
  }, [settings.scale, settings.lang]);

  useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const go = useCallback((path: string) => {
    window.location.hash = "/" + path.replace(/^\//, "");
  }, []);
  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = "/";
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const setSettings = useCallback((p: Partial<Settings>) => setSettingsState((s) => ({ ...s, ...p })), []);

  const lang = settings.lang;
  const t = useMemo(() => makeT(lang), [lang]);
  const viewerId = settings.role === "keeper" ? "sunita" : "rahul";

  /* ---------------- lookups ---------------- */
  const person = useCallback((id: string) => data.people.find((p) => p.id === id), [data.people]);
  const personName = useCallback(
    (id: string) => {
      const p = person(id);
      if (!p) return "";
      if (settings.role === "helper") {
        if (id === "sunita") return lang === "hi" ? "मम्मी" : "Mummy";
        if (id === "ramesh") return lang === "hi" ? "पापा" : "Papa";
        if (id === "rahul") return lang === "hi" ? "आप" : "You";
      } else if (id === "sunita") return lang === "hi" ? "आप" : "You";
      return lang === "hi" ? p.nameHi : p.name;
    },
    [person, lang, settings.role],
  );
  const docOwnerLabel = useCallback(
    (id: string) => {
      if (settings.role === "helper") return id === "sunita" ? (lang === "hi" ? "मम्मी का" : "Mummy's") : lang === "hi" ? "पापा का" : "Papa's";
      return id === "sunita" ? (lang === "hi" ? "मेरा" : "Mine") : lang === "hi" ? "रमेश जी का" : "Ramesh's";
    },
    [settings.role, lang],
  );

  const file = useCallback((id: string | null) => data.files.find((f) => f.id === id), [data.files]);
  const place = useCallback((id: string) => data.places.find((p) => p.id === id), [data.places]);

  const locationParts = useCallback(
    (fileId: string | null) => {
      const f = file(fileId);
      if (!f) return null;
      const pl = place(f.placeId);
      const spot = pl?.spots.find((s) => s.id === f.spotId);
      return {
        file: f,
        place: pl,
        placeName: pl ? (lang === "hi" ? pl.nameHi : pl.name) : "",
        spotName: spot ? (lang === "hi" ? spot.hi : spot.en) : "",
        fileName:
          lang === "hi"
            ? `${f.colorNameHi} फ़ाइल (${f.labelHi})`
            : `${f.colorName} file (${f.label})`,
      };
    },
    [file, place, lang],
  );
  const locationLine = useCallback(
    (fileId: string | null) => {
      const l = locationParts(fileId);
      if (!l) return lang === "hi" ? "जगह अभी नहीं लिखी" : "Place not noted yet";
      return `${l.placeName} · ${l.spotName} · ${l.fileName}`;
    },
    [locationParts, lang],
  );

  const docTitle = useCallback((d: Doc) => (lang === "hi" ? d.titleHi || d.title : d.title), [lang]);
  const catName = useCallback((id: CategoryId) => {
    const c = CATEGORIES.find((c) => c.id === id);
    return c ? pick(c, lang) : id;
  }, [lang]);

  /* ---------------- actions ---------------- */
  const log = useCallback((a: Omit<Activity, "id" | "at">) => {
    setData((d) => ({ ...d, activity: [{ ...a, id: uid(), at: nowIso() }, ...d.activity].slice(0, 80) }));
  }, []);

  const addDoc = useCallback((doc: Omit<Doc, "id" | "addedOn">) => {
    const id = "d" + uid();
    setData((d) => ({
      ...d,
      docs: [{ ...doc, id, addedOn: new Date().toISOString().slice(0, 10) }, ...d.docs],
      activity: [{ id: uid(), who: doc.addedBy, action: "added" as const, docId: id, at: nowIso() }, ...d.activity],
    }));
    return id;
  }, []);

  const updateDoc = useCallback((id: string, patch: Partial<Doc>) => {
    setData((d) => ({ ...d, docs: d.docs.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  }, []);

  const addFile = useCallback((f: Omit<AppData["files"][number], "id">) => {
    const id = "f" + uid();
    setData((d) => ({ ...d, files: [...d.files, { ...f, id }] }));
    return id;
  }, []);

  const addReminder = useCallback((r: Omit<Reminder, "id">) => {
    setData((d) => ({ ...d, reminders: [...d.reminders, { ...r, id: "r" + uid() }] }));
  }, []);
  const toggleReminder = useCallback((id: string) => {
    setData((d) => ({ ...d, reminders: d.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) }));
  }, []);

  const sendRequest = useCallback((r: Omit<Request, "id" | "at" | "status">) => {
    setData((d) => ({
      ...d,
      requests: [{ ...r, id: "q" + uid(), at: nowIso(), status: "pending" as const }, ...d.requests],
      activity: [{ id: uid(), who: r.from, action: "asked" as const, docId: r.docId, detail: r.purpose, at: nowIso() }, ...d.activity],
    }));
  }, []);
  const answerRequest = useCallback((id: string, status: "sent" | "declined", docId?: string) => {
    setData((d) => {
      const req = d.requests.find((q) => q.id === id);
      return {
        ...d,
        requests: d.requests.map((q) => (q.id === id ? { ...q, status, sentAt: nowIso(), docId: docId ?? q.docId } : q)),
        activity:
          status === "sent" && req
            ? [{ id: uid(), who: req.to, action: "sent" as const, docId: docId ?? req.docId, detail: req.purpose, at: nowIso() }, ...d.activity]
            : d.activity,
      };
    });
  }, []);

  const setMember = useCallback((m: Member) => {
    setData((d) => ({
      ...d,
      members: d.members.some((x) => x.personId === m.personId) ? d.members.map((x) => (x.personId === m.personId ? m : x)) : [...d.members, m],
    }));
  }, []);
  const removeMember = useCallback((personId: string) => {
    setData((d) => ({ ...d, members: d.members.filter((x) => x.personId !== personId) }));
  }, []);

  /* ---------- Lend my phone: one app, one helper, 15 minutes ---------- */
  const requestLend = useCallback((app: "train" | "bank" | "almari") => {
    setData((d) => ({ ...d, lend: { id: uid(), app, helper: "rahul", status: "waiting", requestedAt: nowIso() } }));
  }, []);
  const startLend = useCallback(() => {
    setData((d) => (d.lend ? { ...d, lend: { ...d.lend, status: "active", startedAt: nowIso() } } : d));
  }, []);
  const endLend = useCallback((by: "owner" | "time" | "done") => {
    setData((d) =>
      d.lend
        ? {
            ...d,
            lend: { ...d.lend, status: "ended", endedAt: nowIso(), endedBy: by },
            activity: [{ id: uid(), who: d.lend.helper, action: "helped" as const, detail: d.lend.app, at: nowIso() }, ...d.activity],
          }
        : d,
    );
  }, []);
  const clearLend = useCallback(() => setData((d) => ({ ...d, lend: null })), []);

  /* ---------- Show me how: guided rings on the real buttons ---------- */
  const [guide, setGuide] = useState<{ id: string; step: number } | null>(null);
  const startGuide = useCallback((id: string) => setGuide({ id, step: 0 }), []);
  const stopGuide = useCallback(() => setGuide(null), []);
  const nextGuide = useCallback(() => setGuide((g) => (g ? { ...g, step: g.step + 1 } : g)), []);

  const setDiary = useCallback((en: string) => setData((d) => ({ ...d, diary: { en, hi: en } })), []);

  const reset = useCallback(() => {
    setData(seed());
  }, []);

  return {
    data, settings, setSettings, unlocked, setUnlocked, route, go, back, toast, showToast,
    t, lang, viewerId, person, personName, docOwnerLabel, file, place, locationParts, locationLine, docTitle, catName,
    log, addDoc, updateDoc, addFile, addReminder, toggleReminder, sendRequest, answerRequest, setMember, removeMember, setDiary, reset,
    requestLend, startLend, endLend, clearLend, guide, startGuide, stopGuide, nextGuide,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useProvideStore();
  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
