'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { QrScanner } from '@/components/absensi/QrScanner';
import { ScanResultPanel, ScanOutcome } from '@/components/absensi/ScanResultPanel';
import { LiveFeed } from '@/components/absensi/LiveFeed';
import { StatChip } from '@/components/absensi/StatChip';
import { CheckinLogEntry } from '@/lib/absensi/types';

// Same as the roster page — uncomment to render your existing Navbar here too.
// import Navbar from '@/components/Navbar';

export default function ScanPage() {
  const [scannerName, setScannerName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [outcome, setOutcome] = useState<ScanOutcome>({ kind: 'idle' });
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [feed, setFeed] = useState<CheckinLogEntry[]>([]);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/absensi/participants', { cache: 'no-store' });
      const data = await res.json();
      setStats(data.stats);
      setFeed(data.log);
    } catch {
      /* polling failure is non-critical, next interval will retry */
    }
  }, []);

  useEffect(() => {
    refreshFeed();
    const interval = setInterval(refreshFeed, 4000);
    return () => clearInterval(interval);
  }, [refreshFeed]);

  const handleDecode = useCallback(
    async (qrToken: string) => {
      setPaused(true);
      try {
        const res = await fetch('/api/absensi/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrToken, scannedBy: scannerName || 'Panitia' }),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setOutcome({ kind: 'success', participant: data.participant });
          setStats(data.stats);
        } else if (res.status === 409) {
          setOutcome({ kind: 'duplicate', participant: data.participant, message: data.message });
        } else {
          setOutcome({ kind: 'error', message: data.message ?? 'Unrecognized QR code.' });
        }
        refreshFeed();
      } catch {
        setOutcome({ kind: 'error', message: 'Network error. Could not reach the server.' });
      }

      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        setPaused(false);
      }, 2200);
    },
    [scannerName, refreshFeed]
  );

  if (!nameConfirmed) {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* <Navbar /> */}
        <main className="mx-auto flex max-w-md flex-col gap-5 px-5 py-16">
          <div>
            <p className="text-xl font-semibold text-slate-100">Who&apos;s scanning?</p>
            <p className="mt-1 text-sm text-slate-400">
              Your name is logged against every badge you check in, so the committee can trace who
              verified each arrival.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (scannerName.trim()) setNameConfirmed(true);
            }}
            className="flex flex-col gap-3"
          >
            <input
              autoFocus
              value={scannerName}
              onChange={(e) => setScannerName(e.target.value)}
              placeholder="e.g. Dhea — Registration Desk"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!scannerName.trim()}
              className="rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition-opacity disabled:opacity-40"
            >
              Start scanning
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* <Navbar /> */}
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-slate-100">Scan console</p>
            <p className="text-sm text-slate-400">
              Signed in as <span className="text-slate-100">{scannerName}</span> ·{' '}
              <button
                onClick={() => setNameConfirmed(false)}
                className="underline decoration-dotted hover:text-slate-100"
              >
                change
              </button>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatChip label="Total" value={stats.total} />
            <StatChip label="Arrived" value={stats.checkedIn} tone="signal" />
            <StatChip label="Pending" value={stats.pending} tone="muted" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-4">
            <QrScanner onDecode={handleDecode} paused={paused} />
            <p className="text-center text-xs text-slate-400">
              Hold the badge steady, about 15–20cm from the camera.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="min-h-[180px]">
              <ScanResultPanel outcome={outcome} />
            </div>
            <LiveFeed entries={feed} />
          </div>
        </div>
      </main>
    </div>
  );
}
