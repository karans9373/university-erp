import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const pieColors = ["#3478F6", "#48D9C8", "#FFB56B", "#FF6FAE"];

export function ChartCard({ title, type, data, description }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">Live Insights</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3478F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3478F6" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe4f7" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area dataKey="attendance" stroke="#3478F6" fill="url(#attendanceFill)" strokeWidth={3} />
            </AreaChart>
          ) : type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe4f7" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="paid" fill="#48D9C8" radius={[10, 10, 0, 0]} />
              <Bar dataKey="balance" fill="#FFB56B" radius={[10, 10, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      {description ? <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
