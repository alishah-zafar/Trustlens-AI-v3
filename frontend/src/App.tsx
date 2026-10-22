import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { LangContext } from "./LangContext";
import { getStrings } from "./i18n";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import ResultsPage from "./pages/ResultsPage";
import History from "./pages/History";
import About from "./pages/About";
import Extension from "./pages/Extension";

export default function App() {
  const [lang, setLang] = useState("en");
  const t = getStrings(lang);

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen app-shell">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/extension" element={<Extension />} />
            </Route>
          </Routes>
        </div>
      </MotionConfig>
    </LangContext.Provider>
  );
}
