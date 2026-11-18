import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { useStore } from "../store";
import { GUIDES, matchGuide } from "../components/Guide";
import { HelpArt, LendArt } from "../illustrations";
import { Card, EmptyNote, Icon, MicButton, Screen, SectionTitle } from "../components/ui";

export function Help() {
  const { lang, go, startGuide } = useStore();
  const [heard, setHeard] = useState("");
  const [miss, setMiss] = useState(false);
  const hi = lang === "hi";

  function run(id: string) {
    const g = GUIDES.find((x) => x.id === id)!;
    go(g.start);
    window.setTimeout(() => startGuide(id), 350);
  }

  return (
    <Screen title={hi ? "मदद" : "Help"} sub={hi ? "हम दिखाएँगे कहाँ दबाना है। दबाएँगे आप ख़ुद।" : "We show you where to tap. You do the tapping."}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center gap-3 overflow-hidden rounded-3xl bg-saffron-soft p-4">
        <HelpArt className="h-28 w-28 shrink-0" />
        <div>
          <p className="text-[1.25rem] leading-tight font-semibold">{hi ? "पूछिए, “यह कैसे करूँ?”" : "Ask, “How do I…?”"}</p>
          <p className="mt-1 text-[0.98rem] text-mute">{hi ? "एक रोशनी वाला घेरा सही बटन पर आएगा, और आवाज़ बताएगी।" : "A glowing ring lands on the right button, and a voice tells you what to do."}</p>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-brand bg-white p-3">
        <MicButton onText={(text, final) => {
          setHeard(text);
          if (!final) return;
          const g = matchGuide(text);
          if (g) { setMiss(false); run(g.id); } else setMiss(true);
        }} />
        <p className="flex-1 text-[1.05rem] text-mute">{heard ? `“${heard}”` : hi ? "बोलिए: “ओटीपी कहाँ मिलेगा?”" : "Say: “Where is my OTP?”"}</p>
      </div>
      {miss && <div className="mt-2"><EmptyNote>{hi ? "यह अभी नहीं सीखा। नीचे से चुनिए, या राहुल से मदद लीजिए।" : "I haven't learnt that one yet. Pick one below, or get Rahul's help."}</EmptyNote></div>}

      <SectionTitle>{hi ? "इस ऐप में" : "In this app"}</SectionTitle>
      <div className="flex flex-col gap-2">
        {GUIDES.filter((g) => !g.outside).map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
            <Card onClick={() => run(g.id)} className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon name={g.icon} size={24} /></span>
              <span className="flex-1 text-[1.05rem] font-semibold">{hi ? g.hi : g.en}</span>
              <ChevronRight size={22} className="text-mute" />
            </Card>
          </motion.div>
        ))}
      </div>

      <SectionTitle>{hi ? "फ़ोन पर" : "On your phone"}</SectionTitle>
      <div className="flex flex-col gap-2">
        {GUIDES.filter((g) => g.outside).map((g) => (
          <Card key={g.id} onClick={() => run(g.id)} className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky"><Icon name={g.icon} size={24} /></span>
            <span className="flex-1 text-[1.05rem] font-semibold">{hi ? g.hi : g.en}</span>
            <ChevronRight size={22} className="text-mute" />
          </Card>
        ))}
      </div>

      <SectionTitle>{hi ? "फिर भी अटक गए?" : "Still stuck?"}</SectionTitle>
      <Card onClick={() => go("lend")} className="flex items-center gap-3" tone="bg-brand-soft">
        <LendArt className="h-16 w-24 shrink-0" />
        <span className="flex-1">
          <span className="block text-[1.1rem] font-semibold">{hi ? "फ़ोन उधार दें" : "Lend my phone"}</span>
          <span className="block text-[0.95rem] text-mute">{hi ? "राहुल 15 मिनट के लिए एक ऐप चला सकेंगे" : "Rahul can use one app for 15 minutes"}</span>
        </span>
        <ChevronRight size={22} className="text-mute" />
      </Card>
    </Screen>
  );
}

/* A stand-in for the phone's own Messages app, used by the "Where is my OTP?" guide. */
export function PhoneMessages() {
  const { lang, back } = useStore();
  const [open, setOpen] = useState(false);
  const hi = lang === "hi";
  const msgs = [
    { id: "bank", from: "BK-MYBANK", text: "482913 is your OTP for ₹1,240 for a train booking. Valid 5 min. Do NOT share it with anyone. Bank never asks for OTP.", time: "now", unread: true },
    { id: "rahul", from: "Rahul", text: "Mummy, did the gas KYC work?", time: "10:12 am" },
    { id: "gas", from: "GAS-AGENCY", text: "Your refill is booked. Delivery in 2 days.", time: "Yesterday" },
    { id: "promo", from: "VM-OFFERS", text: "You have won a FREE gift! Click link to claim…", time: "Yesterday", warn: true },
  ];
  return (
    <div className="min-h-full bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-hair bg-white px-3 py-3">
        <button onClick={back} className="h-11 rounded-full px-3 font-semibold text-brand">{hi ? "← पीछे" : "← Back"}</button>
        <h1 className="text-[1.3rem] font-semibold">{hi ? "मैसेज" : "Messages"}</h1>
        <span className="ml-auto rounded-full bg-paper px-2 py-1 text-[0.75rem] text-mute">{hi ? "फ़ोन का मैसेज ऐप (नमूना)" : "Phone's Messages app (sample)"}</span>
      </div>
      {!open ? (
        <div className="divide-y divide-hair">
          {msgs.map((m) => (
            <button key={m.id} data-guide={m.id === "bank" ? "msg-bank" : undefined} onClick={() => m.id === "bank" && setOpen(true)}
              className="flex w-full items-start gap-3 px-4 py-4 text-left active:bg-paper">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-white ${m.warn ? "bg-danger" : m.id === "rahul" ? "bg-brand" : "bg-[#5B7FB5]"}`}>{m.from[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-2"><b className="text-[1.05rem]">{m.from}</b><span className="text-[0.85rem] text-mute">{m.time}</span></span>
                <span className={`line-clamp-2 text-[0.98rem] ${m.unread ? "font-semibold" : "text-mute"}`}>{m.text}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <p className="mb-2 font-bold">BK-MYBANK</p>
          <div className="rounded-3xl rounded-tl-md bg-paper p-4 text-[1.1rem] leading-relaxed">
            <span data-guide="otp-digits" className="rounded-lg bg-saffron px-1.5 text-[1.5rem] font-bold tracking-widest">482913</span> is your OTP for ₹1,240. Valid 5 min. Do NOT share it with anyone. Bank never asks for OTP.
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-danger-soft p-4">
            <ShieldAlert size={26} className="shrink-0 text-danger" />
            <p className="text-[1rem]">{hi ? "कोई फ़ोन पर ओटीपी माँगे, चाहे वो बैंक बोले, तो मत बताइए। राहुल को भी नहीं।" : "If anyone asks for this on a call, even if they say they are the bank, don't tell them. Not even Rahul."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
