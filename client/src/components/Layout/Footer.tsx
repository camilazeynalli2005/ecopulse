import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand brand-light" aria-label="EcoPulse ana səhifə">
            <img src="/logo.svg" alt="" width="40" height="40" />
            <span className="brand-name">eco<span>pulse</span><small>QARABAĞIN EKOLOJİK NƏBZİ</small></span>
          </Link>
          <p>Qarabağın ekoloji hekayəsini birlikdə araşdır.</p>
        </div>
        <div className="footer-links">
          <Link href="/ekonbez">Eko-nəbz</Link>
          <Link href="/laboratoriya">Laboratoriya</Link>
          <Link href="/oyun">Eco-Quiz</Link>
          <Link href="/layihe">Layihə haqqında</Link>
        </div>
        <a className="footer-top" href="#top">
          Yuxarı qayıt <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="page-width footer-bottom">
        <span>© 2026 EcoPulse · GDU × Ege Universiteti</span>
        <span className="footer-disclaimer">
          <span /> İnteraktiv təqdimat prototipi · demo göstəriciləri
        </span>
      </div>
    </footer>
  );
}
