/* Almari seed data. Every person, number and document here is fictional sample data. */

export type Lang = "en" | "hi";
export type Role = "keeper" | "helper";
export type CategoryId = "identity" | "health" | "money" | "home" | "vehicle" | "work" | "travel";
export type Art = "aadhaar" | "pan" | "voter" | "passbook" | "policy" | "report" | "prescription" | "card" | "licence" | "paper" | "passport" | "photo";
export type Access = "all" | "some" | "emergency";

export interface Person {
  id: string;
  name: string;
  nameHi: string;
  relation: string; // relation to Sunita (the keeper)
  relationHi: string;
  city: string;
  cityHi: string;
  color: string;
  owner?: boolean; // documents belong to this person
}

export interface Place {
  id: string;
  name: string;
  nameHi: string;
  kind: "almirah" | "drawer" | "cupboard" | "person";
  spots: { id: string; en: string; hi: string }[];
  personId?: string;
}

export interface FileBox {
  id: string;
  placeId: string;
  spotId: string;
  color: string; // hex
  colorName: string;
  colorNameHi: string;
  label: string;
  labelHi: string;
}

export interface Doc {
  id: string;
  title: string;
  titleHi: string;
  aliases: string[];
  personId: string;
  category: CategoryId;
  art: Art;
  image?: string; // data URL from the camera
  paperOnly?: boolean;
  fileId: string | null; // where the original is
  source: "camera" | "digilocker" | "whatsapp" | "paper" | "gallery";
  number?: string; // fictional
  expiry?: string; // ISO date
  addedBy: string;
  addedOn: string; // ISO date
  note?: string;
}

export interface Reminder {
  id: string;
  docId?: string;
  title: string;
  titleHi: string;
  due: string; // ISO date
  notify: string[]; // person ids
  done?: boolean;
}

export interface Request {
  id: string;
  from: string;
  to: string;
  docId?: string;
  docName: string;
  purpose: string;
  status: "pending" | "sent" | "declined";
  at: string;
  sentAt?: string;
}

export interface Activity {
  id: string;
  who: string;
  action: "viewed" | "added" | "shared" | "asked" | "sent" | "moved" | "access";
  docId?: string;
  detail?: string;
  at: string;
}

export interface Member {
  personId: string;
  access: Access;
  folders: CategoryId[]; // used when access = some
  canAdd: boolean;
}

export interface Account {
  id: string;
  name: string;
  nameHi: string;
  personId: string;
  loginWith: string; // registered email or number, partly hidden
  loginWithHi: string;
}

export interface Unwell {
  doctor: string;
  hospital: string;
  call: string[]; // person ids in order
  note: string;
  noteHi: string;
  visibleTo: string[];
}

export interface AppData {
  version: number;
  people: Person[];
  places: Place[];
  files: FileBox[];
  docs: Doc[];
  reminders: Reminder[];
  requests: Request[];
  activity: Activity[];
  members: Member[];
  accounts: Account[];
  diary: { en: string; hi: string };
  unwell: Unwell;
}

export const CATEGORIES: {
  id: CategoryId;
  en: string;
  hi: string;
  tone: string; // tailwind bg class
  icon: string; // lucide icon name
  suggest: { en: string; hi: string; art: Art }[];
}[] = [
  {
    id: "identity", en: "Identity", hi: "पहचान", tone: "bg-sky", icon: "IdCard",
    suggest: [
      { en: "Aadhaar card", hi: "आधार कार्ड", art: "aadhaar" },
      { en: "PAN card", hi: "पैन कार्ड", art: "pan" },
      { en: "Voter ID", hi: "वोटर आईडी", art: "voter" },
      { en: "Passport", hi: "पासपोर्ट", art: "passport" },
      { en: "Ration card", hi: "राशन कार्ड", art: "card" },
    ],
  },
  {
    id: "health", en: "Health", hi: "स्वास्थ्य", tone: "bg-rose", icon: "HeartPulse",
    suggest: [
      { en: "Health insurance card", hi: "हेल्थ इंश्योरेंस कार्ड", art: "card" },
      { en: "Latest blood report", hi: "नई ब्लड रिपोर्ट", art: "report" },
      { en: "Doctor's prescription", hi: "डॉक्टर का पर्चा", art: "prescription" },
      { en: "ABHA health card", hi: "आभा हेल्थ कार्ड", art: "card" },
    ],
  },
  {
    id: "money", en: "Bank & money", hi: "बैंक और पैसा", tone: "bg-sage", icon: "Landmark",
    suggest: [
      { en: "Bank passbook", hi: "बैंक पासबुक", art: "passbook" },
      { en: "Cheque book", hi: "चेक बुक", art: "passbook" },
      { en: "LIC policy", hi: "एलआईसी पॉलिसी", art: "policy" },
      { en: "FD receipt", hi: "एफडी रसीद", art: "paper" },
      { en: "Pension PPO", hi: "पेंशन पीपीओ", art: "paper" },
    ],
  },
  {
    id: "home", en: "Home & property", hi: "घर और संपत्ति", tone: "bg-butter", icon: "House",
    suggest: [
      { en: "Flat agreement", hi: "फ्लैट एग्रीमेंट", art: "paper" },
      { en: "Property tax receipt", hi: "प्रॉपर्टी टैक्स रसीद", art: "paper" },
      { en: "Gas connection book", hi: "गैस कनेक्शन बुक", art: "passbook" },
      { en: "Electricity bill", hi: "बिजली बिल", art: "paper" },
    ],
  },
  {
    id: "vehicle", en: "Vehicle", hi: "गाड़ी", tone: "bg-lilac", icon: "Car",
    suggest: [
      { en: "Driving licence", hi: "ड्राइविंग लाइसेंस", art: "licence" },
      { en: "Vehicle RC", hi: "गाड़ी की आरसी", art: "card" },
      { en: "Vehicle insurance", hi: "गाड़ी का बीमा", art: "policy" },
      { en: "PUC certificate", hi: "पीयूसी सर्टिफिकेट", art: "paper" },
    ],
  },
  {
    id: "work", en: "Work & business", hi: "काम और बिज़नेस", tone: "bg-clay", icon: "BriefcaseBusiness",
    suggest: [
      { en: "FSSAI licence", hi: "एफएसएसएआई लाइसेंस", art: "licence" },
      { en: "GST certificate", hi: "जीएसटी सर्टिफिकेट", art: "paper" },
      { en: "Service record", hi: "सर्विस रिकॉर्ड", art: "paper" },
    ],
  },
  {
    id: "travel", en: "Travel", hi: "यात्रा", tone: "bg-teal", icon: "TrainFront",
    suggest: [
      { en: "Senior citizen card", hi: "वरिष्ठ नागरिक कार्ड", art: "card" },
      { en: "Travel insurance", hi: "यात्रा बीमा", art: "policy" },
    ],
  },
];

export const READY_FOR: {
  id: string;
  en: string;
  hi: string;
  icon: string;
  tone: string;
  items: { en: string; hi: string; match: string[]; why: string; whyHi: string }[];
}[] = [
  {
    id: "hospital", en: "Hospital visit", hi: "अस्पताल जाना", icon: "Hospital", tone: "bg-rose",
    items: [
      { en: "Aadhaar card", hi: "आधार कार्ड", match: ["aadhaar"], why: "For registration", whyHi: "रजिस्ट्रेशन के लिए" },
      { en: "Health insurance card", hi: "हेल्थ इंश्योरेंस कार्ड", match: ["health insurance"], why: "For cashless treatment", whyHi: "कैशलेस इलाज के लिए" },
      { en: "Latest blood report", hi: "नई ब्लड रिपोर्ट", match: ["blood report"], why: "The doctor will ask", whyHi: "डॉक्टर पूछेंगे" },
      { en: "Doctor's prescription", hi: "डॉक्टर का पर्चा", match: ["prescription"], why: "Current medicines", whyHi: "अभी की दवाइयाँ" },
    ],
  },
  {
    id: "train", en: "Train journey", hi: "ट्रेन यात्रा", icon: "TrainFront", tone: "bg-teal",
    items: [
      { en: "Aadhaar card", hi: "आधार कार्ड", match: ["aadhaar"], why: "ID check on the train", whyHi: "ट्रेन में आईडी चेक" },
      { en: "PAN card (backup ID)", hi: "पैन कार्ड (दूसरी आईडी)", match: ["pan"], why: "If Aadhaar is not accepted", whyHi: "अगर आधार न चले" },
      { en: "Senior citizen card", hi: "वरिष्ठ नागरिक कार्ड", match: ["senior citizen"], why: "For concessions", whyHi: "छूट के लिए" },
    ],
  },
  {
    id: "bank", en: "Bank visit", hi: "बैंक जाना", icon: "Landmark", tone: "bg-sage",
    items: [
      { en: "Bank passbook", hi: "बैंक पासबुक", match: ["passbook"], why: "Entry and balance", whyHi: "एंट्री और बैलेंस" },
      { en: "PAN card", hi: "पैन कार्ड", match: ["pan"], why: "For KYC", whyHi: "केवाईसी के लिए" },
      { en: "Aadhaar card", hi: "आधार कार्ड", match: ["aadhaar"], why: "For KYC", whyHi: "केवाईसी के लिए" },
      { en: "Cheque book", hi: "चेक बुक", match: ["cheque"], why: "For withdrawals", whyHi: "पैसे निकालने के लिए" },
    ],
  },
  {
    id: "pension", en: "Pension / life certificate", hi: "पेंशन / जीवन प्रमाण", icon: "BadgeCheck", tone: "bg-butter",
    items: [
      { en: "Aadhaar card", hi: "आधार कार्ड", match: ["aadhaar"], why: "Face or thumb check", whyHi: "चेहरा या अँगूठा जाँच" },
      { en: "Pension PPO", hi: "पेंशन पीपीओ", match: ["ppo", "pension"], why: "PPO number is needed", whyHi: "पीपीओ नंबर चाहिए" },
      { en: "Bank passbook", hi: "बैंक पासबुक", match: ["passbook"], why: "Pension account", whyHi: "पेंशन खाता" },
    ],
  },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const daysAgo = (n: number) => daysFromNow(-n);
const minutesAgo = (n: number) => new Date(Date.now() - n * 60000).toISOString();

export function seed(): AppData {
  return {
    version: 3,
    people: [
      { id: "sunita", name: "Sunita", nameHi: "सुनीता", relation: "Me", relationHi: "मैं", city: "Nagpur", cityHi: "नागपुर", color: "#E8A33D", owner: true },
      { id: "ramesh", name: "Ramesh", nameHi: "रमेश", relation: "Husband", relationHi: "पति", city: "Nagpur", cityHi: "नागपुर", color: "#5B7FB5", owner: true },
      { id: "rahul", name: "Rahul", nameHi: "राहुल", relation: "Son", relationHi: "बेटा", city: "Bengaluru", cityHi: "बेंगलुरु", color: "#1E5B4F" },
      { id: "priya", name: "Priya", nameHi: "प्रिया", relation: "Daughter", relationHi: "बेटी", city: "Pune", cityHi: "पुणे", color: "#B5577A" },
      { id: "meena", name: "Meena", nameHi: "मीना", relation: "Sister", relationHi: "बहन", city: "Nagpur", cityHi: "नागपुर", color: "#7A6AB5" },
    ],
    places: [
      {
        id: "almirah", name: "Bedroom almirah", nameHi: "बेडरूम की अलमारी", kind: "almirah",
        spots: [
          { id: "s1", en: "Top shelf", hi: "ऊपर का खाना" },
          { id: "s2", en: "Middle shelf", hi: "बीच का खाना" },
          { id: "s3", en: "Bottom shelf", hi: "नीचे का खाना" },
          { id: "locker", en: "Locker (inside)", hi: "अंदर का लॉकर" },
        ],
      },
      {
        id: "kitchen", name: "Kitchen drawer", nameHi: "रसोई की दराज़", kind: "drawer",
        spots: [
          { id: "d1", en: "Top drawer", hi: "ऊपर की दराज़" },
          { id: "d2", en: "Second drawer", hi: "दूसरी दराज़" },
        ],
      },
      {
        id: "office", name: "Ramesh's office cupboard", nameHi: "रमेश जी की ऑफिस अलमारी", kind: "cupboard",
        spots: [
          { id: "o1", en: "Left side", hi: "बाईं तरफ़" },
          { id: "o2", en: "Right side", hi: "दाईं तरफ़" },
        ],
      },
      {
        id: "withrahul", name: "With Rahul (Bengaluru)", nameHi: "राहुल के पास (बेंगलुरु)", kind: "person", personId: "rahul",
        spots: [{ id: "p1", en: "Rahul's file", hi: "राहुल की फ़ाइल" }],
      },
    ],
    files: [
      { id: "f-green", placeId: "almirah", spotId: "s2", color: "#3E8E5A", colorName: "Green", colorNameHi: "हरी", label: "Bank", labelHi: "बैंक" },
      { id: "f-blue", placeId: "almirah", spotId: "s2", color: "#3F6FB0", colorName: "Blue", colorNameHi: "नीली", label: "Medical", labelHi: "मेडिकल" },
      { id: "f-red", placeId: "almirah", spotId: "s1", color: "#B8473B", colorName: "Red", colorNameHi: "लाल", label: "Property", labelHi: "प्रॉपर्टी" },
      { id: "f-orange", placeId: "almirah", spotId: "s1", color: "#D9822B", colorName: "Orange", colorNameHi: "नारंगी", label: "ID cards", labelHi: "पहचान पत्र" },
      { id: "f-locker", placeId: "almirah", spotId: "locker", color: "#6B5B95", colorName: "Purple pouch", colorNameHi: "बैंगनी थैली", label: "Originals", labelHi: "असली कागज़" },
      { id: "f-yellow", placeId: "kitchen", spotId: "d1", color: "#D8B23A", colorName: "Yellow", colorNameHi: "पीली", label: "Kitchen business", labelHi: "किचन बिज़नेस" },
      { id: "f-grey", placeId: "office", spotId: "o1", color: "#7D7D7D", colorName: "Grey", colorNameHi: "स्लेटी", label: "Vehicle & travel", labelHi: "गाड़ी और यात्रा" },
      { id: "f-rahul", placeId: "withrahul", spotId: "p1", color: "#1E5B4F", colorName: "Rahul's", colorNameHi: "राहुल की", label: "Copies", labelHi: "कॉपी" },
    ],
    docs: [
      { id: "d1", title: "Aadhaar card", titleHi: "आधार कार्ड", aliases: ["aadhar", "adhar", "aadhaar", "आधार", "uid"], personId: "sunita", category: "identity", art: "aadhaar", fileId: "f-orange", source: "digilocker", number: "2847 6193 4821", addedBy: "rahul", addedOn: daysAgo(40) },
      { id: "d2", title: "PAN card", titleHi: "पैन कार्ड", aliases: ["pan", "pan card", "पैन", "पेन"], personId: "sunita", category: "identity", art: "pan", fileId: "f-orange", source: "digilocker", number: "ABCPS1234K", addedBy: "rahul", addedOn: daysAgo(40) },
      { id: "d3", title: "Aadhaar card", titleHi: "आधार कार्ड", aliases: ["aadhar", "adhar", "aadhaar", "आधार", "uid"], personId: "ramesh", category: "identity", art: "aadhaar", fileId: "f-orange", source: "digilocker", number: "5531 0826 7714", addedBy: "rahul", addedOn: daysAgo(40) },
      { id: "d4", title: "PAN card", titleHi: "पैन कार्ड", aliases: ["pan", "pan card", "पैन", "पेन"], personId: "ramesh", category: "identity", art: "pan", fileId: "f-orange", source: "digilocker", number: "ABCPS5678L", addedBy: "rahul", addedOn: daysAgo(40) },
      { id: "d5", title: "Voter ID", titleHi: "वोटर आईडी", aliases: ["voter", "election card", "वोटर", "मतदाता"], personId: "sunita", category: "identity", art: "voter", fileId: "f-orange", source: "camera", addedBy: "sunita", addedOn: daysAgo(12) },
      { id: "d6", title: "Senior citizen card", titleHi: "वरिष्ठ नागरिक कार्ड", aliases: ["senior", "senior citizen", "वरिष्ठ"], personId: "ramesh", category: "travel", art: "card", fileId: "f-grey", source: "camera", addedBy: "rahul", addedOn: daysAgo(30) },
      { id: "d7", title: "SBI bank passbook", titleHi: "एसबीआई पासबुक", aliases: ["passbook", "bank", "sbi", "पासबुक", "बैंक"], personId: "sunita", category: "money", art: "passbook", fileId: "f-green", source: "camera", addedBy: "sunita", addedOn: daysAgo(20) },
      { id: "d8", title: "Cheque book", titleHi: "चेक बुक", aliases: ["cheque", "check book", "चेक"], personId: "sunita", category: "money", art: "passbook", fileId: "f-green", source: "paper", paperOnly: true, addedBy: "sunita", addedOn: daysAgo(20) },
      { id: "d9", title: "LIC policy", titleHi: "एलआईसी पॉलिसी", aliases: ["lic", "insurance", "policy", "बीमा", "एलआईसी", "पॉलिसी"], personId: "ramesh", category: "money", art: "policy", fileId: "f-locker", source: "camera", expiry: daysFromNow(10), addedBy: "rahul", addedOn: daysAgo(35), note: "Premium every year in November" },
      { id: "d10", title: "Pension PPO", titleHi: "पेंशन पीपीओ", aliases: ["ppo", "pension", "पेंशन", "पीपीओ"], personId: "ramesh", category: "money", art: "paper", fileId: "f-locker", source: "camera", addedBy: "rahul", addedOn: daysAgo(35) },
      { id: "d11", title: "Health insurance card", titleHi: "हेल्थ इंश्योरेंस कार्ड", aliases: ["health insurance", "mediclaim", "insurance card", "हेल्थ", "मेडिक्लेम", "बीमा कार्ड"], personId: "sunita", category: "health", art: "card", fileId: "f-blue", source: "whatsapp", expiry: daysFromNow(17), addedBy: "rahul", addedOn: daysAgo(25) },
      { id: "d12", title: "Blood test report (Sep)", titleHi: "ब्लड टेस्ट रिपोर्ट (सितंबर)", aliases: ["blood report", "blood test", "report", "sugar report", "रिपोर्ट", "ब्लड", "खून"], personId: "ramesh", category: "health", art: "report", fileId: "f-blue", source: "whatsapp", addedBy: "rahul", addedOn: daysAgo(60) },
      { id: "d13", title: "Doctor's prescription", titleHi: "डॉक्टर का पर्चा", aliases: ["prescription", "medicine", "parcha", "पर्चा", "दवाई"], personId: "ramesh", category: "health", art: "prescription", fileId: "f-blue", source: "camera", addedBy: "sunita", addedOn: daysAgo(8) },
      { id: "d14", title: "Flat agreement", titleHi: "फ्लैट एग्रीमेंट", aliases: ["flat", "agreement", "property", "registry", "फ्लैट", "घर के कागज़", "रजिस्ट्री"], personId: "ramesh", category: "home", art: "paper", fileId: "f-red", source: "paper", paperOnly: true, addedBy: "ramesh", addedOn: daysAgo(15) },
      { id: "d15", title: "Gas connection book", titleHi: "गैस कनेक्शन बुक", aliases: ["gas", "gas book", "cylinder", "गैस", "सिलेंडर"], personId: "sunita", category: "home", art: "passbook", fileId: "f-red", source: "paper", paperOnly: true, addedBy: "sunita", addedOn: daysAgo(15) },
      { id: "d16", title: "FSSAI licence", titleHi: "एफएसएसएआई लाइसेंस", aliases: ["fssai", "food licence", "kitchen licence", "license", "लाइसेंस", "फूड"], personId: "sunita", category: "work", art: "licence", fileId: "f-yellow", source: "camera", expiry: daysFromNow(58), addedBy: "rahul", addedOn: daysAgo(30) },
      { id: "d17", title: "Driving licence", titleHi: "ड्राइविंग लाइसेंस", aliases: ["driving", "dl", "licence", "license", "ड्राइविंग", "लाइसेंस"], personId: "ramesh", category: "vehicle", art: "licence", fileId: "f-grey", source: "digilocker", expiry: daysFromNow(420), addedBy: "rahul", addedOn: daysAgo(40) },
      { id: "d18", title: "Passport", titleHi: "पासपोर्ट", aliases: ["passport", "पासपोर्ट"], personId: "ramesh", category: "identity", art: "passport", fileId: "f-rahul", source: "camera", expiry: daysFromNow(130), addedBy: "rahul", addedOn: daysAgo(50), note: "Original is with Rahul since the visa visit" },
    ],
    reminders: [
      { id: "r1", docId: "d9", title: "LIC premium due", titleHi: "एलआईसी प्रीमियम भरना है", due: daysFromNow(10), notify: ["ramesh", "rahul"] },
      { id: "r2", title: "Life certificate for pension (Ramesh)", titleHi: "पेंशन का जीवन प्रमाण (रमेश जी)", due: daysFromNow(12), notify: ["ramesh", "rahul"] },
      { id: "r3", docId: "d11", title: "Health insurance renewal", titleHi: "हेल्थ इंश्योरेंस रिन्यू", due: daysFromNow(17), notify: ["sunita", "rahul"] },
      { id: "r4", docId: "d16", title: "FSSAI licence renewal", titleHi: "एफएसएसएआई लाइसेंस रिन्यू", due: daysFromNow(58), notify: ["sunita", "rahul"] },
      { id: "r5", docId: "d18", title: "Passport renewal (Ramesh)", titleHi: "पासपोर्ट रिन्यू (रमेश जी)", due: daysFromNow(130), notify: ["ramesh", "rahul"] },
    ],
    requests: [
      { id: "q1", from: "rahul", to: "sunita", docName: "Gas connection book", docId: "d15", purpose: "Gas KYC update", status: "pending", at: minutesAgo(25) },
    ],
    activity: [
      { id: "a1", who: "rahul", action: "asked", docId: "d15", detail: "Gas KYC update", at: minutesAgo(25) },
      { id: "a2", who: "rahul", action: "viewed", docId: "d9", at: minutesAgo(140) },
      { id: "a3", who: "sunita", action: "added", docId: "d13", at: daysAgo(8) + "T10:00:00" },
      { id: "a4", who: "priya", action: "viewed", docId: "d12", at: daysAgo(3) + "T19:30:00" },
      { id: "a5", who: "sunita", action: "shared", docId: "d1", detail: "For SBI KYC only", at: daysAgo(5) + "T12:10:00" },
    ],
    members: [
      { personId: "ramesh", access: "all", folders: [], canAdd: true },
      { personId: "rahul", access: "all", folders: [], canAdd: true },
      { personId: "priya", access: "some", folders: ["health", "identity"], canAdd: false },
      { personId: "meena", access: "emergency", folders: [], canAdd: false },
    ],
    accounts: [
      { id: "ac1", name: "SBI net banking", nameHi: "एसबीआई नेट बैंकिंग", personId: "sunita", loginWith: "Mobile ending 4821", loginWithHi: "मोबाइल जिसके आख़िर में 4821" },
      { id: "ac2", name: "Google Pay (UPI)", nameHi: "गूगल पे (यूपीआई)", personId: "sunita", loginWith: "Mobile ending 4821", loginWithHi: "मोबाइल जिसके आख़िर में 4821" },
      { id: "ac3", name: "Gmail", nameHi: "जीमेल", personId: "sunita", loginWith: "sunita.s…@gmail.com, recovery: Rahul's number", loginWithHi: "sunita.s…@gmail.com, रिकवरी: राहुल का नंबर" },
      { id: "ac4", name: "LIC customer portal", nameHi: "एलआईसी पोर्टल", personId: "ramesh", loginWith: "Email r.sharma…@yahoo.com", loginWithHi: "ईमेल r.sharma…@yahoo.com" },
      { id: "ac5", name: "Pension (bank)", nameHi: "पेंशन (बैंक)", personId: "ramesh", loginWith: "Mobile ending 7714", loginWithHi: "मोबाइल जिसके आख़िर में 7714" },
    ],
    diary: {
      en: "Blue diary, last two pages. Kept in the kitchen drawer, under the order book.",
      hi: "नीली डायरी, आख़िरी दो पन्ने। रसोई की दराज़ में, ऑर्डर वाली कॉपी के नीचे।",
    },
    unwell: {
      doctor: "Dr. Kulkarni, 98XXX XXX10",
      hospital: "City Care Hospital, Dharampeth",
      call: ["rahul", "ramesh", "meena"],
      note: "Pension, LIC and bank originals are in the purple pouch inside the almirah locker. Locker key is in the steel dabba on the top shelf.",
      noteHi: "पेंशन, एलआईसी और बैंक के असली कागज़ अलमारी के लॉकर में बैंगनी थैली में हैं। लॉकर की चाबी ऊपर वाले खाने में स्टील के डब्बे में है।",
      visibleTo: ["ramesh", "rahul", "priya", "meena"],
    },
  };
}
