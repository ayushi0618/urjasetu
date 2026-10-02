// i18n.js
// Every UI string in three languages: English, Hindi, Hinglish.
// Checklist items, tips and assumptions come from the backend as stable
// keys (like "cl_w1_1" or "tip_fans"); this dictionary turns those keys
// into words. Placeholders like {rs} are filled in with real numbers.
// t(key, lang, params) is the only function the components use.

export const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "hinglish", label: "Hinglish" },
];

const D = {
  // ---------- header / nav ----------
  tagline: {
    en: "Your bill, turned into a savings plan.",
    hi: "आपका बिल, अब बचत की योजना।",
    hinglish: "Aapka bill, ab bachat ka plan.",
  },
  nav_home: { en: "Home", hi: "होम", hinglish: "Home" },
  nav_dashboard: { en: "Dashboard", hi: "डैशबोर्ड", hinglish: "Dashboard" },

  // ---------- home ----------
  hero_title: {
    en: "Take a photo of your bill. We do the boring maths.",
    hi: "बिल की फोटो लीजिए। बाकी हिसाब हम करेंगे।",
    hinglish: "Bill ki photo lo. Boring maths hum karenge.",
  },
  hero_sub: {
    en: "UrjaSetu reads your electricity bill and builds a week-by-week plan to cut waste and save rupees. Made for Indian homes and small shops.",
    hi: "UrjaSetu आपका बिजली बिल पढ़ता है और बर्बादी घटाकर रुपये बचाने के लिए हफ़्ते-दर-हफ़्ता योजना बनाता है। भारतीय घरों और छोटी दुकानों के लिए बनाया गया।",
    hinglish: "UrjaSetu aapka bijli bill padhta hai aur barbaadi ghatakar rupaye bachane ke liye week-by-week plan banata hai. Indian gharon aur chhoti dukano ke liye banaya gaya hai.",
  },
  btn_demo: {
    en: "Try the 90-second demo",
    hi: "90 सेकंड का डेमो आज़माएं",
    hinglish: "90-second demo try karo",
  },
  demo_note: {
    en: "Uses a real bill from Ghaziabad: Rs. 671.",
    hi: "गाज़ियाबाद के एक असली बिल पर आधारित: 671 रु.",
    hinglish: "Ghaziabad ke ek asli bill par based: Rs. 671.",
  },
  how_title: {
    en: "How it works",
    hi: "यह कैसे काम करता है",
    hinglish: "Ye kaise kaam karta hai",
  },
  step1_title: {
    en: "Snap your bill",
    hi: "बिल की फोटो लो",
    hinglish: "Bill ki photo lo",
  },
  step1_desc: {
    en: "A straight, well-lit photo works best.",
    hi: "सीधी, साफ रोशनी वाली फोटो सबसे अच्छी रहती है।",
    hinglish: "Seedhi, saaf roshni wali photo sabse achhi rehti hai.",
  },
  step2_title: {
    en: "We read the numbers",
    hi: "हम नंबर पढ़ते हैं",
    hinglish: "Hum numbers padhte hain",
  },
  step2_desc: {
    en: "The reader picks out your bill amount, units and charges.",
    hi: "रीडर आपका बिल, यूनिट और चार्ज पढ़ लेता है।",
    hinglish: "Reader aapka bill, units aur charges padh leta hai.",
  },
  step3_title: {
    en: "Get your plan",
    hi: "अपनी योजना पाओ",
    hinglish: "Apna plan pao",
  },
  step3_desc: {
    en: "Week-by-week tips to cut waste and save rupees.",
    hi: "बर्बादी घटाने के हफ़्ते-दर-हफ़्ते टिप्स पाएं।",
    hinglish: "Barbaadi ghatane ke week-by-week tips pao.",
  },
  tab_upload: {
    en: "Upload bill photo",
    hi: "बिल की फोटो अपलोड करें",
    hinglish: "Bill ki photo upload karo",
  },
  tab_manual: {
    en: "Enter manually",
    hi: "खुद लिखें",
    hinglish: "Khud likho",
  },

  // ---------- upload ----------
  drop_title: {
    en: "Drop your bill photo here",
    hi: "अपने बिल की फोटो यहाँ छोड़ें",
    hinglish: "Bill ki photo yahan drop karo",
  },
  drop_or: { en: "or", hi: "या", hinglish: "ya" },
  browse: { en: "Choose a file", hi: "फ़ाइल चुनें", hinglish: "File chuno" },
  reading: {
    en: "Reading your bill... this takes a few seconds.",
    hi: "आपका बिल पढ़ा जा रहा है... कुछ सेकंड लगेंगे।",
    hinglish: "Aapka bill padha ja raha hai... kuch second lagenge.",
  },
  reading_note: {
    en: "First time needs internet to load the reader.",
    hi: "पहली बार रीडर लोड करने के लिए इंटरनेट चाहिए।",
    hinglish: "Pehli baar reader load karne ke liye internet chahiye.",
  },
  confirm_title: {
    en: "We found these numbers. Fix anything that looks wrong:",
    hi: "हमें ये नंबर मिले। जो गलत लगे, ठीक कर दें:",
    hinglish: "Humein ye numbers mile. Jo galat lage, theek kar do:",
  },
  f_net: { en: "Net bill (Rs.)", hi: "कुल बिल (रु.)", hinglish: "Total bill (Rs.)" },
  f_energy: {
    en: "Energy charge (Rs.)",
    hi: "बिजली खर्च (रु.)",
    hinglish: "Bijli kharch (Rs.)",
  },
  f_fixed: {
    en: "Fixed charges + duty (Rs.)",
    hi: "फिक्स्ड चार्ज + ड्यूटी (रु.)",
    hinglish: "Fixed charge + duty (Rs.)",
  },
  f_units: {
    en: "Units used (kWh, if printed)",
    hi: "इस्तेमाल यूनिट (kWh, अगर लिखा हो)",
    hinglish: "Units used (kWh, agar likha ho)",
  },
  btn_make_plan: {
    en: "Make my savings plan",
    hi: "मेरी बचत योजना बनाएं",
    hinglish: "Meri bachat yojana banao",
  },
  ocr_tip: {
    en: "Tip: a straight, well-lit photo works best.",
    hi: "सुझाव: सीधी और साफ रोशनी वाली फोटो सबसे अच्छी रहती है।",
    hinglish: "Tip: seedhi aur saaf roshni wali photo sabse achhi rehti hai.",
  },
  ocr_fail: {
    en: "Could not read that photo. Try a clearer one, or enter the numbers manually.",
    hi: "यह फोटो पढ़ी नहीं जा सकी। कोई साफ फोटो आज़माएं, या नंबर खुद लिखें।",
    hinglish: "Ye photo padhi nahi ja saki. Koi saaf photo try karo, ya numbers khud likho.",
  },

  // ---------- manual entry ----------
  m_title: {
    en: "Type in your bill details",
    hi: "अपने बिल की जानकारी लिखें",
    hinglish: "Apne bill ki jaankari likho",
  },
  home_title: {
    en: "Tell us about your home, so the plan fits you",
    hi: "अपने घर के बारे में बताएं, ताकि योजना आपके लिए सही बने",
    hinglish: "Apne ghar ke baare mein batao, taaki plan aapke liye sahi bane",
  },
  q_fans: { en: "Ceiling fans", hi: "छत के पंखे", hinglish: "Ceiling fan" },
  q_fans_old: {
    en: "Old ones (not 5-star)?",
    hi: "पुराने वाले (5-स्टार नहीं)?",
    hinglish: "Purane wale (5-star nahi)?",
  },
  q_ac: { en: "Air conditioners", hi: "एयर कंडीशनर", hinglish: "AC" },
  q_fridge_old: {
    en: "Fridge older than 8 years?",
    hi: "क्या फ्रिज 8 साल से पुराना है?",
    hinglish: "Kya fridge 8 saal se purana hai?",
  },
  q_bulbs: {
    en: "Old bulbs/tubes to replace",
    hi: "बदलने वाले पुराने बल्ब/ट्यूब",
    hinglish: "Badalne wale purane bulb/tube",
  },
  yes: { en: "Yes", hi: "हाँ", hinglish: "Haan" },
  no: { en: "No", hi: "नहीं", hinglish: "Nahi" },

  // ---------- plan ----------
  plan_title: {
    en: "Your savings plan",
    hi: "आपकी बचत योजना",
    hinglish: "Aapki bachat yojana",
  },
  for_bill: { en: "For your bill of", hi: "आपके बिल पर", hinglish: "Aapke bill par" },
  waste_found: {
    en: "We estimate about this much is avoidable waste:",
    hi: "हमारा अनुमान है कि इतनी बचत मुमकिन है:",
    hinglish: "Hamara andaza hai ki itni bachat mumkin hai:",
  },
  per_month: { en: "/month", hi: "/माह", hinglish: "/mahina" },
  per_year: { en: "/year", hi: "/साल", hinglish: "/saal" },
  breakdown_title: {
    en: "Where your money goes",
    hi: "आपका पैसा कहाँ जाता है",
    hinglish: "Aapka paisa kahan jata hai",
  },
  tips_title: { en: "What to do about it", hi: "अब क्या करें", hinglish: "Ab kya karein" },
  checklist_title: {
    en: "Your 4-week checklist",
    hi: "आपकी 4 हफ़्तों की सूची",
    hinglish: "Aapki 4 hafton ki checklist",
  },
  week: { en: "Week", hi: "सप्ताह", hinglish: "Hafta" },
  co2_title: {
    en: "CO2 you would avoid in a year",
    hi: "एक साल में इतना CO2 बचेगा",
    hinglish: "Ek saal mein itna CO2 bachega",
  },
  assumptions_title: {
    en: "Our assumptions (we keep them honest)",
    hi: "हमारे अनुमान (हम ईमानदार रहते हैं)",
    hinglish: "Hamare anumaan (hum imaandaar rehte hain)",
  },
  ai_badge: {
    en: "Plan tuned by AI",
    hi: "AI से सुधारी गई योजना",
    hinglish: "AI se sudhari gayi yojana",
  },
  rule_badge: {
    en: "Plan built from household data",
    hi: "घरेलू आंकड़ों से बनी योजना",
    hinglish: "Gharelu aankdon se bani yojana",
  },
  ai_first: {
    en: "Do this first:",
    hi: "सबसे पहले यह करें:",
    hinglish: "Sabse pehle ye karo:",
  },
  new_bill: {
    en: "Analyze another bill",
    hi: "दूसरा बिल देखें",
    hinglish: "Doosra bill dekho",
  },
  of_bill: { en: "of your bill", hi: "आपके बिल का", hinglish: "aapke bill ka" },

  // ---------- breakdown labels ----------
  bd_fans: { en: "Fans", hi: "पंखे", hinglish: "Pankhe" },
  bd_lights: { en: "Lights", hi: "बत्तियाँ", hinglish: "Battiyan" },
  bd_fridge: { en: "Fridge", hi: "फ्रिज", hinglish: "Fridge" },
  bd_ac: { en: "Air conditioner", hi: "एसी", hinglish: "AC" },
  bd_standby: {
    en: "Standby devices",
    hi: "स्टैंडबाय डिवाइस",
    hinglish: "Standby devices",
  },
  bd_shift: {
    en: "Off-peak shifting",
    hi: "ऑफ-पीक शिफ्टिंग",
    hinglish: "Off-peak shifting",
  },

  // ---------- tips (with {n} and {rs} filled in) ----------
  tip_fans: {
    en: "Swap {n} old ceiling fans for 5-star models to save about Rs. {rs}/month.",
    hi: "{n} पुराने पंखे 5-स्टार से बदलें, करीब {rs} रु./माह बचेंगे।",
    hinglish: "{n} purane pankhe 5-star se badlo, kareeb Rs. {rs}/mahina bachega.",
  },
  tip_lights: {
    en: "Change {n} old bulbs to LEDs to save about Rs. {rs}/month.",
    hi: "{n} पुराने बल्ब LED से बदलें, करीब {rs} रु./माह बचेंगे।",
    hinglish: "{n} purane bulb LED se badlo, kareeb Rs. {rs}/mahina bachega.",
  },
  tip_fridge: {
    en: "An old fridge wastes power every day. A 5-star one can save about Rs. {rs}/month.",
    hi: "पुराना फ्रिज रोज़ बिजली बर्बाद करता है। 5-स्टार फ्रिज से करीब {rs} रु./माह बच सकते हैं।",
    hinglish: "Purana fridge roz bijli barbaad karta hai. 5-star fridge se kareeb Rs. {rs}/mahina bach sakta hai.",
  },
  tip_ac: {
    en: "Run the AC at 25°C instead of 20°C to cut its bill by roughly a fifth (about Rs. {rs}/month).",
    hi: "एसी 20°C की जगह 25°C पर चलाएं, बिल करीब पांचवां हिस्सा घटेगा (करीब {rs} रु./माह)।",
    hinglish: "AC 20°C ki jagah 25°C par chalao, bill kareeb 20% ghatega (kareeb Rs. {rs}/mahina).",
  },
  tip_standby: {
    en: "Switch off TV, set-top box and chargers at the plug at night to save about Rs. {rs}/month.",
    hi: "रात को टीवी, सेट-टॉप बॉक्स और चार्जर प्लग से बंद करें, करीब {rs} रु./माह बचेंगे।",
    hinglish: "Raat ko TV, set-top box aur charger plug se band karo, kareeb Rs. {rs}/mahina bachega.",
  },
  tip_shift: {
    en: "Run the washing machine and geyser in off-peak hours to save about Rs. {rs}/month.",
    hi: "वाशिंग मशीन और गीज़र ऑफ-पीक घंटों में चलाएं, करीब {rs} रु./माह बचेंगे।",
    hinglish: "Washing machine aur geyser off-peak hours mein chalao, kareeb Rs. {rs}/mahina bachega.",
  },

  // ---------- checklist ----------
  cl_w1_1: {
    en: "Write down every big appliance in your home and how many hours it runs daily.",
    hi: "अपने घर के हर बड़े उपकरण का नाम लिखें और वह रोज़ कितने घंटे चलता है।",
    hinglish: "Apne ghar ke har bade appliance ka naam likho aur vo roz kitne ghante chalta hai.",
  },
  cl_w1_2: {
    en: "For 3 nights, switch off standby devices at the plug before sleeping.",
    hi: "3 रातों तक सोने से पहले स्टैंडबाय डिवाइस प्लग से बंद करें।",
    hinglish: "3 raaton tak sone se pehle standby devices plug se band karo.",
  },
  cl_w1_3: {
    en: "Take a photo of your meter today, and again after 7 days.",
    hi: "आज अपने मीटर की फोटो लें, और 7 दिन बाद फिर लें।",
    hinglish: "Aaj apne meter ki photo lo, aur 7 din baad phir lo.",
  },
  cl_w2_1: {
    en: "Replace the 2 most-used bulbs with LEDs.",
    hi: "सबसे ज़्यादा इस्तेमाल होने वाले 2 बल्ब LED से बदलें।",
    hinglish: "Sabse zyada istemal hone wale 2 bulb LED se badlo.",
  },
  cl_w2_2: {
    en: "Clean the fan blades and try running fans one speed lower than usual.",
    hi: "पंखों के ब्लेड साफ करें और उन्हें usual से एक स्पीड कम पर चलाकर देखें।",
    hinglish: "Pankhon ke blade saaf karo aur unhein usual se ek speed kam par chalakar dekho.",
  },
  cl_w2_3: {
    en: "Notice which rooms keep lights or fans on when empty. Put a small reminder near the switch.",
    hi: "देखें कि खाली कमरों में कहाँ बत्ती या पंखा चलता रहता है। स्विच के पास एक छोटा reminder लगाएं।",
    hinglish: "Dekho ki khaali kamron mein kahan batti ya pankha chalta rehta hai. Switch ke paas ek chhota reminder lagao.",
  },
  cl_w3_1: {
    en: "Set the fridge to medium cooling and check that the door seal closes tightly.",
    hi: "फ्रिज को मीडियम कूलिंग पर रखें और देखें कि दरवाज़े की सील कसकर बंद होती है।",
    hinglish: "Fridge ko medium cooling par rakho aur dekho ki darwaze ki seal kaskar band hoti hai.",
  },
  cl_w3_2: {
    en: "If the freezer has ice thicker than 5 mm, defrost it this week.",
    hi: "अगर फ्रीज़र में 5 मिमी से मोटी बर्फ है, तो इस हफ़्ते डीफ्रॉस्ट करें।",
    hinglish: "Agar freezer mein 5 mm se moti barf hai, to is hafte defrost karo.",
  },
  cl_w3_3: {
    en: "Run the AC at 24-26°C for one full week and note how it feels.",
    hi: "एक पूरा हफ़्ता एसी 24-26°C पर चलाएं और देखें कैसा लगता है।",
    hinglish: "Ek poora hafta AC 24-26°C par chalao aur dekho kaisa lagta hai.",
  },
  cl_w4_1: {
    en: "For one week, run the washing machine and geyser in morning or late-night off-peak hours.",
    hi: "एक हफ़्ते तक वाशिंग मशीन और गीज़र सुबह या देर रात के ऑफ-पीक घंटों में चलाएं।",
    hinglish: "Ek hafte tak washing machine aur geyser subah ya der raat ke off-peak hours mein chalao.",
  },
  cl_w4_2: {
    en: "Compare this week's meter reading with week 1.",
    hi: "इस हफ़्ते की मीटर रीडिंग की तुलना पहले हफ़्ते से करें।",
    hinglish: "Is hafte ki meter reading ki tulna pehle hafte se karo.",
  },
  cl_w4_3: {
    en: "Pick the one change that saved the most and make it permanent.",
    hi: "वह एक बदलाव चुनें जिससे सबसे ज़्यादा बचत हुई, और उसे पक्का कर लें।",
    hinglish: "Vo ek badlaav chuno jisse sabse zyada bachat hui, aur use pakka kar lo.",
  },

  // ---------- assumptions ----------
  asm_rate_est: {
    en: "Unit rate taken as Rs. {r}/kWh (your bill did not show units).",
    hi: "यूनिट दर {r} रु./kWh मानी गई है (आपके बिल में यूनिट नहीं लिखी थी)।",
    hinglish: "Unit rate Rs. {r}/kWh maani gayi hai (aapke bill mein units nahi likhe the).",
  },
  asm_rate_given: {
    en: "Unit rate Rs. {r}/kWh, taken from your bill.",
    hi: "आपके बिल से यूनिट दर {r} रु./kWh ली गई है।",
    hinglish: "Aapke bill se unit rate Rs. {r}/kWh li gayi hai.",
  },
  asm_co2: {
    en: "CO2 factor: 0.82 kg per kWh (India grid average).",
    hi: "CO2 फैक्टर: 0.82 किग्रा प्रति kWh (भारत ग्रिड औसत)।",
    hinglish: "CO2 factor: 0.82 kg per kWh (India grid average).",
  },
  asm_cap: {
    en: "Total waste is capped at 20% of your energy charge, to stay realistic.",
    hi: "यथार्थवादी बने रहने के लिए कुल बर्बादी आपके बिजली खर्च के 20% तक सीमित रखी गई है।",
    hinglish: "Realistic bane rehne ke liye kul barbaadi aapke bijli kharch ke 20% tak seemit rakhi gayi hai.",
  },

  // ---------- dashboard ----------
  dash_title: { en: "Dashboard", hi: "डैशबोर्ड", hinglish: "Dashboard" },
  dash_sub: {
    en: "Everything you have tracked so far.",
    hi: "अब तक का सारा हिसाब।",
    hinglish: "Ab tak ka saara hisaab.",
  },
  stat_bills: {
    en: "Bills analyzed",
    hi: "बिल देखे गए",
    hinglish: "Bill dekhe gaye",
  },
  stat_save_year: {
    en: "Est. yearly savings",
    hi: "अनुमानित सालाना बचत",
    hinglish: "Anumaanit saalana bachat",
  },
  stat_co2: {
    en: "CO2 avoided / year",
    hi: "CO2 बचत / साल",
    hinglish: "CO2 bachat / saal",
  },
  stat_check: {
    en: "Checklist done",
    hi: "सूची पूरी",
    hinglish: "Checklist poori",
  },
  past_title: {
    en: "Past analyses",
    hi: "पुराने विश्लेषण",
    hinglish: "Purane analysis",
  },
  empty: {
    en: "No bills yet. Upload one to get started.",
    hi: "अभी कोई बिल नहीं। शुरू करने के लिए एक अपलोड करें।",
    hinglish: "Abhi koi bill nahi. Shuru karne ke liye ek upload karo.",
  },
  view: { en: "View", hi: "देखें", hinglish: "Dekho" },

  // ---------- misc ----------
  loading: {
    en: "Working on it...",
    hi: "काम चल रहा है...",
    hinglish: "Kaam chal raha hai...",
  },
  err_analyze: {
    en: "Something went wrong. Please try again.",
    hi: "कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।",
    hinglish: "Kuch gadbad hui. Dobara try karo.",
  },
  footer: {
    en: "Built by Ayushi and Ikra for the Yuva Yodha Energy Tech Hackathon.",
    hi: "युवा योधा एनर्जी टेक हैकथॉन के लिए आयुषी और इकरा द्वारा बनाया गया।",
    hinglish: "Yuva Yodha Energy Tech Hackathon ke liye Ayushi aur Ikra dwara banaya gaya.",
  },
};

export function t(key, lang = "en", params = {}) {
  const entry = D[key];
  if (!entry) return key;
  let s = entry[lang] || entry.en;
  for (const [k, v] of Object.entries(params)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
