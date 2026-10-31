import { Activity, ArrowDownRight, ArrowRight, Satellite, Waves } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import GlobeCanvas from "@/components/ecopulse/GlobeCanvas";

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
          <div className="globe-stage"><GlobeCanvas /><span className="globe-orbit orbit-one" /><span className="globe-orbit orbit-two" /><div className="globe-tag">QARABAĞ</div></div>
          <div className="globe-note note-bottom"><div className="live-indicator"><span /></div><div><strong>Bir planet, min hekayə</strong><small>Qlobusu sürüşdürərək fırlat</small></div></div>
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
      <div className="intro-copy"><p>Ekoloji məlumat böyük görünə bilər. EcoPulse onu xəritəyə, müşahidəyə və yadda qalan səs hekayasına çevirir — beləliklə, təbiətdəki dəyişikliklər hər kəs üçün daha anlaşıqlı olur.</p><a href="/ekonbez" className="text-link">Necə işlədiyini kəşf et <ArrowDownRight size={15} /></a></div>
      <div className="steps-row">
        <article className="step-card"><span className="step-no">01 / GÖR</span><div className="step-icon step-icon-earth"><Satellite size={21} /></div><h3>Yuxarıdan bax</h3><p>Peyk vizuallarında meşə, su və ərazi izlərini müşahidə et.</p><span className="step-line" /></article>
        <article className="step-card"><span className="step-no">02 / MÜQAYİSƏ ET</span><div className="step-icon step-icon-water"><Activity size={21} /></div><h3>Dəyişimi izlə</h3><p>Vaxt sürgüsü ilə eyni məkanın iki dövrünü yanaşı araşdır.</p><span className="step-line" /></article>
        <article className="step-card"><span className="step-no">03 / DİNLƏ</span><div className="step-icon step-icon-sound"><Waves size={21} /></div><h3>Hekayəni duy</h3><p>Məlumatı ekosistemin səs ritminə və hekayəsinə çevir.</p><span className="step-line" /></article>
      </div>
      <div className="intro-pullquote"><span>“</span><p>Hər xəritə bir başlanğıcdır.<br />Hər müşahidə, sabaha verilən sual.</p><small>ECOPULSE TƏDRİS YANAŞMASI</small></div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero onExplore={() => { window.location.href = "/ekonbez"; }} />
        <IntroSection />
      </main>
      <Footer />
    </div>
  );
}
