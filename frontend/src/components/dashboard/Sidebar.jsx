export function Sidebar({ user, items, activeItem, onSelect }) {
  return (
    <aside className="glass-panel h-full rounded-[2rem] p-5">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-brand-navy to-brand-blue p-5 text-white">
        <p className="text-sm text-white/70">Signed in as</p>
        <h3 className="mt-2 font-display text-2xl font-bold">{user?.name || "Guest User"}</h3>
        <p className="mt-1 text-sm capitalize text-white/75">{user?.role === "teacher" ? "staff" : user?.role || "visitor"} portal</p>
      </div>
      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                activeItem === item.key
                  ? "bg-brand-navy text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/70 hover:text-brand-navy dark:text-slate-200 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
