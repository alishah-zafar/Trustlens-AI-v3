import { useLang } from "../LangContext";

interface CardDef {
  id: string;
  iconKey: "message" | "url" | "screenshot" | "qrcode";
  icon: React.ReactNode;
}

const CARDS: CardDef[] = [
  {
    id: "text",
    iconKey: "message",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: "url",
    iconKey: "url",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    id: "screenshot",
    iconKey: "screenshot",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "qrcode",
    iconKey: "qrcode",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="3" height="3" />
      </svg>
    ),
  },
];

interface AnalysisCardsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function AnalysisCards({ activeTab, onTabChange }: AnalysisCardsProps) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8">
      {CARDS.map((card) => {
        const cardT = t.cards[card.iconKey];
        const isActive = activeTab === card.id;
        return (
          <button
            key={card.id}
            onClick={() => onTabChange(card.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
              isActive
                ? "bg-accent/10 border-accent/30 text-white"
                : "bg-base-card border-line text-txt-muted hover:border-txt-dim/30 hover:text-white"
            }`}
          >
            <span className={isActive ? "text-accent" : "text-txt-dim"}>{card.icon}</span>
            <span className="hidden sm:inline">{cardT.title}</span>
          </button>
        );
      })}
    </div>
  );
}
