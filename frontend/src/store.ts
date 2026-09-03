import { create } from "zustand";

export interface AnalysisEntry {
  id: string;
  timestamp: number;
  inputType: "text" | "url" | "screenshot" | "qrcode";
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Severe";
  scamCategory: string;
  confidence: "Low" | "Medium" | "High";
  redFlags: string[];
  explanation: string;
  recommendedActions: string[];
  sourceText?: string;
  extractedUrl?: string;
  detectedLanguage?: string;
}

function scoreToLevel(score: number): "Low" | "Moderate" | "High" | "Severe" {
  if (score >= 75) return "Severe";
  if (score >= 50) return "High";
  if (score >= 25) return "Moderate";
  return "Low";
}

interface HistoryState {
  entries: AnalysisEntry[];
  addEntry: (entry: Omit<AnalysisEntry, "id" | "timestamp" | "riskLevel">) => AnalysisEntry;
  getEntry: (id: string) => AnalysisEntry | undefined;
  clearHistory: () => void;
}

export const useHistory = create<HistoryState>((set, get) => ({
  entries: [],

  addEntry(raw) {
    const entry: AnalysisEntry = {
      ...raw,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      riskLevel: scoreToLevel(raw.riskScore),
    };
    set((s) => ({ entries: [entry, ...s.entries] }));
    return entry;
  },

  getEntry(id) {
    return get().entries.find((e) => e.id === id);
  },

  clearHistory() {
    set({ entries: [] });
  },
}));
