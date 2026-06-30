import { CheckinLogEntry } from '@/lib/absensi/types';

export function LiveFeed({ entries }: { entries: CheckinLogEntry[] }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Live arrivals
        </p>
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          live
        </span>
      </div>

      <ul className="max-h-80 divide-y divide-slate-800 overflow-y-auto">
        {entries.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-400">
            No arrivals yet. The feed updates as soon as the first badge is scanned.
          </li>
        )}
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{entry.participantName}</p>
              <p className="truncate text-xs text-slate-400">{entry.team}</p>
            </div>
            <span className="shrink-0 font-mono text-xs tabular-nums text-emerald-400">
              {new Date(entry.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
