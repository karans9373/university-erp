import { motion } from "framer-motion";

export function StatCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-panel rounded-[1.75rem] p-5"
    >
      <p className="text-sm text-slate-500 dark:text-slate-300">{item.label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-3xl font-bold text-brand-navy dark:text-white">{item.value}</p>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">{item.delta}</span>
      </div>
    </motion.div>
  );
}
