export function DataTable({ title, columns, rows }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <span className="text-sm text-slate-500 dark:text-slate-300">{rows.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/70 dark:border-white/10">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3 font-semibold text-slate-500 dark:text-slate-300">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`} className="border-b border-slate-100/80 last:border-none dark:border-white/5">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-4 text-slate-700 dark:text-slate-200">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
