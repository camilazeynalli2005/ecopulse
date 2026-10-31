import { useState } from "react";
import { BookOpen, Check, ChevronRight, ClipboardCheck, Droplets, Flame, Leaf, Send, Thermometer, Volume2, Wind, Globe2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

type Level = "school" | "university";
const criteria = [
  { title: "Elmi müşahidə", score: 4, note: "Dəqiq yer və tarix seçimi" },
  { title: "Məlumatdan istifadə", score: 3, note: "Mənbə ilə göstərici əlaqəsi" },
  { title: "Nəticənin əsaslandırılması", score: 4, note: "Sübutla qurulan fikir" },
  { title: "Komanda işi", score: 5, note: "Birgə bölüşülmüş tapşırıq" },
];

export default function Laboratoriya() {
  const [level, setLevel] = useState<Level>("school");
  const [submitted, setSubmitted] = useState(false);
  const [place, setPlace] = useState("Topxana meşəsi");
  const [observation, setObservation] = useState("");
  const [finding, setFinding] = useState("");
  const [scores, setScores] = useState(criteria.map((item) => item.score));

  const createObservation = trpc.observation.create.useMutation();
  const createGrade = trpc.grade.create.useMutation();
  const observationList = trpc.observation.list.useQuery({ status: undefined });
  const isTeacher = observationList.data?.some(() => true) ?? false;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (level === "school") {
      if (!observation.trim() || !finding.trim()) return;

      try {
        await createObservation.mutateAsync({
          location: place,
          content: `${finding.trim()}. ${observation.trim()}`,
        });
        setSubmitted(true);
      } catch (error) {
        console.error("[Observation] Create failed:", error);
        alert("Müşahidəni saxlamaq mümkün olmadı. Giriş yapmış olduğunuzdan emin olun.");
      }
    } else {
      setSubmitted(true);
    }
  };

  const submitGrade = async () => {
    if (!observationList.data?.length) {
      alert("Qiymətləndiriləcək müşahidə tapılmadı.");
      return;
    }

    const totalScore = scores.reduce((a, b) => a + b, 0);

    try {
      await createGrade.mutateAsync({
        observationId: observationList.data[0].id,
        scientificObservation: scores[0],
        dataUsage: scores[1],
        resultJustification: scores[2],
        teamwork: scores[3],
        feedback: "",
      });
      alert("Qiymətləndirmə saxlanıldı.");
    } catch (error) {
      console.error("[Grade] Create failed:", error);
      alert("Qiymətləndirme saxlanmaq mümkün olmadı.");
    }
  };

  const previewStory = () => {
    if (!("speechSynthesis" in window) || !observation.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${finding.trim() || "Mənim ekoloji müşahidəm"}. ${observation.trim()}`);
    utterance.lang = "az-AZ";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="learning-section page-width" id="laboratoriya">
          <div className="section-heading section-heading-lightpaper">
            <div className="section-marker"><span>03</span><i /></div>
            <div>
              <span className="eyebrow">TƏDRİS VƏ FƏNLƏRARASI LABORATORİYA</span>
              <h2>Gənc gözlərlə<br /><em>araşdır.</em></h2>
            </div>
            <p>Sadə müşahidədən elmi əsaslandırmaya qədər — hər kəsə öz səviyyəsində kəşf yeri var.</p>
          </div>

          <div className="lab-shell">
            <div className="lab-tabs" role="tablist" aria-label="Tədris səviyyəsi">
              <button
                className={level === "school" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={level === "school"}
                onClick={() => setLevel("school")}
              >
                <span className="tab-index">01</span>
                <span>
                  <strong>Orta məktəb</strong>
                  <small>20 nəfərlik pilot qrupu</small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                className={level === "university" ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={level === "university"}
                onClick={() => setLevel("university")}
              >
                <span className="tab-index">02</span>
                <span>
                  <strong>Universitet</strong>
                  <small>15 nəfərlik pilot qrupu</small>
                </span>
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="lab-content">
              <div className="lab-workspace">
                <div className="lab-panel-head">
                  <div>
                    <span className="eyebrow">{level === "school" ? "Müşahidə dəftəri" : "Tədqiqat paneli"}</span>
                    <h3>{level === "school" ? "Öz kəşfini qeyd et" : "Məlumatı təhlil et"}</h3>
                  </div>
                  <div className="lab-stamp">{level === "school" ? <BookOpen size={18} /> : <ClipboardCheck size={18} />}</div>
                </div>

                {level === "school" ? (
                  <form className="observation-form" onSubmit={submit}>
                    <label>
                      Ərazini seç
                      <select value={place} onChange={(event) => setPlace(event.target.value)}>
                        <option>Topxana meşəsi</option>
                        <option>Kəlbəcər</option>
                        <option>Laçın</option>
                      </select>
                    </label>
                    <label>
                      Müşahidən nədir?
                      <textarea
                        value={observation}
                        onChange={(event) => setObservation(event.target.value)}
                        placeholder="Məsələn: Yamacın kölgəli hissəsində bitki örtüyü daha sıx görünür…"
                        required
                        rows={3}
                      />
                    </label>
                    <label>
                      Hekayenin başlığı
                      <input
                        value={finding}
                        onChange={(event) => setFinding(event.target.value)}
                        placeholder="Mənim yaşıl müşahidəm"
                        required
                      />
                    </label>
                    <button type="button" className="story-preview-button" onClick={previewStory} disabled={!observation.trim()}>
                      <Volume2 size={15} /> Yazdığın hekayəni dinlə
                    </button>
                    <button type="submit" className="button button-dark button-small" disabled={createObservation.isPending}>
                      <Send size={15} /> {submitted ? "Yenidən göndər" : createObservation.isPending ? "Gönderilir…" : "Müşahidəni saxla"}
                    </button>
                    {submitted && (
                      <div className="form-confirm">
                        <Check size={16} />
                        <span>“{finding}” qeði serverdə saxlanıldı — {place}.</span>
                      </div>
                    )}
                    <p className="form-note">Hekayə brauzer nitqi ilə səslənir; qeyd serverdə saxlanır və müəllimə görünür.</p>
                  </form>
                ) : (
                  <div className="research-panel">
                    <div className="research-intro">
                      <span className="demo-pill">NÜMUNƏ ANALİTİKASI</span>
                      <p>Demo göstəriciləri ilə ekoloji dəyişikliklər arasındakı əlaqəni araşdır.</p>
                    </div>
                    <div className="data-table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>İl</th>
                            <th>Temperatur</th>
                            <th>Yaşıllıq indeksi</th>
                            <th>Rütubət</th>
                            <th>Yanğın siqnalı</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>2019</td>
                            <td>12.8°</td>
                            <td>0.62</td>
                            <td>62%</td>
                            <td><span className="table-safe">Aşağı</span></td>
                          </tr>
                          <tr>
                            <td>2022</td>
                            <td>13.4°</td>
                            <td>0.58</td>
                            <td>58%</td>
                            <td><span className="table-watch">Orta</span></td>
                          </tr>
                          <tr>
                            <td>2025</td>
                            <td>13.1°</td>
                            <td>0.66</td>
                            <td>65%</td>
                            <td><span className="table-safe">Aşağı</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="research-chart" role="img" aria-label="Demo illəri üzrə yaşıllıq indeksi qrafiki">
                      <div className="chart-axis"><span>0.7</span><span>0.5</span><span>0.3</span></div>
                      <div className="chart-bars">
                        <div className="chart-bar-col">
                          <div className="chart-bar bar-2019" /><span>2019</span>
                        </div>
                        <div className="chart-bar-col">
                          <div className="chart-bar bar-2022" /><span>2022</span>
                        </div>
                        <div className="chart-bar-col">
                          <div className="chart-bar bar-2025" /><span>2025</span>
                        </div>
                        <div className="chart-line"><i /><i /><i /></div>
                      </div>
                    </div>
                    <form className="observation-form research-task-form" onSubmit={submit}>
                      <label>
                        Tapşırığın başlığı
                        <input
                          value={finding}
                          onChange={(event) => setFinding(event.target.value)}
                          placeholder="Ekoloji üzrə elmi müşahidə"
                          required
                        />
                      </label>
                      <label>
                        Elmi əsaslandırma
                        <textarea
                          value={observation}
                          onChange={(event) => setObservation(event.target.value)}
                          rows={2}
                          placeholder="Göstəricilər arasında hansı əlaqəni müşahidə etdin?"
                          required
                        />
                      </label>
                      <button type="submit" className="button button-dark button-small" disabled={createObservation.isPending}>
                        <Send size={15} /> {submitted ? "Demo tapşırığını yenilə" : createObservation.isPending ? "Gönderilir…" : "Tapşırığı demo olaraq göndər"}
                      </button>
                      {submitted && (
                        <div className="form-confirm">
                          <Check size={16} />
                          <span>“{finding}” tapşırığı serverdə qeydə alındı.</span>
                        </div>
                      )}
                    </form>
                    <p className="form-note">Rəqəmlər təqdimat üçün nümunədir; NASA Earthdata ilə qoşulmayıb. Tapşırıq serverdə saxlanır.</p>
                  </div>
                )}
              </div>

              <aside className="teacher-panel">
                <div className="teacher-head">
                  <div>
                    <span className="eyebrow">MÜƏLLİM ÜÇÜN</span>
                    <h3>Qiymətləndirmə</h3>
                  </div>
                  <span className="teacher-status"><i /> {observationList.isPending ? "Yüklenir…" : observationList.data ? "Hazır" : "DEMO"}</span>
                </div>
                <p className="teacher-subtitle">Komanda · <strong>Yaşıl İz</strong><br />Tapşırıq · Meşə örtüyü müşahidəsi</p>
                {observationList.isPending ? (
                  <div className="form-note">Müşahidələr yüklenir…</div>
                ) : observationList.data && observationList.data.length > 0 ? (
                  <>
                    <div className="criteria-list">
                      {criteria.map((item, index) => (
                        <div className="criteria-item" key={item.title}>
                          <div className="criteria-copy">
                            <span className="criteria-num">0{index + 1}</span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>{item.note}</small>
                            </span>
                          </div>
                          <div className="score-dots" role="group" aria-label={`${item.title} üçün bal`}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <button
                                type="button"
                                className={i < scores[index] ? "filled" : ""}
                                aria-label={`${i + 1} bal seç`}
                                aria-pressed={scores[index] === i + 1}
                                onClick={() =>
                                  setScores((previous) => previous.map((score, scoreIndex) => scoreIndex === index ? i + 1 : score))}
                                key={i}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="teacher-total">
                      <span>Ümumi nəticə</span>
                      <strong>{scores.reduce((total, score) => total + score, 0)} <small>/ 20</small></strong>
                    </div>
                    <button type="button" className="button button-dark button-small" onClick={submitGrade} disabled={createGrade.isPending}>
                      <Send size={15} /> {createGrade.isPending ? "Saxlanılır…" : "Qiymətləndirmeyi saxla"}
                    </button>
                  </>
                ) : (
                  <div className="form-note">Qiymətləndiləcək müşahidə tapılmadı. Öncə bir şagird müşahidə göndərməlidir.</div>
                )}
                <button type="button" className="text-link teacher-link" onClick={() => document.getElementById("oyun")?.scrollIntoView({ behavior: "smooth" })}>
                  Eco-Quiz-ə keç <ChevronRight size={15} />
                </button>
              </aside>
            </div>

            <div className="indicator-strip">
              <span><Thermometer size={16} /> Temperatur</span>
              <span><Flame size={16} /> Yanğın</span>
              <span><Droplets size={16} /> Rütubət</span>
              <span><Leaf size={16} /> Bitki örtüyü</span>
              <span className="indicator-caption"><Wind size={16} /> Məlumat laboratoriyası · nümayiş rejimi</span>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="curriculum-area">
            <div className="curriculum-head">
              <div>
                <span className="eyebrow">FƏNLƏRİN KƏSİŞİYİ</span>
                <h3>Ekologiya <em>hamımızındır.</em></h3>
              </div>
              <p>Dörd fənn, bir ortaq sual: təbiətdə nə dəyişir?</p>
            </div>
            <div className="lesson-tabs" role="tablist" aria-label="Fənlərarası tədris planı">
              {[0, 1, 2, 3].map((index) => {
                const lesson = ["Biologiya", "Coğrafiya", "İnformatika", "Musiqi"][index];
                return (
                  <button
                    key={lesson}
                    type="button"
                    role="tab"
                    aria-selected={index === 2}
                    onClick={() => {}}
                  >
                    <span>0{index + 1}</span>
                    <strong>{lesson}</strong>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
            <div className="lesson-detail">
              <div className="lesson-symbol lesson-color-2"><Globe2 size={25} /></div>
              <div>
                <span className="eyebrow">3D · vizual</span>
                <h4>Peyk məlumatını hekayələndir</h4>
                <p>Məlumatı qrafikə və interaktiv xəritə qatına çevir.</p>
              </div>
              <span className="lesson-count">DƏRS 03 / 04</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
