import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Home as HomeIcon, Search, Plus, Users, Menu, HandHelping, Bell, Sparkles } from "lucide-react";
import { StoreProvider, useStore } from "./store";
import { Toast } from "./components/ui";
import { GuideOverlay } from "./components/Guide";
import { HelperHome, KeeperHome } from "./screens/Home";
import { Counter, DocDetail, Find, Share } from "./screens/Docs";
import { Add } from "./screens/Add";
import { Ask, Category, Diary, Family, More, PrintSheet, Ready, Reminders, Unwell, Where } from "./screens/Other";
import { Help, PhoneMessages } from "./screens/Help";
import { Lend } from "./screens/Lend";
import { Lab } from "./screens/Lab";
import { Lock, Onboard } from "./screens/Gate";
import type { CategoryId } from "./data";

function Nav() {
  const { route, go, t, settings, lang } = useStore();
  const top = route.parts[0] ?? "";
  const keeper = settings.role === "keeper";
  const items = keeper
    ? [
        { to: "", icon: HomeIcon, label: t("home") },
        { to: "find", icon: Search, label: t("find") },
        { to: "family", icon: Users, label: t("family") },
        { to: "more", icon: Menu, label: t("more") },
      ]
    : [
        { to: "", icon: HomeIcon, label: t("home") },
        { to: "find", icon: Search, label: t("find") },
        { to: "reminders", icon: Bell, label: lang === "hi" ? "याद" : "Reminders" },
        { to: "more", icon: Menu, label: t("more") },
      ];
  return (
    <nav className="no-print pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end gap-3 px-4 pb-[max(env(safe-area-inset-bottom),14px)]">
      <div className="pointer-events-auto flex flex-1 items-center rounded-full bg-[#EFEFF2] p-1.5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
        {items.map((i) => {
          const on = top === i.to;
          return (
            <motion.button key={i.to} whileTap={{ scale: 0.9 }} onClick={() => go(i.to)} aria-current={on ? "page" : undefined}
              className="relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[0.82rem] font-semibold">
              {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <i.icon size={22} strokeWidth={on ? 2.5 : 2} className={`relative ${on ? "text-brand" : "text-ink"}`} />
              <span className="relative text-ink">{i.label}</span>
            </motion.button>
          );
        })}
      </div>
      <motion.button whileTap={{ scale: 0.88 }} onClick={() => go("add")} aria-label={t("add")}
        className="pointer-events-auto flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_14px_28px_-12px_rgba(40,80,20,0.6)]">
        <Plus size={30} />
      </motion.button>
    </nav>
  );
}

function routeFor(parts: string[], params: URLSearchParams, role: string) {
  const [a, b] = parts;
  switch (a) {
    case undefined:
    case "": return role === "keeper" ? <KeeperHome /> : <HelperHome />;
    case "find": return <Find key={params.get("q") ?? ""} />;
    case "doc": return <DocDetail key={b} id={b} />;
    case "counter": return <Counter id={b} />;
    case "share": return <Share id={b} />;
    case "add": return <Add key={params.toString()} />;
    case "cat": return <Category id={b as CategoryId} />;
    case "ready": return <Ready id={b} />;
    case "family": return <Family />;
    case "ask": return <Ask />;
    case "reminders": return <Reminders />;
    case "unwell": return <Unwell />;
    case "diary": return <Diary />;
    case "where": return <Where />;
    case "more": return <More />;
    case "help": return <Help />;
    case "phone": return <PhoneMessages />;
    case "lend": return <Lend />;
    default: return role === "keeper" ? <KeeperHome /> : <HelperHome />;
  }
}

function PhoneApp() {
  const { route, settings, unlocked, go, guide, data } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); setScrolled(false); }, [route.path]);
  const top = route.parts[0] ?? "";
  const hideNav = ["add", "counter", "share", "phone", "lend"].includes(top);
  const showHelpFab = false && settings.role === "keeper" && !["", "help", "add", "counter", "share", "phone", "lend"].includes(top) && !guide && !settings.simple;
  const lendActive = settings.role === "keeper" && data.lend?.status === "active" && top !== "lend";
  return (
    <div id="phone-root" className="relative h-full w-full overflow-hidden bg-paper">
      <div ref={scroller} onScroll={(e) => setScrolled((e.currentTarget as HTMLDivElement).scrollTop > 8)} className="no-scrollbar h-full overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={route.path} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22, ease: "easeOut" }} className="min-h-full">
            {routeFor(route.parts, route.params, settings.role)}
          </motion.div>
        </AnimatePresence>
      </div>
      {lendActive && (
        <motion.button initial={{ y: -40 }} animate={{ y: 0 }} onClick={() => go("lend")} className="absolute inset-x-0 top-0 z-40 bg-danger py-2 text-center text-[0.95rem] font-semibold text-white">
          {settings.lang === "hi" ? "राहुल मदद कर रहे हैं · बंद करने के लिए छुएँ" : "Rahul is helping · tap to see or end"}
        </motion.button>
      )}
      {showHelpFab && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }} onClick={() => go("help")}
          className="absolute right-4 bottom-28 z-30 flex h-12 items-center gap-2 rounded-full bg-[#F7D27A] px-4 font-semibold text-ink shadow-[0_12px_28px_-10px_rgba(0,0,0,0.35)]" aria-label="Help">
          <motion.span animate={{ rotate: [0, 18, -12, 0] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3 }}><Sparkles size={22} /></motion.span>
          {settings.lang === "hi" ? "मदद" : "Help"}
        </motion.button>
      )}
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-[75] bg-white/85 backdrop-blur-xl transition-opacity duration-200 ${scrolled ? "opacity-100" : "opacity-0"}`} style={{ height: "var(--top)" }} aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] hidden h-[54px] items-center justify-between px-8 pt-1 text-[15px] font-semibold sm:flex" aria-hidden>
        <span>9:41</span>
        <span className="absolute top-[11px] left-1/2 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
        <span className="flex items-center gap-1.5">
          <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#111"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#111"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#111"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.2 5.6 8.6a3.4 3.4 0 0 1 4.8 0L8 11.2Zm-4.3-4.6a6.1 6.1 0 0 1 8.6 0l1.4-1.5a8.2 8.2 0 0 0-11.4 0l1.4 1.5ZM.8 3.6a10.2 10.2 0 0 1 14.4 0L16.6 2A12.3 12.3 0 0 0-.6 2L.8 3.6Z" fill="#111"/></svg>
          <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="#111" opacity=".4" fill="none"/><rect x="2" y="2" width="17" height="8" rx="2" fill="#111"/><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill="#111" opacity=".4"/></svg>
        </span>
      </div>
      {!hideNav && <Nav />}
      <GuideOverlay rootId="phone-root" />
      <Toast />
      {!settings.onboarded && <Onboard />}
      {settings.onboarded && settings.lock && !unlocked && <Lock />}
    </div>
  );
}

function Shell() {
  const { route, setSettings, settings, go, reset, showToast } = useStore();
  const page = route.parts[0];

  /* Test links: ?fresh=1&as=keeper|helper&lang=en|hi&simple=1 start a participant on clean sample data. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.toString()) return;
    if (q.get("fresh") === "1") reset();
    const as = q.get("as");
    const lang = q.get("lang");
    setSettings({
      ...(as === "keeper" || as === "helper" ? { role: as, onboarded: true } : {}),
      ...(lang === "en" || lang === "hi" ? { lang } : {}),
      ...(q.has("simple") ? { simple: q.get("simple") === "1" } : q.get("fresh") === "1" ? { simple: as !== "helper" } : {}),
    });
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }, []); // eslint-disable-line

  if (page === "lab") return <div className="relative min-h-full"><Lab /><Toast fixed /></div>;
  if (page === "print") return <PrintSheet />;

  const pill = (on: boolean) => `h-11 rounded-full border-2 px-4 font-semibold ${on ? "border-brand bg-brand text-white" : "border-hair bg-white"}`;
  return (
    <div className="flex h-full items-center justify-center gap-12 bg-[radial-gradient(circle_at_20%_20%,#F6E7C8_0,transparent_45%),radial-gradient(circle_at_85%_80%,#D7E9E2_0,transparent_40%)] lg:px-8">
      <aside className="no-print hidden max-w-sm flex-col gap-4 lg:flex">
        <span className="font-serif text-[3.6rem] leading-none text-brand">Almari</span>
        <p className="text-[1.25rem] leading-snug">Know what important papers your family has, and exactly where each original is kept: on the phone or in the almirah.</p>
        <p className="text-[1rem] text-mute">Best on a phone. Open this page on your phone, or try it here.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setSettings({ role: "keeper", onboarded: true }); go(""); }} className={pill(settings.role === "keeper")}>Sunita's phone</button>
          <button onClick={() => { setSettings({ role: "helper", onboarded: true }); go(""); }} className={pill(settings.role === "helper")}>Rahul's phone</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => go("lab")} className="h-11 rounded-full border-2 border-hair bg-white px-4 font-semibold">Testing kit</button>
          <button onClick={() => { reset(); showToast("Sample data reset."); go(""); }} className="h-11 rounded-full border-2 border-hair bg-white px-4 font-semibold">Reset sample data</button>
        </div>
        <p className="text-[0.9rem] text-mute">Major Project, Group 4 · MIT Institute of Design · Sample family; every name and number is made up.</p>
      </aside>
      <div className="h-full w-full sm:h-[min(880px,calc(100vh-48px))] sm:w-[400px] sm:overflow-hidden sm:rounded-[44px] sm:border-[10px] sm:border-ink sm:shadow-2xl">
        <PhoneApp />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
