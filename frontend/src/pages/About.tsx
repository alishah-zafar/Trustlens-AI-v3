import { Shield, Brain, Globe, Link2 } from "lucide-react";
import { useLang } from "../LangContext";

export default function About() {
  const { t } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Trust<span className="text-accent">Lens</span> AI
        </h1>
        <p className="text-base text-txt-muted">
          {t.aboutPage.tagline}
        </p>
      </div>

      {/* What we do */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3">{t.aboutPage.whatTitle}</h2>
        <p className="text-sm text-txt-muted leading-relaxed mb-4">
          {t.aboutPage.whatP1}
        </p>
        <p className="text-sm text-txt-muted leading-relaxed">
          {t.aboutPage.whatP2}
        </p>
      </section>

      {/* Why it matters */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3">{t.aboutPage.whyTitle}</h2>
        <p className="text-sm text-txt-muted leading-relaxed">
          {t.aboutPage.whyP}
        </p>
      </section>

      {/* Capabilities */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">{t.aboutPage.capTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 theme-card">
            <Brain className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white">{t.aboutPage.capAiTitle}</h3>
              <p className="text-xs text-txt-muted mt-1">{t.aboutPage.capAiDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 theme-card">
            <Globe className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white">{t.aboutPage.capLangTitle}</h3>
              <p className="text-xs text-txt-muted mt-1">{t.aboutPage.capLangDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 theme-card">
            <Link2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white">{t.aboutPage.capLinkTitle}</h3>
              <p className="text-xs text-txt-muted mt-1">{t.aboutPage.capLinkDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 theme-card">
            <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white">{t.aboutPage.capMultiTitle}</h3>
              <p className="text-xs text-txt-muted mt-1">{t.aboutPage.capMultiDesc}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
