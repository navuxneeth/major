import { motion } from "motion/react";
import { ChevronRight, FileQuestion } from "lucide-react";
import type { Doc } from "../data";
import { DocArt } from "../art";
import { useStore } from "../store";

export function LocationDot({ fileId }: { fileId: string | null }) {
  const { file } = useStore();
  const f = file(fileId);
  return <span className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-sm border border-black/20" style={{ background: f?.color ?? "#CCC" }} />;
}

export function DocRow({ doc, onClick, showOwner = true }: { doc: Doc; onClick?: () => void; showOwner?: boolean }) {
  const { go, docTitle, docOwnerLabel, locationParts, person, lang } = useStore();
  const loc = locationParts(doc.fileId);
  const owner = person(doc.personId);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick ?? (() => go(`doc/${doc.id}`))}
      className="flex w-full items-center gap-3 rounded-[22px] bg-card p-3 text-left active:bg-paper"
    >
      <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-paper">
        {doc.paperOnly ? (
          <FileQuestion size={30} className="text-mute" aria-hidden />
        ) : (
          <DocArt doc={doc} ownerName={owner ? owner.name + " Sharma" : ""} className="h-full w-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-[1.08rem] leading-snug font-semibold">{docTitle(doc)}</span>
          {showOwner && <span className="text-[0.9rem] text-mute">{docOwnerLabel(doc.personId)}</span>}
        </div>
        <div className="mt-0.5 flex items-start gap-2 text-[0.95rem] leading-snug">
          <LocationDot fileId={doc.fileId} />
          {loc ? (
            <span>
              <span className="font-medium text-ink">{loc.fileName}</span>
              <span className="block text-[0.9rem] text-mute">{loc.placeName} · {loc.spotName}</span>
            </span>
          ) : (
            <span className="text-mute">{lang === "hi" ? "जगह अभी नहीं लिखी" : "Place not noted yet"}</span>
          )}
        </div>
      </div>
      <ChevronRight size={22} className="shrink-0 text-mute" aria-hidden />
    </motion.button>
  );
}
