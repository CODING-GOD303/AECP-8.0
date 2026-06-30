interface StatChipProps {
  label: string;
  value: number;
  tone?: 'default' | 'signal' | 'muted';
}

export function StatChip({ label, value, tone = 'default' }: StatChipProps) {
  const toneClasses = {
    default: 'text-slate-100',
    signal: 'text-emerald-400',
    muted: 'text-slate-400',
  }[tone];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${toneClasses}`}>{value}</p>
    </div>
  );
}
