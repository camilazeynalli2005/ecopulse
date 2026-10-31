import { CalendarDays } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { team } from "@/data/ecopulse";

export default function Layihe() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="about-section section-dark" id="layihe">
          <div className="page-width">
            <div className="section-heading section-heading-light">
              <div className="section-marker section-marker-light"><span>05</span><i /></div>
              <div>
                <span className="eyebrow">ELM · MƏDƏNİYYƏT · TEXNOLOGİYA</span>
                <h2>Yerə bağlı<br /><em>bir komanda.</em></h2>
              </div>
              <p>Gəncə Dövlət Universiteti və Ege Universitetinin müəllimləri, tədqiqatçıları və yaradıcı heyəti eyni məqsəddə birləşir.</p>
            </div>
            <div className="team-layout">
              <div className="team-copy"><span className="eyebrow">GDU × EGE UNİVERSİTETİ</span><h3>Elmi baxış,<br />yaradıcı <em>toxunuş.</em></h3><p>Biologiya-kimya laboratoriyasında başlayan hazırlıq Qarabağın sahə müşahidələri ilə genişlənir. Şagird və tələbələr elmi məlumatı öz müşahidəsi və səsi ilə danışmağı öyrənir.</p><div className="institution-chip"><div className="institution-seal">G</div><span><strong>Gəncə Dövlət Universiteti</strong><small>Biologiya-kimya fakültəsi · laboratoriya hazırlığı</small></span></div><div className="institution-chip"><div className="institution-seal seal-ege">E</div><span><strong>Ege Universiteti</strong><small>Akademik təfirdaşlıq · fənlərarası yanaşma</small></span></div></div>
              <div className="team-roster"><div className="team-roster-head"><span>LAYİHƏNİN ARXASINDA</span><span>09 NƏFƏR</span></div>{team.map((member, index) => (
                <div className="team-row" key={member.name}>
                  <span className="team-number">0{index + 1}</span>
                  <span className="team-person">
                    <strong>{member.name}</strong>
                    <small>{member.subtitle}</small>
                    <br />
                    <span className="team-role">{member.role}</span>
                  </span>
                  <span className="team-initials">{member.name.split(" ").map((part) => part[0]).join("")}</span>
                </div>
              ))}
              <div className="team-credit">Müxtəlif sahələr, eyni qayğı: Qarabağın təbiəti.</div></div>
            </div>
          </div>
        </section>

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
      </main>
      <Footer />
    </div>
  );
}
