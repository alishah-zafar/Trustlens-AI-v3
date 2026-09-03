import { useState, useEffect, useRef } from "react";
import { useLang } from "../../LangContext";
import { LANGUAGES, type Language } from "../../i18n";
import { Shield, Menu, X, Globe, ChevronDown, Check } from "lucide-react";

interface NavbarProps {
  lang: string;
  onLangChange: (lang: string) => void;
  onNavigate?: (section: string) => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "scan", label: "Scan" },
  { id: "history", label: "History" },
  { id: "intelligence", label: "Pakistan Intelligence" },
];

export default function Navbar({ lang, onLangChange, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setMobileOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-base/95 border-b border-line shadow-lg shadow-black/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => onNavigate?.("home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold text-txt tracking-tight">
                Trust<span className="text-accent">Lens</span>
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className="px-3 py-2 text-sm text-txt-muted hover:text-txt transition-colors rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side: lang + scan button */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-xs text-txt-muted bg-base-card border border-line rounded px-2.5 py-1.5 hover:border-txt-dim/30 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{current.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-base-card border border-line rounded-lg shadow-xl shadow-black/50 py-1 z-50 min-w-[160px]">
                    {LANGUAGES.map((l: Language) => (
                      <button
                        key={l.code}
                        onClick={() => { onLangChange(l.code); setLangOpen(false); }}
                        className={`w-full text-start px-3 py-2.5 text-xs transition-colors flex items-center justify-between gap-3 ${
                          l.code === lang ? "text-accent bg-accent/10" : "text-txt-muted hover:bg-white/5 hover:text-txt"
                        }`}
                      >
                        <span>{l.name}</span>
                        {l.code === lang && <Check className="w-3.5 h-3.5 text-accent" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => onNavigate?.("scan")} className="cta-btn text-sm py-2 px-5">
                Scan Now
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-txt-muted hover:text-txt transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-base border-l border-line p-6 pt-20 flex flex-col gap-2 animate-slide-in-right">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate?.(item.id); setMobileOpen(false); }}
                className="w-full text-start px-4 py-3 text-sm text-txt-muted hover:text-txt hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-4 pt-4 border-t border-line space-y-2">
              {LANGUAGES.map((l: Language) => (
                <button
                  key={l.code}
                  onClick={() => { onLangChange(l.code); setMobileOpen(false); }}
                  className={`w-full text-start px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                    l.code === lang ? "text-accent bg-accent/10" : "text-txt-muted hover:bg-white/5"
                  }`}
                >
                  <span>{l.name}</span>
                  {l.code === lang && <Check className="w-4 h-4 text-accent" />}
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button
                onClick={() => { onNavigate?.("scan"); setMobileOpen(false); }}
                className="cta-btn w-full text-sm"
              >
                Scan Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
