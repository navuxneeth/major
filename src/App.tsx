import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Home as HomeIcon, Search, Plus, Users, Menu, HandHelping, Bell } from "lucide-react";
import { StoreProvider, useStore } from "./store";
import { Toast } from "./components/ui";
import { HelperHome, KeeperHome } from "./screens/Home";
import { Counter, DocDetail, Find, Share } from "./screens/Docs";
import { Add } from "./screens/Add";
import { Ask, Category, Diary, Family, More, PrintSheet, Ready, Reminders, Unwell } from "./screens/Other";
import { Lab } from "./screens/Lab";
import { Lock, Onboard } from "./screens/Gate";
import type { CategoryId } from "./data";

function Nav() {
  const { route, go, t, settings } = useStore();
  const top = route.parts[0] ?? "";
  const keeper = settings.role === "keeper";
  const items = keeper
    ? [
        { to: "", icon: HomeIcon, label: t("home") },
        { to: "find", icon: Search, label: t("find") },
        { to: "add", icon: Plus, label: t("add"), big: true },
        { to: "family", icon: Users, label: t("family") },
        { to: "more", icon: Menu, label: t("more") },
      ]
    : [
        { to: "", icon: HomeIcon, label: t("home") },
        { to: "find", icon: Search, label: t("find") },
        { to: "ask", icon: HandHelping, label: t("ask"), big: true },
        { to: "reminders", icon: Bell, label: t("reminders") },
        { to: "more", icon: Menu, label: t("more") },
      ];
  return (
    <nav className="no-print absolute inset-x-0 bottom-0 z-30 flex items-end justify-around border-t border-hair bg-white/95 px-1 pt-1 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur">
      {items.map((i) => {
        const on = top === i.to;
        return (
          <motion.button
            key={i.to}
            whileTap={{ scale: 0.92 }}
            onClick={() => go(i.to)}
            className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.82rem] font-semibold ${on ? "text-brand" : "text-mute"}`}
            aria-current={on ? "page" : undefined}
          >
            {i.big ? (
              <span className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg ring-4 ring-white">
                <i.icon size={30} />
              </span>
            ) : (
              <i.icon size={26} strokeWidth={on ? 2.6 : 2} />
            )}
            <span>{i.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}

function Routes() {
  const { route, settings } = useStore();
  const [a, b] = route.parts;
  switch (a) {
    case undefined:
    case "":
      return settings.role === "keeper" ? <KeeperHome /> : <HelperHome />;
    case "find": return <Find key={route.params.get("q") ?? ""} />;
    case "doc": return <DocDetail key={b} id={b} />;
    case "counter": return <Counter id={b} />;
    case "share": return <Share id={b} />;
    case "add": return <Add key={route.params.toString()} />;
    case "cat": return <Category id={b as CategoryId} />;
    case "ready": return <Ready id={b} />;
    case "family": return <Family />;
    case "ask": return <Ask />;
    case "reminders": return <Reminders />;
    case "unwell": return <Unwell />;
    case "diary": return <Diary />;
    case "more": return <More />;
    default: return settings.role === "keeper" ? <KeeperHome /> : <HelperHome />;
  }
}

function PhoneApp() {
  const { route, settings, unlocked } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [route.path]);
  const hideNav = ["add", "counter", "share"].includes(route.parts[0] ?? "");
  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      <div ref={scroller} className="no-scrollbar h-full overflow-y-auto">
        <Routes />
      </div>
      {!hideNav && <Nav />}
      <Toast />
      {!settings.onboarded && <Onboard />}
      {settings.onboarded && settings.lock && !unlocked && <Lock />}
    </div>
  );
}

function Shell() {
  const { route, setSettings, settings, go, reset, showToast } = useStore();
  const page = route.parts[0];

  /* Test links: ?fresh=1&as=keeper|helper&lang=en|hi start a participant on clean sample data. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.toString()) return;
    if (q.get("fresh") === "1") reset();
    const as = q.get("as");
    const lang = q.get("lang");
    setSettings({
      ...(as === "keeper" || as === "helper" ? { role: as, onboarded: true } : {}),
      ...(lang === "en" || lang === "hi" ? { lang } : {}),
    });
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }, []); // eslint-disable-line

  if (page === "lab") return <div className="relative min-h-full"><Lab /><Toast fixed /></div>;
  if (page === "print") return <PrintSheet />;

  return (
    <div className="flex h-full items-center justify-center gap-12 lg:px-8">
      <aside className="no-print hidden max-w-sm flex-col gap-4 lg:flex">
        <span className="font-serif text-[3.4rem] leading-none text-brand">Almari</span>
        <p className="text-[1.25rem] leading-snug">Know what important papers your family has, and exactly where each original is kept: on the phone or in the almirah.</p>
        <p className="text-[1rem] text-mute">Best on a phone. Open this page on your phone, or try it here.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setSettings({ role: "keeper", onboarded: true }); go(""); }} className={`h-11 rounded-full border-2 px-4 font-semibold ${settings.role === "keeper" ? "border-brand bg-brand text-white" : "border-hair bg-white"}`}>Sunita's phone</button>
          <button onClick={() => { setSettings({ role: "helper", onboarded: true }); go(""); }} className={`h-11 rounded-full border-2 px-4 font-semibold ${settings.role === "helper" ? "border-brand bg-brand text-white" : "border-hair bg-white"}`}>Rahul's phone</button>
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
