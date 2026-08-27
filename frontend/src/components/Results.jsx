function getScoreColor(score) {
  if (score >= 70) return { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", ring: "stroke-red-500", label: "High Risk" };
  if (score >= 35) return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", ring: "stroke-amber-500", label: "Medium Risk" };
  return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", ring: "stroke-emerald-500", label: "Low Risk" };
}

function RiskGauge({ score }) {
  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            className={colors.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
        {colors.label}
      </span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Results({ result }) {
  const { riskScore, explanation, redFlags, tactics, recommendations } = result;
  const colors = getScoreColor(riskScore);

  return (
    <div className="mt-8 space-y-6 animate-in fade-in">
      {/* Score card */}
      <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RiskGauge score={riskScore} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-slate-900">Analysis Complete</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{explanation}</p>
            {tactics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {tactics.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/70 border border-slate-200 text-slate-600"
                  >
                    {t.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red flags */}
      {redFlags.length > 0 && (
        <Section
          title="Red Flags Detected"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.515-2.63L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          }
        >
          <ul className="space-y-1.5">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {flag}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Section
          title="What To Do Next"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          }
        >
          <ul className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
