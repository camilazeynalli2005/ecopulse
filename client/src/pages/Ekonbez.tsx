import { useState } from "react";
import { Trees, Droplets, Activity, Flame, MapPin, CircleDot } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AudioStoryPlayer from "@/components/ecopulse/AudioStoryPlayer";
import BeforeAfter from "@/components/ecopulse/BeforeAfter";
import { locations, type EcoLocation } from "@/data/ecopulse";

function MetricCard({ label, value, caption, icon: Icon }: { label: string; value: string; caption: string; icon: typeof Trees }) {
  return (
    <div className="metric-card">
      <div className="metric-head"><span>{label}</span><Icon size={16} strokeWidth={1.6} /></div>
      <strong>{value}</strong>
      <small>{caption}</small>
      <div className="metric-rule"><span /></div>
    </div>
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
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            aria-pressed={active.id === location.id}
            aria-label={`${location.name} məkanını seç`}
            className={`map-pin ${active.id === location.id ? "active" : ""}`}
            style={{ left: `${location.marker.x}%`, top: `${location.marker.y}%`, "--pin-color": location.tone } as React.CSSProperties}
            onClick={() => onChange(location)}
          >
            <span className="pin-core"><MapPin size={17} fill="currentColor" /></span>
            <span className="pin-name">{location.shortName}</span>
          </button>
        ))}
        <div className="map-scale"><span /><span>0</span><span>15</span><span>30 km</span></div>
        <span className="map-compass">N<span>↑</span></span>
      </div>
      <div className="map-footer"><span><span className="map-footer-dot" /> 3 MÜŞAHİDƏ NÖQTƏSİ</span><span><CircleDot size={13} /> Seçmək üçün nöqtəyə toxun</span></div>
    </div>
  );
}

export default function Ekonbez() {
  const [activeLocation, setActiveLocation] = useState(locations[0]);
  const [slider, setSlider] = useState(51);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="ecopulse-section section-dark" id="ekonbez">
          <div className="page-width">
            <div className="section-heading section-heading-light">
              <div className="section-marker section-marker-light"><span>02</span><i /></div>
              <div>
                <span className="eyebrow">QARABAĞIN EKO-NƏBZİ · ƏSAS MODUL</span>
                <h2>Bir xəritə.<br /><em>Üç canlı hekayə.</em></h2>
              </div>
              <p>Hansı bölgenin nəbzini dinləmək istəyirsən? Nöqtəni seç, zamanın izini sür və mənzərənin danışdıqlarına qulaq as.</p>
            </div>
            <div className="pulse-layout">
              <RegionMap active={activeLocation} onChange={setActiveLocation} />
              <aside className="region-detail">
                <div className="region-detail-top">
                  <span className="eyebrow">SEÇİLMİŞ ƏRAZİ</span>
                  <span className="region-number">0{locations.findIndex((item) => item.id === activeLocation.id) + 1} / 03</span>
                </div>
                <span className="region-coordinate"><MapPin size={14} /> {activeLocation.coordinates}</span>
                <h3>{activeLocation.name}</h3>
                <p className="region-subtitle">{activeLocation.subtitle}</p>
                <p className="region-description">{activeLocation.insight}. Seçilmiş zonanın landşaftını və ekoloji ritmini birlikdə araşdır.</p>
                <div className="metric-grid">
                  <MetricCard label="Bitki örtüyü" value={`${activeLocation.cover}%`} caption="demo indeksi" icon={Trees} />
                  <MetricCard label="Su göstəricisi" value={`${activeLocation.water}%`} caption="demo indeksi" icon={Droplets} />
                  <MetricCard label="Temperatur fərqi" value={activeLocation.temperature} caption="illüstrativ dəyər" icon={Activity} />
                  <MetricCard label="Yanğın siqnalı" value={String(activeLocation.fireAlerts).padStart(2, "0")} caption="nümunə müşahidə" icon={Flame} />
                </div>
                <div className="demo-warning"><span className="warning-mark">i</span><span>Demo göstəriciləri. Canlı NASA müşahidəsi deyil.</span></div>
              </aside>
            </div>

            <div className="timeline-block">
              <div className="timeline-heading">
                <div>
                  <span className="eyebrow">ZAMAN MAŞINI · 2020 — İNDİ</span>
                  <h3>İllərin arasına <em>bax.</em></h3>
                </div>
                <p>Sürgünü hərəkət etdir, görünüşlərin arasındakı fərqi kəşf et.</p>
              </div>
              <BeforeAfter location={activeLocation} value={slider} onChange={setSlider} />
            </div>

            <div className="story-block">
              <div className="story-intro">
                <span className="eyebrow">MƏLUMATIN SƏSİ VAR</span>
                <h3>Dinlə. <em>Hiss et.</em><br />Anla.</h3>
                <p>Seçilmiş bölgenin əhvalına uyğun demo səs mənzərəsini aç. Hekayəni isə brauzer nitqi ilə dinlə.</p>
              </div>
              <AudioStoryPlayer location={activeLocation} />
            </div>

            <div className="data-source-note">
              <span>PLANLANAN MƏNBƏLƏR</span>
              <i>NASA GIBS</i>
              <i>Earthdata</i>
              <i>Giovanni</i>
              <span className="data-source-demo">Hazırkı görünüş · demo vizualları</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
