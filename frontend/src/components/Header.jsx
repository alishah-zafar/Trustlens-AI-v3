export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
        {/* Shield icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            TrustLens AI
          </h1>
          <p className="text-xs text-slate-500">
            AI-powered scam &amp; phishing detection
          </p>
        </div>
      </div>
    </header>
  );
}
