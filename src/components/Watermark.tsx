import { renderToStaticMarkup } from "react-dom/server";
import type { Doc } from "../data";
import { DocArt, renderArt } from "../art";

export function stampText(purpose: string, dateLabel: string, lang: "en" | "hi") {
  return lang === "hi" ? `सिर्फ़ ${purpose} के लिए · ${dateLabel} को भेजा` : `For ${purpose} only · Sent ${dateLabel}`;
}

/** On-screen preview of the copy that will be sent: diagonal stamp + footer band. */
export function WatermarkPreview({ doc, stamp, masked, ownerName }: { doc: Doc; stamp: string; masked: boolean; ownerName: string }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-white lift">
      <div className="p-3">
        <DocArt doc={doc} masked={masked} ownerName={ownerName} className="h-auto w-full" />
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="wm" width="230" height="90" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
            <text x="0" y="40" fontSize="15" fontWeight="700" fill="rgba(179,65,46,0.32)" fontFamily="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">{stamp}</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wm)" />
      </svg>
      <div className="relative bg-danger px-3 py-2 text-center text-[0.95rem] font-semibold text-white">{stamp}</div>
    </div>
  );
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Builds a PNG of the stamped copy, ready for the share sheet. */
export async function makeStampedImage(doc: Doc, stamp: string, masked: boolean, ownerName: string): Promise<Blob> {
  const W = 960;
  const H = 720;
  const inner = doc.image
    ? `<image href="${doc.image}" x="40" y="40" width="880" height="560" preserveAspectRatio="xMidYMid meet" />`
    : `<g transform="translate(40 40) scale(2.75)">${renderToStaticMarkup(<>{renderArt(doc, masked, ownerName)}</>)}</g>`;
  const marks = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) => `<text x="${c * 600 - 260 + (r % 2) * 260}" y="${r * 110}" font-size="30" font-weight="700" fill="rgba(179,65,46,0.30)" font-family="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">${esc(stamp)}</text>`).join(""),
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#FFFFFF"/>
    ${inner}
    <g transform="rotate(-20 480 330)">${marks}</g>
    <rect x="0" y="${H - 90}" width="${W}" height="90" fill="#B3412E"/>
    <text x="${W / 2}" y="${H - 36}" text-anchor="middle" font-size="34" font-weight="700" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', 'Inter Tight', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Arial, sans-serif">${esc(stamp)}</text>
  </svg>`;
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("render failed"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
}

/** Opens the phone's share sheet (WhatsApp etc.). Falls back to downloading the image. */
export async function shareStamped(blob: Blob, filename: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const nav: any = navigator;
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], text });
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return "downloaded";
}
