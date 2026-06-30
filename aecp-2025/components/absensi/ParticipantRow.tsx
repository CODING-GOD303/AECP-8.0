'use client';

import { useState } from 'react';
import { Participant } from '@/lib/absensi/types';
import { StatusBadge } from './StatusBadge';
import { QrPreviewModal } from './QrPreviewModal';

export function ParticipantRow({ participant }: { participant: Participant }) {
  const [showQr, setShowQr] = useState(false);

  return (
    <>
      <tr className="border-b border-slate-800 last:border-0 hover:bg-slate-900/60">
        <td className="px-4 py-3 font-mono text-xs text-slate-400">{participant.id}</td>
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-slate-100">{participant.name}</p>
          <p className="text-xs text-slate-400">{participant.origin}</p>
        </td>
        <td className="px-4 py-3 text-sm text-slate-200">{participant.team}</td>
        <td className="px-4 py-3 text-sm text-slate-400">{participant.category}</td>
        <td className="px-4 py-3">
          <StatusBadge status={participant.status} />
        </td>
        <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">
          {participant.checkedInAt
            ? new Date(participant.checkedInAt).toLocaleTimeString('id-ID')
            : '—'}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setShowQr(true)}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-400"
          >
            View QR
          </button>
        </td>
      </tr>
      {showQr && <QrPreviewModal participant={participant} onClose={() => setShowQr(false)} />}
    </>
  );
}
