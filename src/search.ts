import { CATEGORIES, type Doc } from "./data";

const FILLER = new Set([
  "show", "find", "where", "is", "the", "my", "me", "please", "open", "get", "of", "a", "an", "for", "card",
  "dikhao", "dikhaiye", "dikha", "do", "kahan", "kaha", "hai", "ka", "ki", "ke", "mera", "meri", "mere", "wala", "wali",
  "दिखाओ", "दिखाइए", "दिखा", "दो", "कहाँ", "कहां", "है", "का", "की", "के", "मेरा", "मेरी", "मेरे", "वाला", "वाली", "ज़रा", "जरा", "प्लीज़", "कार्ड",
]);

const PERSON_WORDS: Record<string, string> = {
  papa: "ramesh", "पापा": "ramesh", ramesh: "ramesh", "रमेश": "ramesh", husband: "ramesh", "पति": "ramesh", pitaji: "ramesh",
  mummy: "sunita", mumma: "sunita", mom: "sunita", maa: "sunita", "मम्मी": "sunita", "माँ": "sunita", sunita: "sunita", "सुनीता": "sunita",
};

export function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?।'"’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(q: string) {
  return normalise(q).split(" ").filter(Boolean);
}

/** Small edit distance so "adhar" and "aadhaar" still meet. */
function close(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2 || a.length < 4) return false;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length] <= 2;
}

export function searchDocs(docs: Doc[], q: string) {
  const all = tokens(q);
  let personFilter: string | null = null;
  const words: string[] = [];
  for (const w of all) {
    if (PERSON_WORDS[w]) personFilter = PERSON_WORDS[w];
    else if (!FILLER.has(w)) words.push(w);
  }
  if (!words.length && !personFilter) return [];

  const scored = docs
    .filter((d) => !personFilter || d.personId === personFilter)
    .map((d) => {
      if (!words.length) return { d, s: 1 };
      const cat = CATEGORIES.find((c) => c.id === d.category);
      const hay = [d.title, d.titleHi, ...d.aliases, cat?.en ?? "", cat?.hi ?? ""].map(normalise);
      const hayWords = hay.flatMap((h) => h.split(" "));
      let s = 0;
      for (const w of words) {
        if (hay.some((h) => h === w)) s += 5;
        else if (hay.some((h) => h.startsWith(w) || h.includes(" " + w))) s += 4;
        else if (hayWords.some((h) => h.startsWith(w))) s += 3;
        else if (hayWords.some((h) => close(h, w))) s += 2;
        else if (hay.some((h) => h.includes(w) && w.length >= 3)) s += 1;
      }
      return { d, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  const top = scored[0]?.s ?? 0;
  return scored.filter((x) => x.s >= top * 0.85).map((x) => x.d);
}

export function matchBundleItem(docs: Doc[], match: string[]) {
  return docs.filter((d) => {
    const hay = [d.title, ...d.aliases].map(normalise);
    return match.some((m) => hay.some((h) => h.includes(m)));
  });
}
