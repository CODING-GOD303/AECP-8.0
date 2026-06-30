'use client';

import { Participant } from '@/lib/absensi/types';

export function QrPreviewModal({
  participant,
  onClose,
}: {
  participant: Participant;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-100">{participant.name}</p>
            <p className="text-sm text-slate-400">
              {participant.team} · {participant.id}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center rounded-xl bg-slate-100 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/absensi/qr/${participant.qrToken}`}
            alt={`QR badge for ${participant.name}`}
            width={240}
            height={240}
            className="h-60 w-60"
          />
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Point a phone camera at this on another screen to test the scan flow end-to-end.
        </p>
      </div>
    </div>
  );
}
