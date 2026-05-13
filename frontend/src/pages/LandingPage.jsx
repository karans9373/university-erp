import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { ModulesSection } from "../components/landing/ModulesSection";
import { HeroSection } from "../components/landing/HeroSection";
import { demoCredentials, landingHighlights } from "../data/mock";
import { fetchCollection } from "../lib/api";

export function LandingPage({ onEnterPortal }) {
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    async function loadNotices() {
      try {
        const items = await fetchCollection("/notices");
        setLatestNotices(items.slice(0, 3));
      } catch {
        setLatestNotices([
          { title: "Admissions Open 2026", category: "Admission", content: "Applications for international and domestic programs are now live." },
          { title: "Hostel Allocation Window", category: "Hostel", content: "Students can review allotments and room status through the ERP portal." },
        ]);
      }
    }

    loadNotices();
  }, []);

  return (
    <>
      <HeroSection onEnterPortal={onEnterPortal} />
      <ModulesSection />
      <section className="pb-10">
        <div className="section-shell">
          <div className="glass-panel rounded-[2rem] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-peach to-brand-pink text-white">
                <BellRing size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">Live Notification Wall</p>
                <h2 className="font-display text-3xl font-bold">Latest university notifications visible to everyone</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {latestNotices.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">{item.category}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="section-shell">
          <div className="glass-panel rounded-[2rem] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-blue">Why It Feels Real</p>
                <h2 className="mt-4 font-display text-4xl font-bold">A university ERP experience where each user type gets a meaningful workflow</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Admins can allocate resources and manage the institution, staff can process academics and communication, and students can track the services that matter to them like fees, dues, cards, hostel, library, attendance, and results.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {landingHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white">
                          <Icon size={20} />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold">{item.label}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-gradient-to-br from-brand-navy to-brand-lavender p-6 text-white">
                <p className="font-display text-2xl font-bold">Login Demo Roles</p>
                <p className="mt-2 text-sm text-white/75">Use these accounts to enter the exact portal experience for that user type.</p>
                <div className="mt-6 space-y-4">
                  {demoCredentials.map((item) => (
                    <div key={item.role} className="rounded-2xl bg-white/10 p-4">
                      <p className="font-semibold">{item.role}</p>
                      <p className="mt-2 text-sm text-white/80">{item.email}</p>
                      <p className="text-sm text-white/80">{item.password}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full rounded-full bg-white px-5 py-4 font-semibold text-brand-navy transition hover:bg-brand-cyan" onClick={onEnterPortal} type="button">
                  Open Login Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
