import type { Lang } from "./data";

const S = {
  appTagline: ["Know where every paper is", "हर कागज़ कहाँ है, पता रहे"],
  namaste: ["Namaste", "नमस्ते"],
  ji: ["ji", "जी"],
  findPlaceholder: ["Find a document…", "कागज़ ढूँढें…"],
  speak: ["Speak", "बोलें"],
  listening: ["Listening… say a document name", "सुन रहे हैं… कागज़ का नाम बोलिए"],
  trySaying: ["Try saying", "ऐसे बोलकर देखें"],
  readyFor: ["Ready for…", "किसके लिए तैयारी?"],
  allFolders: ["All folders", "सारे फ़ोल्डर"],
  comingUp: ["Coming up", "आने वाले काम"],
  seeAll: ["See all", "सब देखें"],
  home: ["Home", "होम"],
  find: ["Find", "ढूँढें"],
  add: ["Add", "जोड़ें"],
  family: ["Family", "परिवार"],
  more: ["More", "और"],
  ask: ["Ask", "माँगें"],
  reminders: ["Reminders", "याद दिलाना"],
  documents: ["documents", "कागज़"],
  document: ["document", "कागज़"],
  originalKept: ["The original is kept in", "असली कागज़ यहाँ रखा है"],
  showCounter: ["Show at counter", "काउंटर पर दिखाएँ"],
  shareSafely: ["Share safely", "सुरक्षित भेजें"],
  setReminder: ["Set reminder", "याद दिलाएँ"],
  changePlace: ["Change place", "जगह बदलें"],
  onlyPaper: ["Only on paper. No photo yet.", "सिर्फ़ कागज़ पर है। अभी फ़ोटो नहीं है।"],
  takePhotoNow: ["Take a photo now", "अभी फ़ोटो लें"],
  whoCanSee: ["Who can see this", "कौन देख सकता है"],
  addedBy: ["Added by", "जोड़ा"],
  fromDigilocker: ["From DigiLocker · verified", "डिजीलॉकर से · सत्यापित"],
  fromWhatsapp: ["Saved from WhatsApp", "व्हाट्सऐप से सेव किया"],
  tapToClose: ["Tap anywhere to close", "बंद करने के लिए कहीं भी छुएँ"],
  copyNote: ["This is a copy. Banks and offices may still ask for the original.", "यह कॉपी है। बैंक या दफ़्तर असली कागज़ भी माँग सकते हैं।"],
  expires: ["Renew by", "रिन्यू करना है"],
  daysLeft: ["days left", "दिन बाकी"],
  today: ["Today", "आज"],
  noResults: ["Nothing found with that name.", "इस नाम से कुछ नहीं मिला।"],
  addIt: ["Add it now", "अभी जोड़ें"],
  results: ["results", "मिले"],
  back: ["Back", "पीछे"],
  next: ["Next", "आगे"],
  save: ["Save", "सेव करें"],
  done: ["Done", "हो गया"],
  cancel: ["Cancel", "रद्द करें"],
  close: ["Close", "बंद करें"],
  send: ["Send", "भेजें"],
  notNow: ["Not now", "अभी नहीं"],
  // add flow
  addTitle: ["Add a document", "कागज़ जोड़ें"],
  stepPhoto: ["How do you want to add it?", "कैसे जोड़ना है?"],
  takePhoto: ["Take a photo", "फ़ोटो लें"],
  takePhotoSub: ["Use the camera", "कैमरा से"],
  fromGallery: ["From gallery", "गैलरी से"],
  fromGallerySub: ["A photo already on your phone", "फ़ोन में पहले से फ़ोटो"],
  fromWhatsappBtn: ["From WhatsApp", "व्हाट्सऐप से"],
  fromWhatsappSub: ["Someone sent it to you", "किसी ने भेजा है"],
  fromDigilockerBtn: ["From DigiLocker", "डिजीलॉकर से"],
  fromDigilockerSub: ["Aadhaar, PAN, licence: fetched and verified", "आधार, पैन, लाइसेंस: सीधे और सत्यापित"],
  paperOnlyBtn: ["Only note where the paper is", "सिर्फ़ लिखें कि कागज़ कहाँ है"],
  paperOnlySub: ["No photo needed", "फ़ोटो की ज़रूरत नहीं"],
  stepWhat: ["What is it?", "यह क्या है?"],
  typeOrSpeak: ["Type or speak the name", "नाम लिखें या बोलें"],
  whose: ["Whose document?", "किसका कागज़ है?"],
  stepFolder: ["Which folder?", "कौन सा फ़ोल्डर?"],
  stepWhere: ["Where is the original kept?", "असली कागज़ कहाँ रखा है?"],
  wherePlace: ["Place", "जगह"],
  whereSpot: ["Shelf or drawer", "खाना या दराज़"],
  whereFile: ["Which file?", "कौन सी फ़ाइल?"],
  newFile: ["New file", "नई फ़ाइल"],
  noFile: ["Not in a file", "फ़ाइल में नहीं"],
  stepDate: ["Does it need renewing?", "क्या इसे रिन्यू करना होता है?"],
  noDate: ["No date", "कोई तारीख़ नहीं"],
  remindAlso: ["Also remind", "इन्हें भी याद दिलाएँ"],
  savedToast: ["Saved. Your family can find it now.", "सेव हो गया। अब परिवार भी ढूँढ सकता है।"],
  suggested: ["You could also add", "ये भी जोड़ सकते हैं"],
  // share
  shareTitle: ["Share safely", "सुरक्षित भेजें"],
  shareFor: ["Who is it for?", "किसके लिए भेज रहे हैं?"],
  shareForNote: ["We print this on the copy, like you write on a photocopy.", "यह कॉपी पर छपेगा, जैसे फ़ोटोकॉपी पर लिखते हैं।"],
  maskAadhaar: ["Hide Aadhaar number (show last 4 digits only)", "आधार नंबर छुपाएँ (सिर्फ़ आख़िरी 4 अंक)"],
  shareWhatsapp: ["Share on WhatsApp", "व्हाट्सऐप पर भेजें"],
  shareLink: ["Send a link that stops working in 24 hours", "ऐसा लिंक भेजें जो 24 घंटे में बंद हो जाए"],
  forOnly: ["only", "के लिए"],
  sharedToast: ["Shared. It is in your activity list.", "भेज दिया। यह आपकी गतिविधि में दिखेगा।"],
  linkToast: ["Link copied. It stops working in 24 hours.", "लिंक कॉपी हो गया। 24 घंटे में बंद हो जाएगा।"],
  // family
  familyTitle: ["Family circle", "परिवार"],
  familySub: ["You decide who sees what. You can change it any time.", "कौन क्या देखे, यह आप तय करें। कभी भी बदल सकते हैं।"],
  accessAll: ["Sees everything", "सब देख सकते हैं"],
  accessSome: ["Sees chosen folders", "चुने हुए फ़ोल्डर देखते हैं"],
  accessEmergency: ["Only in an emergency", "सिर्फ़ इमरजेंसी में"],
  canAdd: ["Can add documents for you", "आपके लिए कागज़ जोड़ सकते हैं"],
  invite: ["Invite someone", "किसी को जोड़ें"],
  remove: ["Remove from circle", "परिवार से हटाएँ"],
  activity: ["Who did what", "किसने क्या किया"],
  viewed: ["viewed", "ने देखा"],
  addedA: ["added", "ने जोड़ा"],
  shared: ["shared", "ने भेजा"],
  asked: ["asked for", "ने माँगा"],
  sentA: ["sent", "ने भेजा"],
  moved: ["changed the place of", "ने जगह बदली"],
  // requests
  needsThis: ["needs this", "को यह चाहिए"],
  forPurpose: ["For", "किसलिए"],
  sendOne: ["Send it", "भेज दें"],
  sentToast: ["Sent. Rahul has it now.", "भेज दिया। राहुल को मिल गया।"],
  askTitle: ["Ask for a document", "कागज़ माँगें"],
  askSub: ["Mummy gets one big card and sends it with one tap. No phone call needed.", "मम्मी को एक बड़ा कार्ड मिलेगा, एक बार छूकर भेज देंगी। फ़ोन की ज़रूरत नहीं।"],
  askWhich: ["Which document?", "कौन सा कागज़?"],
  askWhy: ["What is it for?", "किसलिए चाहिए?"],
  askSend: ["Send request", "माँगें"],
  askedToast: ["Request sent to Mummy.", "मम्मी को भेज दिया।"],
  yourRequests: ["Your requests", "आपकी माँगें"],
  waiting: ["Waiting", "इंतज़ार"],
  received: ["Received", "मिल गया"],
  // unwell
  unwellTitle: ["If I'm unwell", "अगर मेरी तबियत ख़राब हो"],
  unwellSub: ["Everything my family needs, in one place.", "परिवार को जो चाहिए, सब एक जगह।"],
  callFirst: ["Call in this order", "इस क्रम में फ़ोन करें"],
  importantPapers: ["Important papers and where they are", "ज़रूरी कागज़ और उनकी जगह"],
  passwordDiary: ["Password diary", "पासवर्ड वाली डायरी"],
  doctor: ["Doctor", "डॉक्टर"],
  hospital: ["Hospital", "अस्पताल"],
  visibleTo: ["Visible to", "कौन देख सकता है"],
  // diary
  diaryTitle: ["Passwords & logins", "पासवर्ड और लॉगिन"],
  diaryNever: ["Almari never stores your passwords. It only remembers where your diary is, and which number or email each account uses.", "अलमारी आपके पासवर्ड कभी सेव नहीं करता। सिर्फ़ यह याद रखता है कि डायरी कहाँ है और हर खाता किस नंबर या ईमेल से खुलता है।"],
  diaryWhere: ["Where the password diary is", "पासवर्ड डायरी कहाँ है"],
  accountsTitle: ["Which number or email opens each account", "कौन सा खाता किस नंबर या ईमेल से खुलता है"],
  edit: ["Edit", "बदलें"],
  // reminders
  remindersTitle: ["Reminders", "याद दिलाना"],
  remindersSub: ["Reminders go to you and to the people you choose.", "याद आपको और जिन्हें आप चुनें, दोनों को आएगी।"],
  markDone: ["Mark done", "हो गया"],
  addReminder: ["Add a reminder", "नया रिमाइंडर"],
  // more
  moreTitle: ["More", "और"],
  language: ["Language", "भाषा"],
  textSize: ["Text size", "अक्षरों का आकार"],
  printIndex: ["Print the almirah list", "अलमारी की लिस्ट प्रिंट करें"],
  printSub: ["One page to keep inside the almirah door", "अलमारी के दरवाज़े के अंदर लगाने के लिए एक पेज"],
  whoIsUsing: ["Who is using this phone?", "यह फ़ोन कौन चला रहा है?"],
  lockApp: ["Open with fingerprint or pattern", "फ़िंगरप्रिंट या पैटर्न से खोलें"],
  resetDemo: ["Reset sample data", "सैंपल डेटा फिर से शुरू करें"],
  testKit: ["Testing kit (for researchers)", "टेस्टिंग किट (रिसर्च के लिए)"],
  // lock
  touchToOpen: ["Touch the fingerprint sensor to open", "खोलने के लिए फ़िंगरप्रिंट लगाएँ"],
  usePattern: ["Use pattern instead", "पैटर्न से खोलें"],
  noNewPassword: ["No new password. Almari opens with your phone's own lock.", "कोई नया पासवर्ड नहीं। अलमारी आपके फ़ोन के लॉक से खुलता है।"],
  // misc
  keeperName: ["Sunita", "सुनीता"],
  ourDocs: ["Our documents", "हमारे कागज़"],
  parentsDocs: ["Mummy & Papa's documents", "मम्मी-पापा के कागज़"],
  askMummy: ["Ask Mummy for a document", "मम्मी से कागज़ माँगें"],
  pending: ["Waiting for you", "आपका इंतज़ार"],
  everyone: ["Everyone", "सब"],
  me: ["Me", "मैं"],
  inFile: ["file", "फ़ाइल"],
  found: ["Found", "मिला"],
  notAdded: ["Not added yet", "अभी जोड़ा नहीं"],
  packed: ["Packed", "रख लिया"],
  bundleNote: ["Tick each one as you put it in the bag.", "बैग में रखते ही टिक करें।"],
  emergencyOnlyNote: ["can only see your 'If I'm unwell' card", "सिर्फ़ 'तबियत ख़राब' वाला कार्ड देख सकते हैं"],
  inviteToast: ["Invite link ready to send on WhatsApp.", "व्हाट्सऐप पर भेजने के लिए लिंक तैयार है।"],
  digilockerConsent: ["Allow Almari to fetch documents from your DigiLocker?", "क्या अलमारी आपके डिजीलॉकर से कागज़ ले सकता है?"],
  digilockerNote: ["You confirm with an OTP from DigiLocker. Almari only reads the documents you pick.", "डिजीलॉकर के ओटीपी से पक्का करेंगे। अलमारी सिर्फ़ चुने हुए कागज़ पढ़ेगा।"],
  allow: ["Allow", "हाँ, अनुमति दें"],
  whatsappHow: ["In WhatsApp: press and hold the photo or PDF, tap Share, then choose Almari.", "व्हाट्सऐप में: फ़ोटो या पीडीएफ़ को दबाकर रखें, शेयर दबाएँ, फिर अलमारी चुनें।"],
  tryWithSample: ["Try with a sample photo", "सैंपल फ़ोटो से देखें"],
  activityAll: ["See all activity", "सारी गतिविधि"],
  helperNote: ["You can see everything Mummy and Papa share with you.", "मम्मी-पापा जो दिखाते हैं, आप सब देख सकते हैं।"],
  sampleData: ["Sample data. Every name and number here is made up.", "सैंपल डेटा। यहाँ हर नाम और नंबर काल्पनिक है।"],
} as const;

export type Key = keyof typeof S;

export function makeT(lang: Lang) {
  const i = lang === "hi" ? 1 : 0;
  return (k: Key) => S[k][i];
}

export function pick<T extends { en?: string; hi?: string }>(o: T, lang: Lang) {
  return lang === "hi" ? o.hi : o.en;
}

const HI_DIGITS = false; // keep Western digits; most phones and documents use them

export function fmtDate(isoDate: string, lang: Lang) {
  const d = new Date(isoDate);
  return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", numberingSystem: HI_DIGITS ? "deva" : "latn" } as any);
}

export function daysUntil(isoDate: string) {
  const a = new Date(); a.setHours(0, 0, 0, 0);
  const b = new Date(isoDate); b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function timeAgo(isoTs: string, lang: Lang) {
  const mins = Math.round((Date.now() - new Date(isoTs).getTime()) / 60000);
  if (lang === "hi") {
    if (mins < 1) return "अभी";
    if (mins < 60) return `${mins} मिनट पहले`;
    const h = Math.round(mins / 60);
    if (h < 24) return `${h} घंटे पहले`;
    return `${Math.round(h / 24)} दिन पहले`;
  }
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
