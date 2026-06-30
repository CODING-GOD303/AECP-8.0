'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ParticipantRow } from '@/components/absensi/ParticipantRow';
import { StatChip } from '@/components/absensi/StatChip';
import { Participant } from '@/lib/absensi/types';

// If you want your existing Navbar on this page too, uncomment this and
// render <Navbar /> right after the opening <div> below — same as your
// other pages (home/register) already do.
// import Navbar from '@/components/Navbar';

type Filter = 'all' | 'checked-in' | 'pending';

export default function AbsensiPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/absensi/participants', { cache: 'no-store' });
      const data = await res.json();
      setParticipants(data.participants);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    });
  }, [participants, query, filter]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* <Navbar /> */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-slate-100">Finalist roster</p>
            <p className="text-sm text-slate-400">
              Attendance for AECP 8.0 finalists. Updates live as panitia scan badges at the door.
            </p>
          </div>
          <Link
            href="/Absensi/scan"
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Open scan console →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
          <StatChip label="Total" value={stats.total} />
          <StatChip label="Arrived" value={stats.checkedIn} tone="signal" />
          <StatChip label="Pending" value={stats.pending} tone="muted" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, team, ID, or category…"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
            {(
              [
                ['all', 'All'],
                ['checked-in', 'Arrived'],
                ['pending', 'Pending'],
              ] as [Filter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === value
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-[11px] uppercase tracking-[0.1em] text-slate-400">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Finalist</th>
                  <th className="px-4 py-3 font-medium">Team</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Arrived at</th>
                  <th className="px-4 py-3 font-medium text-right">Badge</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ParticipantRow key={p.id} participant={p} />
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-slate-400">
                No finalist matches &ldquo;{query}&rdquo;. Try a different name, team, or ID.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
