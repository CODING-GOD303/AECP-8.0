import { Participant } from '@/lib/absensi/types';

export type ScanOutcome =
  | { kind: 'idle' }
  | { kind: 'success'; participant: Participant }
  | { kind: 'duplicate'; participant: Participant; message: string }
  | { kind: 'error'; message: string };

export function ScanResultPanel({ outcome }: { outcome: ScanOutcome }) {
  if (outcome.kind === 'idle') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600 px-6 py-10 text-center">
        <p className="text-sm font-medium text-slate-200">Awaiting scan</p>
        <p className="text-sm text-slate-400">
          Point the camera at a finalist&apos;s QR badge to record arrival.
        </p>
      </div>
    );
  }

  if (outcome.kind === 'success') {
    const p = outcome.participant;
    return (
      <div className="rounded-2xl border border-emerald-600/40 bg-emerald-500/10 p-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckIcon />
          <p className="text-sm font-semibold uppercase tracking-wide">Checked in</p>
        </div>
        <p className="mt-3 text-xl font-semibold text-slate-100">{p.name}</p>
        <p className="text-sm text-slate-400">
          {p.team} · {p.category}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-slate-400">
          <span>{p.id}</span>
          <span>{p.origin}</span>
          {p.checkedInAt && (
            <span className="text-emerald-400">
              {new Date(p.checkedInAt).toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (outcome.kind === 'duplicate') {
    const p = outcome.participant;
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertIcon />
          <p className="text-sm font-semibold uppercase tracking-wide">Already arrived</p>
        </div>
        <p className="mt-3 text-xl font-semibold text-slate-100">{p.name}</p>
        <p className="text-sm text-slate-400">
          {p.team} · {p.category}
        </p>
        <p className="mt-4 font-mono text-xs text-amber-400">{outcome.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
      <div className="flex items-center gap-2 text-red-400">
        <AlertIcon />
        <p className="text-sm font-semibold uppercase tracking-wide">Not recognized</p>
      </div>
      <p className="mt-3 text-sm text-slate-200">{outcome.message}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
