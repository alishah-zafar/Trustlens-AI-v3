import { Link } from "react-router-dom";
import { useHistory } from "../store";
import { useLang } from "../LangContext";
import { Trash2, AlertTriangle, Clock } from "lucide-react";

const LEVEL_COLORS: Record<string, string> = {
  Severe: "#9B2C2C",
  High: "#E53E3E",
  Moderate: "#ECC94B",
  Low: "#48BB78",
};

function levelColor(level: string) {
  return LEVEL_COLORS[level] || LEVEL_COLORS.Low;
}

export default function History() {
  const entries = useHistory((s) => s.entries);
  const clearHistory = useHistory((s) => s.clearHistory);
  const { t } = useLang();

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t.historyPage.justNow;
    if (mins < 60) return `${mins} ${t.historyPage.minAgo}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${t.historyPage.hoursAgo}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t.historyPage.daysAgo}`;
  }

  function riskLevelLabel(level: string) {
    switch (level) {
      case "Severe": return t.historyPage.riskLevels.severe;
      case "High": return t.historyPage.riskLevels.high;
      case "Moderate": return t.historyPage.riskLevels.moderate;
      default: return t.historyPage.riskLevels.low;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t.historyPage.title}</h1>
          <p className="text-sm text-txt-muted mt-1">{t.historyPage.subtitle}</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-txt-dim border border-line px-3 py-1.5 rounded-lg hover:text-accent hover:border-accent/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.historyPage.clear}
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-12 h-12 text-txt-dim mx-auto mb-4 opacity-30" />
          <p className="text-txt-muted mb-4">{t.historyPage.empty}</p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
          >
            <AlertTriangle className="w-4 h-4" />
            {t.historyPage.start}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/results/${entry.id}`}
              state={{ entry }}
              className="flex items-center gap-4 p-4 theme-card group"
            >
              {/* Risk score badge */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-extrabold shrink-0"
                style={{ backgroundColor: `${levelColor(entry.riskLevel)}15`, color: levelColor(entry.riskLevel) }}
              >
                {entry.riskScore}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: levelColor(entry.riskLevel) }}
                  >
                    {riskLevelLabel(entry.riskLevel)}
                  </span>
                  {entry.detectedLanguage && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-base-hover text-txt-dim">
                      {entry.detectedLanguage}
                    </span>
                  )}
                </div>
                <p className="text-sm text-txt-muted truncate">{entry.scamCategory}</p>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-txt-dim shrink-0">
                {timeAgo(entry.timestamp)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
