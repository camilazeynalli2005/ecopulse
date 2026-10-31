import { useState } from "react";
import { Award, ArrowRight, Check, ChevronRight, Download, Leaf, RotateCcw, Sparkles, Sprout, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { quizQuestions } from "@/data/ecopulse";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

type CertificateKind = "explorer" | "defender";

function safeText(value: string) {
  return value.replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[char] ?? char);
}

function downloadCertificate(name: string, kind: CertificateKind) {
  const title = kind === "explorer" ? "Qarabağ Çevrəçisi" : "Yaşıl Planet Müdafiəçisi";
  const displayName = safeText(name.trim() || "Gənc tədqiqatçı");
  const date = new Intl.DateTimeFormat("az-AZ", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fbfaf4"/><stop offset="1" stop-color="#eef0e2"/></linearGradient><linearGradient id="leaf" x2="1" y2="1"><stop stop-color="#315e48"/><stop offset="1" stop-color="#173e32"/></linearGradient></defs><rect width="1400" height="990" fill="url(#bg)"/><rect x="35" y="35" width="1330" height="920" rx="18" fill="none" stroke="#315e48" stroke-width="3"/><rect x="54" y="54" width="1292" height="882" rx="12" fill="none" stroke="#d9b869" stroke-width="1.5"/><circle cx="700" cy="200" r="68" fill="url(#leaf)"/><path d="M661 205c14-41 43-63 82-55-7 45-29 73-64 72-9-1-14-6-18-17Z" fill="none" stroke="#e2c777" stroke-width="5"/><path d="M670 211c13-4 20-5 27-2l9-19 10 32 9-22 9 11h22" fill="none" stroke="#f8f3e6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="700" y="330" text-anchor="middle" font-family="Georgia,serif" font-size="28" letter-spacing="5" fill="#788273">ECOPULSE · QARABAĞIN EKOLOJİK NƏBZİ</text><text x="700" y="431" text-anchor="middle" font-family="Georgia,serif" font-size="66" fill="#173e32">SERTİFİKAT</text><text x="700" y="505" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#627063">Bu sertifikat təsdiq edir ki</text><text x="700" y="605" text-anchor="middle" font-family="Georgia,serif" font-size="60" fill="#a27e33">${displayName}</text><path d="M400 632h600" stroke="#d9b869" stroke-width="2"/><text x="700" y="700" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#33493d">${title} adına layiq görülür</text><text x="700" y="756" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" fill="#69776b">Qarabağın ekoloji hekayələrini kəşf etdiyinə və</text><text x="700" y="788" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" fill="#69776b">yaşıl gələcək üçün öyrənməyə qatıldığına görə</text><text x="380" y="850" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#69776b">EcoPulse · Qarabağın ekoloji nəbzi</text><text x="700" y="900" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#69776b">${date}</text></svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 990;
    const context = canvas.getContext("2d");
    if (!context) { URL.revokeObjectURL(url); return; }
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((png) => {
      if (!png) return;
      const downloadUrl = URL.createObjectURL(png);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `ecopulse-sertifikat-${kind}.png`;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
    }, "image/png");
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

export default function Oyun() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CertificateKind>("explorer");
  const leaderboardQuery = trpc.leaderboard.list.useQuery({ limit: 10 });
  const question = quizQuestions[questionIndex];

  const nextQuestion = () => {
    if (selected === null) return;
    const nextScore = score + (selected === question.answer ? 1 : 0);
    setScore(nextScore);
    if (questionIndex === quizQuestions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((index) => index + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="gamification-section" id="oyun">
          <div className="page-width">
            <div className="section-heading gamification-heading">
              <div className="section-marker"><span>04</span><i /></div>
              <div>
                <span className="eyebrow">ÖYRƏN · OYNA · PAYLAŞ</span>
                <h2>Kəşflərin <em>iz buraxsın.</em></h2>
              </div>
              <p>Hər düzgün cavab yeni bir müşahidəyə aparır. Bilgini sınayıb, öz yaşıl nişanını götür.</p>
            </div>

            {/* Quiz */}
            <div className="game-grid">
              <section className="quiz-card" aria-labelledby="quiz-title">
                <div className="quiz-topline"><span className="eyebrow">ECO-QUIZ · 5 SUAL</span><span className="quiz-count">{finished ? "05" : String(questionIndex + 1).padStart(2, "0")} <i>/ 05</i></span></div>
                <div className="quiz-progress"><span style={{ width: `${finished ? 100 : ((questionIndex + (selected !== null ? 0.6 : 0)) / quizQuestions.length) * 100}%` }} /></div>
                {finished ? (
                  <div className="quiz-result"><div className="result-icon"><Award size={27} /></div><span className="eyebrow">SƏFƏR TAMAMLANDI</span><h3 id="quiz-title">{score} / 5 <span>düzgün cavab</span></h3><p>{score >= 4 ? "Əla iş! Qarabağın ekoloji nəbzini yaxşı oxuyursan." : "Yaxşı başlanğıcdır — xəritədə yenidən araşdırıb təkrar sınaya bilərsən."}</p><button className="text-link" type="button" onClick={restart}><RotateCcw size={15} /> Yenidən başla</button></div>
                ) : (
                  <>
                    <h3 className="quiz-question" id="quiz-title">{question.question}</h3>
                    <div className="quiz-options">{question.options.map((option, index) => {
                      const isSelected = selected === index;
                      const isCorrect = selected !== null && question.answer === index;
                      return (
                        <button key={option} className={`quiz-option ${isSelected ? "selected" : ""} ${selected !== null && isCorrect ? "correct" : ""} ${selected !== null && isSelected && !isCorrect ? "incorrect" : ""}`} type="button" disabled={selected !== null} onClick={() => setSelected(index)}>
                          <span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{selected !== null && isCorrect && <Check size={17} />}
                        </button>
                      );
                    })}</div>
                    {selected !== null && <p className="quiz-explanation">{question.explanation}</p>}
                    <div className="quiz-bottom"><span>{selected !== null ? "Cavab qeydə alındı" : "Bir cavab seç"}</span><button className="button button-dark button-small" type="button" disabled={selected === null} onClick={nextQuestion}>{questionIndex === quizQuestions.length - 1 ? "Nəticəni gör" : "Növbəti"} <ChevronRight size={15} /></button></div>
                  </>
                )}
              </section>

              <section className="certificate-card" aria-labelledby="certificate-title">
                <div className="certificate-top"><div className="cert-sparkle"><Sparkles size={18} /></div><span className="eyebrow">ÖYRƏNMƏNİ QEYD ET</span></div>
                <h3 id="certificate-title">Kiçik kəşfin,<br /><em>böyük iz.</em></h3>
                <p>Adını yaz, öz adına uyğun sertifikatı yaratı və PNG kimi saxla.</p>
                <label className="cert-name">Sertifikatda görünəcək ad<input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ad və soyad" maxLength={48} /></label>
                <div className="cert-types" role="group" aria-label="Sertifikat növü">
                  <button type="button" className={kind === "explorer" ? "active" : ""} onClick={() => setKind("explorer")}>
                    <span className="cert-type-icon"><Leaf size={16} /></span><span>Qarabağ<br /><strong>Çevrəçisi</strong></span>
                  </button>
                  <button type="button" className={kind === "defender" ? "active" : ""} onClick={() => setKind("defender")}>
                    <span className="cert-type-icon"><Award size={16} /></span><span>Yaşıl Planet<br /><strong>Müdafiəçisi</strong></span>
                  </button>
                </div>
                <div className="certificate-preview"><span className="preview-mark"><Leaf size={13} /></span><div><small>ECOPULSE · SERTİFİKAT</small><strong>{name.trim() || "Gənc tədqiqatçı"}</strong><span>{kind === "explorer" ? "Qarabağ Çevrəçisi" : "Yaşıl Planet Müdafiəçisi"}</span></div><span className="preview-seal"><Award size={18} /></span></div>
                <button className="button button-gold cert-download" type="button" onClick={() => downloadCertificate(name, kind)}><Download size={16} /> PNG sertifikatı yüklə</button>
                <span className="cert-disclaimer">Nümunəvi demo sertifikatı · imza tələb etmir</span>
              </section>
            </div>

            {/* Leaderboard */}
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
                    <div className="leaderboard-foot"><span><span className="leader-dot" /> Serverdə saxlanılan nəticələr</span><a href="/laboratoriya">Müşahidə göndər <ArrowRight size={14} /></a></div>
                  </>
                ) : (
                  <div className="form-note">Hələ heç bir müşahidə qiymətləndirilməyib.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
