import { MoonStar, Sparkles, SunMedium } from "lucide-react";

export function TopNav({ darkMode, onToggleTheme, onEnterPortal }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50">
      <div className="section-shell flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-display text-xl font-bold">UniSphere ERP</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">International University Management Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="glass-panel rounded-full p-3 transition hover:-translate-y-0.5"
            onClick={onToggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>
          <button
            className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue"
            onClick={onEnterPortal}
            type="button"
          >
            Enter Portal
          </button>
        </div>
      </div>
    </header>
  );
}
