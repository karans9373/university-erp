import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { heroStats, roleOptions } from "../../data/mock";

export function HeroSection({ onEnterPortal }) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-4517-large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(5,18,42,0.82)_0%,rgba(16,40,84,0.68)_36%,rgba(28,89,144,0.34)_62%,rgba(255,174,110,0.24)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(72,217,200,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,111,174,0.22),transparent_24%)]" />
      <div className="section-shell relative grid min-h-[92vh] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-white">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-xl">
            International University ERP Experience
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-tight sm:text-6xl">
              A premium university portal where admins run the campus and students manage their complete academic life.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/82">
              UniSphere blends admissions, results, fee operations, identity cards, hostel allotments, library permissions, mess cards, notices, and AI support into one modern ERP built around a Python-powered backend.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-6 py-4 font-semibold text-brand-navy transition hover:-translate-y-1 hover:bg-brand-cyan" onClick={onEnterPortal} type="button">
              Login to Portal <ArrowRight className="ml-2 inline" size={18} />
            </button>
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-medium backdrop-blur-xl">
              <ShieldCheck className="mr-2" size={18} />
              Secure role-based access for Admin, Staff, and Students
            </div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {heroStats.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.06 }} className="rounded-3xl border border-white/15 bg-white/12 p-5 backdrop-blur-xl">
                <p className="font-display text-3xl font-bold">{item.value}</p>
                <p className="mt-2 text-sm text-white/72">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="glass-panel relative rounded-[2rem] border-white/15 bg-white/10 p-5 text-white backdrop-blur-2xl">
            <div className="grid gap-4">
              {roleOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="rounded-[1.6rem] border border-white/12 bg-slate-950/25 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/70">{item.subtitle}</p>
                        <h3 className="mt-1 font-display text-2xl font-bold">{item.title}</h3>
                      </div>
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent}`}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      {item.key === "admin" && ["Allocate hostel and mess cards", "Issue ID and library access", "Export academic and finance reports"].map((line) => (
                        <div key={line} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/82">
                          {line}
                        </div>
                      ))}
                      {item.key === "teacher" && ["Publish attendance insights", "Process results and marks", "Send faculty notices"].map((line) => (
                        <div key={line} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/82">
                          {line}
                        </div>
                      ))}
                      {item.key === "student" && ["Check dues and fee structure", "View hostel, ID, and library status", "Track GPA, notices, and documents"].map((line) => (
                        <div key={line} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/82">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="rounded-[1.6rem] bg-gradient-to-r from-white/16 to-white/8 p-5">
                <p className="text-sm text-white/72">University command center</p>
                <p className="mt-2 font-display text-3xl font-bold">Designed for real client demos and commercial pitches</p>
                <p className="mt-2 text-sm leading-7 text-white/78">A single platform for campus governance, academic operations, student services, and executive reporting.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
