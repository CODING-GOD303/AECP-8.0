import { AttendanceStatus } from '@/lib/absensi/types';

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === 'checked-in') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Arrived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Pending
    </span>
  );
}
