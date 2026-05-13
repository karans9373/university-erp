import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "./pages/LandingPage";
import { PortalPage } from "./pages/PortalPage";
import { TopNav } from "./components/layout/TopNav";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-brand-paper text-brand-ink transition-colors dark:bg-slate-950 dark:text-white">
      <TopNav darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} onEnterPortal={() => setShowPortal(true)} />
      <AnimatePresence mode="wait">
        {showPortal ? (
          <motion.div key="portal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <PortalPage onExit={() => setShowPortal(false)} />
          </motion.div>
        ) : (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onEnterPortal={() => setShowPortal(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
