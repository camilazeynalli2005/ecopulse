export type EcoLocation = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  coordinates: string;
  marker: { x: number; y: number };
  tone: string;
  cover: number;
  water: number;
  temperature: string;
  fireAlerts: number;
  environment: "forest" | "water" | "dry";
  story: string;
  insight: string;
};

// All numeric indicators here are illustrative prototype values, not NASA observations.
export const locations: EcoLocation[] = [
  {
    id: "topxana",
    name: "Topxana meşəsi",
    shortName: "Topxana",
    subtitle: "Şuşanın yaşıl yaddaşı",
    coordinates: "39°45′ şm. e. · 46°45′ ş. u.",
    marker: { x: 61, y: 56 },
    tone: "#537d58",
    cover: 68,
    water: 54,
    temperature: "+1.2°",
    fireAlerts: 2,
    environment: "forest",
    story: "Topxananın meşə kənarlarında bitki örtüyünün ritmini izləyirik. Yağışdan sonra torpaq nəfəs alır, quş səsləri isə canlanan yamacları xəbər verir.",
    insight: "Meşə örtüyü və yamac ekosisteminin mövsümi müşahidəsi",
  },
  {
    id: "kalbajar",
    name: "Kəlbəcər",
    shortName: "Kəlbəcər",
    subtitle: "Dağ suları və yüksək yaylalar",
    coordinates: "40°06′ şm. e. · 46°02′ ş. u.",
    marker: { x: 39, y: 33 },
    tone: "#3e7180",
    cover: 74,
    water: 81,
    temperature: "+0.8°",
    fireAlerts: 1,
    environment: "water",
    story: "Kəlbəcərin dağ dərələrində suyun izi yüksəkliklərlə birgə dəyişir. Bulaqların axınını və sahil boyu yaşıllığı müqayisə etmək təbiətin əlaqələrini göstərir.",
    insight: "Su hövzələri, yağıntı və dağ çəmənliklərinin əlaqəsi",
  },
  {
    id: "lachin",
    name: "Laçın",
    shortName: "Laçın",
    subtitle: "Meşə ilə dərənin görüşü",
    coordinates: "39°38′ şm. e. · 46°33′ ş. u.",
    marker: { x: 49, y: 69 },
    tone: "#8b7950",
    cover: 59,
    water: 63,
    temperature: "+1.5°",
    fireAlerts: 3,
    environment: "dry",
    story: "Laçında günəşli yamaclar və dərin dərələr bir-birinə yaxın yaşayır. Quru havada quşların səsi azalır, küləyin və torpağın nəfəsi daha aydın eşidilir.",
    insight: "Yamacların yaşıllığı, temperatur və quraqlıq riski",
  },
];

export const quizQuestions = [
  {
    question: "Peyk sətonu (albedo) dəyişikliyində hansı faktor ən vahid təsir göstərir?",
    options: ["Yer münaxəsini yanıq törənin rəngi", "Quşların gördiyi rənglər", "Yalnız gecə zamanının uzunluğu"],
    answer: 0,
    explanation: "Qara səthlər ısı cəzəsini yaxşı saxlayır, açıq səthlər isə günəş ışığını geri yansıtar.",
  },
  {
    question: "Qarabağda meşə örtüyünün azalması hansı problemi artırır?",
    options: ["Topraq süləməsinin oxunması", "Hava qanadının artması", "Quşların sayının artması"],
    answer: 0,
    explanation: "Meşə kökleri torpaqı tutur; örtük düşərkdə torpaq daha asan oxunur.",
  },
  {
    question: "Su çevrəsində evapotranspirasiya nə deməkdir?",
    options: ["Torpaqdan və bitkilərdən su buxarına çevrilməsi", "Yalnız dənizdən su buzlaşması", "Yalnız yerüstündə səməyin gebildetilməsi"],
    answer: 0,
    explanation: "Evapotranspirasiya = evaparlaşma (torpaq) + transpirasiya (bitkilər).",
  },
  {
    question: "Hansı canlı bioindikator (ekosistem səhhliliyini göstərən göstəricidir)?",
    options: ["Qaraqarça kurt", "Şəhərdə yaşayan koşkuş", "Mevsimlik çiçəklər"],
    answer: 0,
    explanation: "Qaraqarça kurt ekosistemin səhliliyini və gıda zincirini göstərə bilər.",
  },
  {
    question: "Peyk sətonunda hansı rəng ən çox ısı cəzəsini saxlayır?",
    options: ["Qara rəng", "Açıq rəng", "Yalnız mavi rəng"],
    answer: 0,
    explanation: "Qara rəng günəş ışığını əyçə ısıya çevirərək daha çox saxlayır.",
  },
  {
    question: "Qarabağda yangın riskini artıran əsas faktor hansıdır?",
    options: ["Quruqluq və qara torpaq", "Yalnız yağışın artması", "Yalnız quşların sayısı"],
    answer: 0,
    explanation: "Quruqluq bitkiləri quruqluşdurar və yanmaq asanlaşdırır.",
  },
  {
    question: "Atmosferdə hansı iplikleva (gaz) ısı cəzəsini ən vahid saxlayır?",
    options: ["Metan (CH₄)", "Azot (N₂)", "Yalnız oksigen (O₂)"],
    answer: 0,
    explanation: "Metan boughton gazı sifatində ısı cəzəsini yaxşı saxlayır və kliməyə təsir göstərir.",
  },
  {
    question: "Qarabağ ekosistemində hansı faktor stationary (dövri)?",
    options: ["Rəf-sənaye və inşaat", "Mövsümi yağış və dặk dövrü", "Yalnız şehərdəki trafik"],
    answer: 1,
    explanation: "Mövsümi dəyişikliklər ekosistemdə stationary proses yaradırlar.",
  },
  {
    question: "Su hövzusunun yoxalması hansı problemi götürür?",
    options: ["Ekoton zonunun (su-sahil) azalması", "Yalnız quşların sayının artması", "Yalnız meşənin artması"],
    answer: 0,
    explanation: "Su hövzəsi azalırsa su-sahil ekoton zonu daralır və biodiversitet azalır.",
  },
  {
    question: "Ekoloji süstənlik (ecological footprint) nə deməkdir?",
    options: ["İnsanın təbii resursları istifadə edilməsi və təbii qabiliyyətinin aşılması", "Yalnız çöp yerinə salınması", "Yalnız ağaç_BUFFER.cüterilməsi"],
    answer: 0,
    explanation: "Ekologik süstənlik = insan təbii resursların tüketimi və təbii qabiliyyətinin məhdud olması.",
  },
];

export const lessons = [
  { subject: "Biologiya", tag: "Canlı sistemlər", title: "Meşə örtüyü və yaşayış mühiti", detail: "Bitki örtüyü dəyişikliyinin canlılara təsirini müşahidə et.", icon: "leaf" },
  { subject: "Coğrafiya", tag: "Məkan və iqlim", title: "Su, yüksəklik və yamac", detail: "Relyefin su və yerli iqlimlə əlaqəsini xəritədə tap.", icon: "mountain" },
  { subject: "İnformatika", tag: "3D · vizual", title: "Peyk məlumatını hekayələndir", detail: "Məlumatı qrafikə və interaktiv xəritə qatına çevir.", icon: "orbit" },
  { subject: "Musiqi", tag: "Səs dizaynı", title: "Ekosistemin səs xəritəsi", detail: "Dəyişən göstəriciləri səs ritminə və hekayəyə bağla.", icon: "audio" },
];

export const team = [
  {
    name: "Günay Sadıqova",
    subtitle: "Aqrar elmlər üzrə fəlsəfə doktoru, GDU-nun dosenti",
    role: "Layihə rəhbər",
  },
  {
    name: "İsfəndiyar Alverdiyev",
    subtitle: "Kimya elmləri doktoru, professor, GDU-nun dekanı",
    role: "Layihə pedaqoqu",
  },
  {
    name: "Prof. Dr. Harun Yalçın",
    subtitle: "Ege Universiteti, Ziraat Fakültesi, Bölüm Başkanı",
    role: "Layihə eksperti",
  },
  {
    name: "İbrahim Qurbanov",
    subtitle: "Azərbaycan Televiziya və Radio Verilişləri QSC-də Dublyaj redaksiyasının baş redaktoru",
    role: "Layihə səs montajçısı",
  },
  {
    name: "Fidan Sadıqova",
    subtitle: "Texniki mexanika və maşın mühəndisliyi kafedrası müəllimi",
    role: "Layihənin İT dəstəyi",
  },
  {
    name: "İkbal Aygün",
    subtitle: "Ege Üniversitesi Dr. Öğretim Üyesi, Ziraat Fakültesi, Tarım Makineleri ve Teknolojileri Mühendisliği bölümü",
    role: "Layihə pedaqoqu",
  },
  {
    name: "Günel Mocan",
    subtitle: "Mədəniyyət və sənət menejmenti",
    role: "Layihə iştirakçısı",
  },
  {
    name: "Hakan Adanacıoğlu",
    subtitle: "Ege Universitetinin professoru",
    role: "Elmi məsləhətçi",
  },
  {
    name: "Cəmilə Zeynallı",
    subtitle: "Kimya-Biologiya fakültəsi, Biologiya ixtisası 4-cü kurs tələbəsi",
    role: "Layihənin proqramçısı",
  },
];

export const leaderboard = [
  { place: "01", group: "Yaşıl İz", detail: "GDU biologiya komandası", score: 940, badge: "Tədqiqatçı" },
  { place: "02", group: "Dağ Səsi", detail: "Şuşa məktəb qrupu", score: 875, badge: "Müşahidəçi" },
  { place: "03", group: "Su Yolu", detail: "Gənc ekoloqlar", score: 810, badge: "Kəşfiyyatçı" },
];