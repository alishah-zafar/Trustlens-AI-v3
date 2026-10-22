import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLang } from "../LangContext";
import { LANGUAGES, type Language } from "../i18n";
import { Shield, Menu, X, Globe, ChevronDown, Check } from "lucide-react";

export default function Layout() {
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const navItems = [
    { path: "/", label: t.nav.home },
    { path: "/analyze", label: t.nav.analyze },
    { path: "/history", label: t.nav.history },
    { path: "/extension", label: lang === "urdu" ? "ایکسٹینشن" : "Extension" },
    { path: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={lang === "urdu" ? "rtl" : "ltr"}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-base/95 backdrop-blur-sm border-b transition-all duration-200 ${
        scrolled ? "border-accent/25 shadow-[0_10px_30px_rgba(0,0,0,0.55)]" : "border-accent/10 shadow-lg shadow-black/40"
      }`}>
        <div className="w-full px-6 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Trust<span className="text-accent">Lens</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-[1.1rem] rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-white bg-accent/15"
                      : "text-white/70 hover:text-white hover:bg-accent/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: lang + CTA */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-sm text-white/70 bg-base-card border border-line rounded px-2.5 py-2 hover:border-accent/40 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{current.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-base-card border border-line rounded-lg shadow-xl shadow-black/60 py-1 z-50 min-w-[140px]">
                    {LANGUAGES.map((l: Language) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full text-start px-3 py-2 text-xs transition-colors flex items-center justify-between gap-3 ${
                          l.code === lang ? "text-accent bg-accent/10" : "text-txt-muted hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{l.name}</span>
                        {l.code === lang && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/analyze" className="bg-accent text-white text-base font-semibold px-5 py-2.5 rounded-md hover:bg-accent-light transition-all shadow-lg shadow-accent/30">
                {t.heroCta}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-txt-muted hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-base border-l border-line p-5 pt-[86px] flex flex-col gap-1 animate-slide-in-right">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 text-sm rounded-md transition-colors ${
                  location.pathname === item.path ? "text-white bg-white/8" : "text-txt-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-line space-y-1">
              {LANGUAGES.map((l: Language) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setMobileOpen(false); }}
                  className={`w-full text-start px-4 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    l.code === lang ? "text-accent bg-accent/10" : "text-txt-muted hover:bg-white/5"
                  }`}
                >
                  <span>{l.name}</span>
                  {l.code === lang && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>
            <div className="mt-auto">
              <Link to="/analyze" className="block text-center bg-accent text-white text-sm font-semibold py-2.5 rounded-md hover:bg-accent-light transition-colors">
                {t.heroCta}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 pt-[70px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-base py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-sm font-bold text-white">
                Trust<span className="text-accent">Lens</span>
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs text-txt-dim">
              <Link to="/about" className="hover:text-white transition-colors">{t.footerLinks.about}</Link>
              <Link to="/history" className="hover:text-white transition-colors">{t.footerLinks.history}</Link>
              <Link to="/extension" className="hover:text-white transition-colors">{lang === "urdu" ? "ایکسٹینشن" : "Extension"}</Link>
              <a href="#" className="hover:text-white transition-colors">{t.footerLinks.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footerLinks.terms}</a>
            </div>
          </div>
          <p className="text-center text-xs text-txt-dim mt-4">
            &copy; {new Date().getFullYear()} {t.rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
