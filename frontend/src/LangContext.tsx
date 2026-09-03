import { createContext, useContext } from "react";
import { getStrings, type Strings } from "./i18n";

export interface LangContextValue {
  lang: string;
  t: Strings;
  setLang: (lang: string) => void;
}

export const LangContext = createContext<LangContextValue>({ lang: "en", t: getStrings("en"), setLang: () => {} });

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
