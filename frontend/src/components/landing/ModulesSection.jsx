import { motion } from "framer-motion";
import { modules } from "../../data/mock";

export function ModulesSection() {
  return (
    <section className="py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-blue">Platform Modules</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-brand-ink dark:text-white">A complete digital nervous system for modern universities</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Every critical workflow is packaged into a cohesive, premium experience for students, faculty, and administrators.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel group rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-2 hover:bg-white/80 dark:hover:bg-slate-900/70"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white shadow-lg">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
