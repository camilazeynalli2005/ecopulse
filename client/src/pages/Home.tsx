import { useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, ChevronRight, CircleDot, Compass, Droplets, Flame, Globe2, Leaf,
  LogOut, MapPin, Menu, Mountain, Satellite, Sparkles, Sprout, Trees, User, Users, Waves, X,
} from "lucide-react";
import AudioStoryPlayer from "@/components/ecopulse/AudioStoryPlayer";
import BeforeAfter from "@/components/ecopulse/BeforeAfter";
import GlobeCanvas from "@/components/ecopulse/GlobeCanvas";
import LearningLab from "@/components/ecopulse/LearningLab";
import QuizCertificate from "@/components/ecopulse/QuizCertificate";
import { trpc } from "@/lib/trpc";
import { lessons, locations, team, type EcoLocation } from "@/data/ecopulse";

const navItems = [
  { href: "#ekonbez", label: "Eko-nəbz" },
  { href: "#laboratoriya", label: "Laboratoriya" },
  { href: "#oyun", label: "Eco-Quiz" },
  { href: "#layihe", label: "Layihə" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState("user" as "user" | "teacher" | "admin");

  const meQuery = trpc.auth.me.useQuery();
  const devLogin = trpc.auth.devLogin.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    try {
      await devLogin.mutateAsync({ name: loginName.trim(), role: loginRole });
      setLoginOpen(false);
      setLoginName("");
    } catch (error) {
      alert("Giriş yapılamadı. Sunucu çalışıyor mu?");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const userData = meQuery.data as { name?: string | null; role?: string | null } | null;
  const isAuthenticated = userData !== null;
  const userRole = userData?.role;

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="EcoPulse ana səhifə">
          <img src="/logo.svg" alt="" width="40" height="40" />
          <span className="brand-name">eco<span>pulse</span><small>QARABAĞIN EKOLOJİK NƏBZİ</small></span>
        </a>
        <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Əsas naviqasiya">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a className="nav-demo" href="#ekonbez" onClick={() => setMenuOpen(false)}>Demoya qoşul <ArrowUpRight size={15} /></a>
        </nav>
        <div className="auth-area">
          {isAuthenticated ? (
            <div className="auth-user">
              <span className="auth-greeting">{userData?.name || "İstifadəçi"} <span className="auth-role">{userRole ? (userRole as string) === "teacher" ? "(Müəllim)" : (userRole as string) === "admin" ? "(Admin)" : "(Şagird / Tələbə)" : ""}</span></span>
              <button type="button" className="button button-dark button-small" onClick={handleLogout}>
                <LogOut size={14} /> Çıxış
              </button>
            </div>
          ) : (
            <button type="button" className="button button-dark button-small" onClick={() => setLoginOpen(true)}>
              <User size={14} /> Giriş
            </button>
          )}
        </div>
        <button className="mobile-menu" type="button" aria-label={menuOpen ? "Menyunu bağla" : "Menyunu aç"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
      {loginOpen && (
        <div className="login-dialog" role="dialog" aria-modal="true" aria-label="Giriş">
          <div className="login-dialog-overlay" onClick={() => setLoginOpen(false)} />
          <div className="login-dialog-content">
            <h3>Giriş yap</h3>
            <p className="login-note">Demo MVP — ad və rol daxil edin (şagird / müəllim / admin)</p>
            <form onSubmit={handleLogin} className="login-form">
              <label>Adınız<input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} required /></label>
              <label>Rolunuz
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as "user" | "teacher" | "admin")}>
                  <option value="user">Şagird / Tələbə</option>
                  <option value="teacher">Müəllim</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="login-actions">
                <button type="button" className="button button-gold button-small" onClick={() => setLoginOpen(false)}>İmtina</button>
                <button type="submit" className="button button-dark button-small" disabled={devLogin.isPending}>
                  {devLogin.isPending ? "Girilir…" : "Giriş yap"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-contours" aria-hidden="true" />
      <div className="hero-inner page-width">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> NASA SPACE APPS CHALLENGE · GƏNCƏ 2026</div>
          <h1>Qarabağın<br /><em>ekoloji</em> nəbzi<span className="hero-period">.</span></h1>
          <p className="hero-subtitle">İnteraktiv ekoloji məlumat və səsli tədris platforması</p>
          <p className="hero-description">Məlumatı kəşfə, kəşfi isə gələcəyin hekayəsinə çevir. Qarabağın dəyişən təbiətini gənc tədqiqatçılarla birlikdə araşdır.</p>
          <div className="hero-actions">
            <button type="button" className="button button-dark" onClick={onExplore}>Platformanı Sına (Demo) <ArrowDownRight size={17} /></button>
            <a className="quiet-link" href="#nece-isleyir">Layihəni tanı <ArrowRight size={15} /></a>
          </div>
          <div className="hero-notes"><span><span className="note-point" /> İnteraktiv ekoloji məlumat</span><span><span className="note-point note-point-gold" /> Səsli tədris platforması</span></div>
        </div>
        <div className="hero-visual">
          <div className="globe-note note-top"><span className="note-line" /><div><strong>39° 48′ Ş · 46° 45′ Ş</strong><small>QARABAĞ · YERDƏN 0° BAXIŞ</small></div></div>
          <div className="globe-stage"><GlobeCanvas /><span className="globe-orbit orbit-one" /><span className="globe-orbit orbit-two" /><div className="globe-tag"><MapPin size={13} fill="currentColor" /> QARABAĞ</div></div>
          <div className="globe-note note-bottom"><div className="live-indicator"><span /></div><div><strong>Bir planet, min hekayə</strong><small>Qlobusu sürüşdürərək fırlat</small></div><Compass size={21} strokeWidth={1.35} /></div>
          <span className="visual-index">01 / PLANETARIUM</span>
        </div>
      </div>
      <div className="hero-bottom page-width"><span>GDU × EGE UNİVERSİTETİ</span><span className="hero-bottom-line" /><span>DAHA YAŞIL SABAH ÜÇÜN ÖYRƏN</span></div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="intro-section page-width" id="nece-isleyir">
      <div className="section-marker"><span>01</span><i /></div>
      <div className="intro-headline"><span className="eyebrow">MƏLUMATDAN MƏNA YARAT</span><h2>Rəqəmləri deyil,<br /><em>dəyişimi</em> gör.</h2></div>
      <div className="intro-copy"><p>Ekoloji məlumat böyük görünə bilər. EcoPulse onu xəritəyə, müşahidəyə və yadda qalan səs hekayəsinə çevirir — beləliklə, təbiətdəki dəyişikliklər hər kəs üçün daha anlaşıqlı olur.</p><a href="#ekonbez" className="text-link">Necə işlədiyini kəşf et <ArrowDownRight size={15} /></a></div>
      <div className="steps-row">
        <article className="step-card"><span className="step-no">01 / GÖR</span><div className="step-icon step-icon-earth"><Satellite size={21} /></div><h3>Yuxarıdan bax</h3><p>Peyk vizuallarında meşə, su və ərazi izlərini müşahidə et.</p><span className="step-line" /></article>
        <article className="step-card"><span className="step-no">02 / MÜQAYİSƏ ET</span><div className="step-icon step-icon-water"><Activity size={21} /></div><h3>Dəyişimi izlə</h3><p>Vaxt sürgüsü ilə eyni məkanın iki dövrünü yanaşı araşdır.</p><span className="step-line" /></article>
        <article className="step-card"><span className="step-no">03 / DİNLƏ</span><div className="step-icon step-icon-sound"><Waves size={21} /></div><h3>Hekayəni duy</h3><p>Məlumatı ekosistemin səs ritminə və hekayəsinə çevir.</p><span className="step-line" /></article>
      </div>
      <div className="intro-pullquote"><span>“</span><p>Hər xəritə bir başlanğıcdır.<br />Hər müşahidə, sabaha verilən sual.</p><small>ECOPULSE TƏDRİS YANAŞMASI</small></div>
    </section>
  );
}

function RegionMap({ active, onChange }: { active: EcoLocation; onChange: (location: EcoLocation) => void }) {
  return (
    <div className="region-map-card">
      <div className="map-topline"><span><span className="map-topline-dot" /> EKOSİSTEM XƏRİTƏSİ</span><span>AZƏRBAYCAN · QARABAĞ</span></div>
      <div className="region-map-visual">
        <svg viewBox="0 0 700 430" className="region-map-svg" role="img" aria-label="Qarabağ regionunun stilizə edilmiş relyef xəritəsi">
          <defs>
            <linearGradient id="map-bg" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#e8eadc" /><stop offset="1" stopColor="#d9e0d1" /></linearGradient>
            <pattern id="map-dots" width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#738671" opacity=".24" /></pattern>
            <linearGradient id="map-river" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#7fa7a1" /><stop offset="1" stopColor="#a6c4b5" /></linearGradient>
          </defs>
          <rect width="700" height="430" fill="url(#map-bg)" />
          <rect width="700" height="430" fill="url(#map-dots)" />
          <path d="M-20 94c75-50 121 11 184-11s82-81 167-43 100 3 160-2 123 46 226-3M-15 130c76-52 120 9 186-12s91-67 163-39 98 7 162-1 131 38 220 0M-20 166c76-40 128 15 192-10s88-58 156-31 101 11 171 3 119 33 208-8M-20 211c78-42 138 15 201-10s77-45 144-25 102 13 180 6 132 25 204-11M-20 267c81-39 144 17 204-3s71-39 147-17 113 17 182 6 123 27 197-4M-20 327c82-34 146 12 206-5s91-40 161-21 91 19 176 12 130 22 187-9M-20 385c82-40 146 4 209-11s91-38 157-20 99 19 173 7 122 22 195-5" fill="none" stroke="#9dac95" strokeWidth="1" opacity=".44" />
          <path d="M34 49 104 80l55-18 64 29 22 65 57 15 33 54 67-10 18 53-39 43 23 69-71 53-87-26-32-59-63-4-32-57-67-11-16-82-48-43Z" fill="#cbd5c1" stroke="#8fa18e" strokeWidth="1.5" opacity=".62" />
          <path d="M472-10c-38 86-14 120-61 174s-50 91-82 126 10 82-25 153" fill="none" stroke="url(#map-river)" strokeWidth="11" opacity=".85" />
          <path d="M474-10c-38 86-14 120-61 174s-50 91-82 126 10 82-25 153" fill="none" stroke="#f4f3e8" strokeWidth="2" opacity=".82" />
          <path d="M188 44c45 22 77 20 107 54M95 209c56-14 82-7 130 12M427 316c57-28 89-28 149-9" fill="none" stroke="#fffef8" strokeWidth="4" opacity=".45" />
          <text x="34" y="39" className="map-small-label">KÜRSƏN VADİSİ</text><text x="524" y="390" className="map-small-label">DAĞ YAMACLARI</text><text x="542" y="43" className="map-map-label">QARABAĞ</text>
        </svg>
        {locations.map((location) => <button key={location.id} type="button" aria-pressed={active.id === location.id} aria-label={`${location.name} məkanını seç`} className={`map-pin ${active.id === location.id ? "active" : ""}`} style={{ left: `${location.marker.x}%`, top: `${location.marker.y}%`, "--pin-color": location.tone } as React.CSSProperties} onClick={() => onChange(location)}><span className="pin-core"><MapPin size={17} fill="currentColor" /></span><span className="pin-name">{location.shortName}</span></button>)}
        <div className="map-scale"><span /><span>0</span><span>15</span><span>30 km</span></div>
        <span className="map-compass">N<span>↑</span></span>
      </div>
      <div className="map-footer"><span><span className="map-footer-dot" /> 3 MÜŞAHİDƏ NÖQTƏSİ</span><span><CircleDot size={13} /> Seçmək üçün nöqtəyə toxun</span></div>
    </div>
  );
}

function MetricCard({ label, value, caption, icon: Icon }: { label: string; value: string; caption: string; icon: typeof Leaf }) {
  return <div className="metric-card"><div className="metric-head"><span>{label}</span><Icon size={16} strokeWidth={1.6} /></div><strong>{value}</strong><small>{caption}</small><div className="metric-rule"><span /></div></div>;
}

function EcoPulseSection({ active, onChange }: { active: EcoLocation; onChange: (location: EcoLocation) => void }) {
  const [slider, setSlider] = useState(51);
  return (
    <section className="ecopulse-section section-dark" id="ekonbez">
      <div className="page-width">
        <div className="section-heading section-heading-light">
          <div className="section-marker section-marker-light"><span>02</span><i /></div>
          <div><span className="eyebrow">QARABAĞIN EKO-NƏBZİ · ƏSAS MODUL</span><h2>Bir xəritə.<br /><em>Üç canlı hekayə.</em></h2></div>
          <p>Hansı bölgənin nəbzini dinləmək istəyirsən? Nöqtəni seç, zamanın izini sür və mənzərənin danışdıqlarına qulaq as.</p>
        </div>
        <div className="pulse-layout">
          <RegionMap active={active} onChange={onChange} />
          <aside className="region-detail">
            <div className="region-detail-top"><span className="eyebrow">SEÇİLMİŞ ƏRAZİ</span><span className="region-number">0{locations.findIndex((item) => item.id === active.id) + 1} / 03</span></div>
            <span className="region-coordinate"><MapPin size={14} /> {active.coordinates}</span>
            <h3>{active.name}</h3><p className="region-subtitle">{active.subtitle}</p>
            <p className="region-description">{active.insight}. Seçilmiş zonanın landşaftını və ekoloji ritmini birlikdə araşdır.</p>
            <div className="metric-grid">
              <MetricCard label="Bitki örtüyü" value={`${active.cover}%`} caption="demo indeksi" icon={Trees} />
              <MetricCard label="Su göstəricisi" value={`${active.water}%`} caption="demo indeksi" icon={Droplets} />
              <MetricCard label="Temperatur fərqi" value={active.temperature} caption="illüstrativ dəyər" icon={Activity} />
              <MetricCard label="Yanğın siqnalı" value={String(active.fireAlerts).padStart(2, "0")} caption="nümunə müşahidə" icon={Flame} />
            </div>
            <div className="demo-warning"><span className="warning-mark">i</span><span>Demo göstəriciləri. Canlı NASA müşahidəsi deyil.</span></div>
          </aside>
        </div>

        <div className="timeline-block">
          <div className="timeline-heading"><div><span className="eyebrow">ZAMAN MAŞINI · 2020 — İNDİ</span><h3>İllərin arasına <em>bax.</em></h3></div><p>Sürgünü hərəkət etdir, görünüşlərin arasındakı fərqi kəşf et.</p></div>
          <BeforeAfter location={active} value={slider} onChange={setSlider} />
        </div>

        <div className="story-block">
          <div className="story-intro"><span className="eyebrow">MƏLUMATIN SƏSİ VAR</span><h3>Dinlə. <em>Hiss et.</em><br />Anla.</h3><p>Seçilmiş bölgənin əhvalına uyğun demo səs mənzərəsini aç. Hekayəni isə brauzer nitqi ilə dinlə.</p></div>
          <AudioStoryPlayer location={active} />
        </div>
        <div className="data-source-note"><span>PLANLANAN MƏNBƏLƏR</span><i>NASA GIBS</i><i>Earthdata</i><i>Giovanni</i><span className="data-source-demo">Hazırkı görünüş · demo vizualları</span></div>
      </div>
    </section>
  );
}

function CurriculumSection() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="curriculum-area">
      <div className="curriculum-head"><div><span className="eyebrow">FƏNLƏRİN KƏSİŞİYİ</span><h3>Ekologiya <em>hamımızındır.</em></h3></div><p>Dörd fənn, bir ortaq sual: təbiətdə nə dəyişir?</p></div>
      <div className="lesson-tabs" role="tablist" aria-label="Fənlərarası tədris planı">{lessons.map((lesson, index) => <button key={lesson.subject} type="button" className={selected === index ? "active" : ""} role="tab" aria-selected={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span><strong>{lesson.subject}</strong><ChevronRight size={16} /></button>)}</div>
      <div className="lesson-detail"><div className={`lesson-symbol lesson-color-${selected}`}><span>{selected === 0 ? <Leaf size={25} /> : selected === 1 ? <Mountain size={25} /> : selected === 2 ? <Globe2 size={25} /> : <Waves size={25} />}</span></div><div><span className="eyebrow">{lessons[selected].tag}</span><h4>{lessons[selected].title}</h4><p>{lessons[selected].detail}</p></div><span className="lesson-count">DƏRS 0{selected + 1} / 04</span></div>
    </div>
  );
}

function LearningSection() {
  return (
    <section className="learning-section page-width" id="laboratoriya">
      <div className="section-heading section-heading-lightpaper">
        <div className="section-marker"><span>03</span><i /></div>
        <div><span className="eyebrow">TƏDRİS VƏ FƏNLƏRARASI LABORATORİYA</span><h2>Gənc gözlərlə<br /><em>araşdır.</em></h2></div>
        <p>Sadə müşahidədən elmi əsaslandırmaya qədər — hər kəsə öz səviyyəsində kəşf yeri var.</p>
      </div>
      <LearningLab />
      <CurriculumSection />
    </section>
  );
}

function GamificationSection() {
  const leaderboardQuery = trpc.leaderboard.list.useQuery({ limit: 10 });

  return (
    <section className="gamification-section" id="oyun">
      <div className="page-width">
        <div className="section-heading gamification-heading">
          <div className="section-marker"><span>04</span><i /></div>
          <div><span className="eyebrow">ÖYRƏN · OYNA · PAYLAŞ</span><h2>Kəşflərin <em>iz buraxsın.</em></h2></div>
          <p>Hər düzgün cavab yeni bir müşahidəyə aparır. Bilgini sınayıb, öz yaşıl nişanını götür.</p>
        </div>
        <QuizCertificate />
        <div className="leaderboard-section">
          <div className="leaderboard-intro"><span className="eyebrow">BİRLİKDƏ DAHA GÜCLÜ</span><h3>Yaşıl liderlər<br /><em>lövhəsi.</em></h3><p>Öyrənmə yarış deyil — amma bir-birimizdən öyrənmək həmişə ruhlandırır.</p><div className="leader-count"><Users size={16} /> Serverdə saxlanılan nəticələr</div></div>
          <div className="leaderboard-card">
            <div className="leaderboard-top"><span>SINIF VƏ KOMANDALAR</span><span>SERVERDƏKİ NƏTCƏDLƏR</span></div>
            {leaderboardQuery.isPending ? (
              <div className="form-note">Liderlər lövhəsi yüklenir…</div>
            ) : leaderboardQuery.data && leaderboardQuery.data.length > 0 ? (
              <>
                {leaderboardQuery.data.map((row, index) => (
                  <div className={`leader-row ${index === 0 ? "leader-first" : ""}`} key={row.userId}>
                    <span className="leader-place">{row.place}</span>
                    <span className="leader-medal">{index === 0 ? <Sparkles size={16} /> : <Sprout size={15} />}</span>
                    <span className="leader-name"><strong>{row.userName}</strong><small>{row.userEmail ?? ""}</small></span>
                    <span className="leader-badge">{row.observationCount} müşahidə</span>
                    <strong className="leader-score">{row.totalScore}<small>XP</small></strong>
                  </div>
                ))}
                <div className="leaderboard-foot"><span><span className="leader-dot" /> Serverdə saxlanılan nəticələr</span><a href="#laboratoriya">Müşahidə göndər <ArrowRight size={14} /></a></div>
              </>
            ) : (
              <div className="form-note">Hələ heç bir müşahidə qiymətləndirilməyib.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="about-section section-dark" id="layihe">
      <div className="page-width">
        <div className="section-heading section-heading-light">
          <div className="section-marker section-marker-light"><span>05</span><i /></div>
          <div><span className="eyebrow">ELM · MƏDƏNİYYƏT · TEXNOLOGİYA</span><h2>Yerə bağlı<br /><em>bir komanda.</em></h2></div>
          <p>Gəncə Dövlət Universiteti və Ege Universitetinin müəllimləri, tədqiqatçıları və yaradıcı heyəti eyni məqsəddə birləşir.</p>
        </div>
        <div className="team-layout">
          <div className="team-copy"><span className="eyebrow">GDU × EGE UNİVERSİTETİ</span><h3>Elmi baxış,<br />yaradıcı <em>toxunuş.</em></h3><p>Biologiya-kimya laboratoriyasında başlayan hazırlıq Qarabağın sahə müşahidələri ilə genişlənir. Şagird və tələbələr elmi məlumatı öz müşahidəsi və səsi ilə danışmağı öyrənir.</p><div className="institution-chip"><div className="institution-seal">G</div><span><strong>Gəncə Dövlət Universiteti</strong><small>Biologiya-kimya fakültəsi · laboratoriya hazırlığı</small></span></div><div className="institution-chip"><div className="institution-seal seal-ege">E</div><span><strong>Ege Universiteti</strong><small>Akademik tərəfdaşlıq · fənlərarası yanaşma</small></span></div></div>
          <div className="team-roster"><div className="team-roster-head"><span>LAYİHƏNİN ARXASINDA</span><span>09 NƏFƏR</span></div>{team.map((member, index) => (
          <div className="team-row" key={member.name}>
            <span className="team-number">0{index + 1}</span>
            <span className="team-person">
              <strong>{member.name}</strong>
              <small>{member.subtitle}</small>
              <span className="team-role">{member.role}</span>
            </span>
            <span className="team-initials">{member.name.split(" ").map((part) => part[0]).join("")}</span>
          </div>
        ))}
        <div className="team-credit">Müxtəlif sahələr, eyni qayğı: Qarabağın təbiəti.</div></div>
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section className="roadmap-section page-width">
      <div className="section-marker"><span>06</span><i /></div>
      <div className="roadmap-heading"><div><span className="eyebrow">MƏRHƏLƏLİ YOL XƏRİTƏSİ</span><h2>Bu gün demo,<br /><em>sabaha platforma.</em></h2></div><div className="roadmap-date"><CalendarDays size={17} /><span>HƏKATON MƏQSƏDİ<small>14–15 noyabr 2026 · Gəncə</small></span></div></div>
      <div className="roadmap-line"><i /></div>
      <div className="roadmap-grid">
        <article className="roadmap-card roadmap-now"><div className="roadmap-card-top"><span className="roadmap-phase">MƏRHƏLƏ 01</span><span className="roadmap-now-tag"><i /> DEMO</span></div><h3>Hakaton prototipi</h3><span className="roadmap-budget">14–15 noyabr 2026</span><p>Üç məkan · əvvəl/sonra müqayisəsi · nümunə səsli hekayə · 5 suallıq quiz · sertifikat.</p><div className="roadmap-progress"><span style={{ width: "73%" }} /></div><small className="progress-caption">İnteraktiv frontend prototipi</small></article>
        <article className="roadmap-card"><div className="roadmap-card-top"><span className="roadmap-phase">MƏRHƏLƏ 02</span><span className="roadmap-status">MVP · SINIF SINAĞI</span></div><h3>İşlək sinif demosu</h3><span className="roadmap-budget">1700 AZN mərhələsi</span><p>Tapşırıq ötürmə və müəllim üçün dörd kriteriyalı real qiymətləndirmə paneli.</p><div className="roadmap-next-tags"><span>Tapşırıq axını</span><span>Müəllim paneli</span></div></article>
        <article className="roadmap-card"><div className="roadmap-card-top"><span className="roadmap-phase">MƏRHƏLƏ 03</span><span className="roadmap-status">TAM PİLOT</span></div><h3>Bağlı məlumat, canlı dərs</h3><span className="roadmap-budget">6 ay · 55000 AZN texniki büdcə</span><p>NASA GIBS/Earthdata inteqrasiyası və 20 şagird, 15 tələbə üçün şəxsi kabinetlər.</p><div className="roadmap-next-tags"><span>Canlı NASA API</span><span>Komanda paylaşımı</span></div></article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main"><div className="footer-brand"><a className="brand brand-light" href="#top"><img src="/logo.svg" alt="" width="40" height="40" /><span className="brand-name">eco<span>pulse</span><small>QARABAĞIN EKOLOJİK NƏBZİ</small></span></a><p>Qarabağın ekoloji hekayəsini birlikdə araşdır.</p></div><div className="footer-links"><a href="#ekonbez">Eko-nəbz</a><a href="#laboratoriya">Laboratoriya</a><a href="#oyun">Eco-Quiz</a><a href="#layihe">Layihə haqqında</a></div><a className="footer-top" href="#top">Yuxarı qayıt <ArrowUpRight size={15} /></a></div>
      <div className="page-width footer-bottom"><span>© 2026 EcoPulse · GDU × Ege Universiteti</span><span className="footer-disclaimer"><span /> İnteraktiv təqdimat prototipi · demo göstəriciləri</span></div>
    </footer>
  );
}

export default function Home() {
  const [activeLocation, setActiveLocation] = useState(locations[0]);
  const explore = () => scrollTo("ekonbez");

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero onExplore={explore} />
        <IntroSection />
        <EcoPulseSection active={activeLocation} onChange={setActiveLocation} />
        <LearningSection />
        <GamificationSection />
        <TeamSection />
        <RoadmapSection />
      </main>
      <Footer />
      <a className="back-to-map" href="#ekonbez" aria-label="Eko-nəbz xəritəsinə keç"><MapPin size={15} /><span>Eko-nəbz</span></a>
    </div>
  );
}
