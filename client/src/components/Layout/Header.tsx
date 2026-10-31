import { useState } from "react";
import { LogOut, Menu, User, ArrowUpRight, X } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type HeaderProps = {
  onExplore?: () => void;
};

const navItems = [
  { href: "/ekonbez", label: "Eko-nəbz" },
  { href: "/laboratoriya", label: "Laboratoriya" },
  { href: "/oyun", label: "Eco-Quiz" },
  { href: "/layihe", label: "Layihə" },
];

export default function Header({ onExplore }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState<"user" | "teacher" | "admin">("user");

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
        <Link href="/" className="brand" aria-label="EcoPulse ana səhifə">
          <img src="/logo.svg" alt="" width="40" height="40" />
          <span className="brand-name">eco<span>pulse</span><small>QARABAĞIN EKOLOJİK NƏBZİ</small></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Əsas naviqasiya">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a className="nav-demo" href="/ekonbez" onClick={() => setMenuOpen(false)}>
            Demoya qoşul <ArrowUpRight size={15} />
          </a>
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
        <button className="mobile-menu" type="button" aria-label={menuOpen ? "Menyunu bağla" : "Menyunu aç"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {loginOpen && (
        <div className="login-dialog" role="dialog" aria-modal="true" aria-label="Giriş">
          <div className="login-dialog-overlay" onClick={() => setLoginOpen(false)} />
          <div className="login-dialog-content">
            <h3>Giriş yap</h3>
            <p className="login-note">Demo MVP — ad və rol daxil edin (şagird / müəllim / admin)</p>
            <form onSubmit={handleLogin} className="login-form">
              <label>
                Adınız<input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} required />
              </label>
              <label>
                Rolunuz
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as "user" | "teacher" | "admin")}>
                  <option value="user">Şagird / Tələbə</option>
                  <option value="teacher">Müəllim</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="login-actions">
                <button type="button" className="button button-gold button-small" onClick={() => setLoginOpen(false)}>
                  İmtina
                </button>
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
