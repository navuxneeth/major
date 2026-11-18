import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useStore } from "../store";
import { PlaceView } from "../art";
import { Button, Icon } from "./ui";

const SWATCHES = [
  { c: "#3E8E5A", en: "Green", hi: "हरी" },
  { c: "#3F6FB0", en: "Blue", hi: "नीली" },
  { c: "#B8473B", en: "Red", hi: "लाल" },
  { c: "#D9822B", en: "Orange", hi: "नारंगी" },
  { c: "#D8B23A", en: "Yellow", hi: "पीली" },
  { c: "#6B5B95", en: "Purple", hi: "बैंगनी" },
  { c: "#C2577E", en: "Pink", hi: "गुलाबी" },
  { c: "#7D7D7D", en: "Grey", hi: "स्लेटी" },
];
const LABELS = [
  { en: "Bank", hi: "बैंक" },
  { en: "Medical", hi: "मेडिकल" },
  { en: "Property", hi: "प्रॉपर्टी" },
  { en: "ID cards", hi: "पहचान पत्र" },
  { en: "Kitchen business", hi: "किचन बिज़नेस" },
  { en: "Vehicle", hi: "गाड़ी" },
  { en: "Pension", hi: "पेंशन" },
];

const PLACE_ICON: Record<string, string> = { almirah: "Archive", drawer: "Columns3", cupboard: "DoorClosed", person: "UserRound" };

export function LocationPicker({ value, onChange }: { value: string | null; onChange: (fileId: string | null) => void }) {
  const { data, lang, t, file, person, addFile, locationLine } = useStore();
  const current = file(value);
  const [placeId, setPlaceId] = useState(current?.placeId ?? "almirah");
  const [spotId, setSpotId] = useState<string | null>(current?.spotId ?? null);
  const [making, setMaking] = useState(false);
  const [sw, setSw] = useState(SWATCHES[0]);
  const [label, setLabel] = useState(LABELS[0]);

  const place = data.places.find((p) => p.id === placeId)!;
  useEffect(() => {
    if (place.spots.length === 1) setSpotId(place.spots[0].id);
  }, [placeId]); // eslint-disable-line

  const filesHere = data.files.filter((f) => f.placeId === placeId && f.spotId === spotId);

  return (
    <div>
      <p className="mb-2 text-[1rem] font-semibold">{t("wherePlace")}</p>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {data.places.map((p) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setPlaceId(p.id); setSpotId(null); setMaking(false); }}
            className={`flex min-h-20 w-36 shrink-0 flex-col justify-between rounded-2xl border-2 p-3 text-left ${placeId === p.id ? "border-brand bg-brand-soft" : "border-hair bg-white"}`}
          >
            <Icon name={PLACE_ICON[p.kind]} size={24} />
            <span className="text-[0.98rem] leading-tight font-semibold">{lang === "hi" ? p.nameHi : p.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-hair bg-white p-2">
        <PlaceView
          place={place}
          files={data.files}
          highlight={value && file(value)?.placeId === placeId ? value : null}
          person={place.personId ? person(place.personId) : undefined}
          onPickSpot={(s) => { setSpotId(s); setMaking(false); }}
          onPickFile={(fid) => { const f = file(fid); if (f) { setSpotId(f.spotId); onChange(fid); } }}
        />
        <p className="px-2 pb-1 text-center text-[0.9rem] text-mute">{lang === "hi" ? "खाने पर छूकर चुनें" : "Tap a shelf or drawer to choose it"}</p>
      </div>

      <p className="mt-4 mb-2 text-[1rem] font-semibold">{t("whereSpot")}</p>
      <div className="flex flex-wrap gap-2">
        {place.spots.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSpotId(s.id); setMaking(false); }}
            className={`min-h-12 rounded-full border-2 px-4 text-[1rem] font-medium ${spotId === s.id ? "border-brand bg-brand text-white" : "border-hair bg-white"}`}
          >
            {lang === "hi" ? s.hi : s.en}
          </button>
        ))}
      </div>

      {spotId && (
        <>
          <p className="mt-4 mb-2 text-[1rem] font-semibold">{t("whereFile")}</p>
          <div className="flex flex-col gap-2">
            {filesHere.map((f) => (
              <motion.button
                key={f.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(f.id)}
                className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-3 text-left ${value === f.id ? "border-brand bg-brand-soft" : "border-hair bg-white"}`}
              >
                <span className="h-9 w-6 rounded" style={{ background: f.color }} />
                <span className="flex-1 text-[1.05rem] font-medium">{lang === "hi" ? `${f.colorNameHi} फ़ाइल (${f.labelHi})` : `${f.colorName} file (${f.label})`}</span>
                {value === f.id && <Check size={24} className="text-brand" />}
              </motion.button>
            ))}
            {!making ? (
              <button onClick={() => setMaking(true)} className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-dashed border-hair px-3 text-left text-[1.05rem] font-medium text-brand">
                <Plus size={24} /> {t("newFile")}
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-brand bg-white p-3">
                <p className="mb-2 font-semibold">{lang === "hi" ? "फ़ाइल का रंग" : "File colour"}</p>
                <div className="flex flex-wrap gap-2">
                  {SWATCHES.map((s) => (
                    <button key={s.c} onClick={() => setSw(s)} aria-label={lang === "hi" ? s.hi : s.en}
                      className={`h-11 w-11 rounded-full border-4 ${sw.c === s.c ? "border-ink" : "border-white"}`} style={{ background: s.c }} />
                  ))}
                </div>
                <p className="mt-3 mb-2 font-semibold">{lang === "hi" ? "फ़ाइल किस चीज़ की है?" : "What is in it?"}</p>
                <div className="flex flex-wrap gap-2">
                  {LABELS.map((l) => (
                    <button key={l.en} onClick={() => setLabel(l)} className={`min-h-11 rounded-full border-2 px-3 ${label.en === l.en ? "border-brand bg-brand text-white" : "border-hair"}`}>
                      {lang === "hi" ? l.hi : l.en}
                    </button>
                  ))}
                </div>
                <Button className="mt-3 w-full" icon="Check" onClick={() => {
                  const id = addFile({ placeId, spotId, color: sw.c, colorName: sw.en, colorNameHi: sw.hi, label: label.en, labelHi: label.hi });
                  onChange(id);
                  setMaking(false);
                }}>
                  {lang === "hi" ? `${sw.hi} फ़ाइल बनाएँ` : `Make ${sw.en.toLowerCase()} file`}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {value && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-soft p-3 text-[1.02rem]">
          <Check size={22} className="mt-0.5 shrink-0 text-brand" />
          <span><b>{t("originalKept")}:</b> {locationLine(value)}</span>
        </div>
      )}
    </div>
  );
}
