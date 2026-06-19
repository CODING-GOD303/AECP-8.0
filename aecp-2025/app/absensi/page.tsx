import { useState, useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Category =
  | "Speech"
  | "Debate"
  | "Story Telling"
  | "Spelling Bee"
  | "Reading Aloud"
  | "Scrabble";

type Level = "SD" | "SMP" | "SMA";

interface Participant {
  id: string;
  name: string;
  school: string;
  category: Category;
  level: Level;
}

type AttendanceRecord = {
  [participantId: string]: {
    day1?: string; // check-in time HH:MM
    day2?: string;
  };
};

type Tab = "scan" | "attendance" | "participants";
type Day = 1 | 2;
type ToastType = "success" | "error" | "idle";

// ── Helpers ──────────────────────────────────────────────────────────────────
function pad(n: number): string {
  return String(n).padStart(3, "0");
}

function nowTime(): string {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CATEGORIES: Category[] = [
  "Speech",
  "Debate",
  "Story Telling",
  "Spelling Bee",
  "Reading Aloud",
  "Scrabble",
];
const LEVELS: Level[] = ["SD", "SMP", "SMA"];

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED: Omit<Participant, "id">[] = [
  { name: "Aisyah Putri", school: "SMAN 1 Bandung", category: "Speech", level: "SMA" },
  { name: "Rizky Firmansyah", school: "SMPN 3 Cimahi", category: "Debate", level: "SMP" },
  { name: "Nadira Salsabila", school: "SDN Coblong 1", category: "Story Telling", level: "SD" },
  { name: "Farhan Alif", school: "SMAN 5 Bandung", category: "Spelling Bee", level: "SMA" },
  { name: "Tiara Maharani", school: "SMPN 7 Bandung", category: "Reading Aloud", level: "SMP" },
  { name: "Dimas Arya", school: "SDN Pasteur 2", category: "Scrabble", level: "SD" },
];

let _nextId = SEED.length + 1;
function genId(): string {
  return "P" + pad(_nextId++);
}

const INITIAL_PARTICIPANTS: Participant[] = SEED.map((s, i) => ({
  id: "P" + pad(i + 1),
  ...s,
}));

// ── Sub-components ────────────────────────────────────────────────────────────

interface BadgeProps {
  variant: "success" | "danger" | "info" | "warning";
  children: React.ReactNode;
}
function Badge({ variant, children }: BadgeProps) {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}
function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${color ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

interface ToastProps {
  message: string;
  type: ToastType;
}
function Toast({ message, type }: ToastProps) {
  if (type === "idle") return null;
  const styles =
    type === "success"
      ? "bg-green-50 border-green-300 text-green-800"
      : "bg-red-50 border-red-300 text-red-800";
  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-2.5 rounded-lg border text-sm font-medium shadow-sm transition-all ${styles}`}
    >
      {message}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AECPPresenceSystem() {
  const [tab, setTab] = useState<Tab>("scan");
  const [day, setDay] = useState<Day>(1);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [manualId, setManualId] = useState("");
  const [attSearch, setAttSearch] = useState("");
  const [attFilter, setAttFilter] = useState<"all" | "present" | "absent">("all");
  const [scanResult, setScanResult] = useState<{
    ok: boolean;
    title: string;
    sub: string;
    detail: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({
    message: "",
    type: "idle",
  });
  const scanResultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state for new participant
  const [form, setForm] = useState({
    name: "",
    school: "",
    category: "Speech" as Category,
    level: "SMA" as Level,
  });

  const dayKey = `day${day}` as "day1" | "day2";

  // ── Stats ────────────────────────────────────────────────────────────────
  const total = participants.length;
  const present = participants.filter((p) => !!attendance[p.id]?.[dayKey]).length;
  const absent = total - present;
  const pct = total ? Math.round((present / total) * 100) : 0;

  // ── Actions ───────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: "success" | "error") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast({ message: "", type: "idle" }), 2500);
  }, []);

  const showScanResult = useCallback(
    (result: { ok: boolean; title: string; sub: string; detail: string }) => {
      if (scanResultTimer.current) clearTimeout(scanResultTimer.current);
      setScanResult(result);
      scanResultTimer.current = setTimeout(() => setScanResult(null), 4000);
    },
    []
  );

  const checkIn = useCallback(
    (id: string): { ok: boolean; title: string; sub: string; detail: string } => {
      const p = participants.find((x) => x.id === id.toUpperCase());
      if (!p) {
        return {
          ok: false,
          title: "Peserta tidak ditemukan",
          sub: `ID "${id}" tidak ada dalam daftar`,
          detail: "Periksa ID atau daftarkan peserta terlebih dahulu.",
        };
      }
      if (attendance[p.id]?.[dayKey]) {
        return {
          ok: false,
          title: p.name,
          sub: `Sudah check-in pukul ${attendance[p.id][dayKey]}`,
          detail: "Tidak dapat check-in dua kali pada hari yang sama.",
        };
      }
      const time = nowTime();
      setAttendance((prev) => ({
        ...prev,
        [p.id]: { ...prev[p.id], [dayKey]: time },
      }));
      return {
        ok: true,
        title: p.name,
        sub: `✓ Check-in berhasil — Day ${day} · ${time}`,
        detail: `${p.category} · ${p.level} · ${p.school}`,
      };
    },
    [participants, attendance, dayKey, day]
  );

  const handleManualCheckIn = () => {
    if (!manualId.trim()) {
      showToast("Masukkan ID peserta", "error");
      return;
    }
    const result = checkIn(manualId.trim());
    showScanResult(result);
    setManualId("");
  };

  const handleSimulateScan = () => {
    if (!participants.length) {
      showToast("Tambahkan peserta terlebih dahulu", "error");
      return;
    }
    const notChecked = participants.filter((p) => !attendance[p.id]?.[dayKey]);
    const pool = notChecked.length ? notChecked : participants;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const result = checkIn(pick.id);
    showScanResult(result);
  };

  const handleAddParticipant = () => {
    if (!form.name.trim()) {
      showToast("Nama peserta wajib diisi", "error");
      return;
    }
    const id = genId();
    const newP: Participant = { id, ...form, name: form.name.trim(), school: form.school.trim() };
    setParticipants((prev) => [...prev, newP]);
    setForm({ name: "", school: "", category: "Speech", level: "SMA" });
    showToast(`${newP.name} (${id}) ditambahkan`, "success");
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setAttendance((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleExportCSV = () => {
    const header = `ID,Nama,Kategori,Jenjang,Asal,Status Day ${day},Waktu\n`;
    const rows = participants
      .map((p) => {
        const time = attendance[p.id]?.[dayKey];
        const status = time ? "Hadir" : "Belum";
        return `${p.id},"${p.name}","${p.category}","${p.level}","${p.school}",${status},${time ?? ""}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `AECP_Day${day}_Attendance.csv`;
    a.click();
  };

  // ── Filtered attendance list ───────────────────────────────────────────────
  const filteredParticipants = participants.filter((p) => {
    const q = attSearch.toLowerCase();
    const match =
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.school.toLowerCase().includes(q);
    const isPresent = !!attendance[p.id]?.[dayKey];
    if (attFilter === "present") return match && isPresent;
    if (attFilter === "absent") return match && !isPresent;
    return match;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AECP Presence System</h1>
            <p className="text-sm text-gray-500">Annual English Competition · 2 Days</p>
          </div>
          <div className="flex gap-2">
            {([1, 2] as Day[]).map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  day === d
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {(["scan", "attendance", "participants"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "scan" ? "Scan QR" : t === "attendance" ? "Kehadiran" : "Peserta"}
            </button>
          ))}
        </div>

        {/* ── SCAN TAB ── */}
        {tab === "scan" && (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Total" value={total} />
              <StatCard label="Hadir" value={present} color="text-green-600" />
              <StatCard label="Belum" value={absent} color="text-red-500" />
              <StatCard label="Kehadiran" value={`${pct}%`} color="text-blue-600" />
            </div>

            {/* Scanner card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {/* QR frame */}
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={handleSimulateScan}
                  className="relative w-48 h-48 rounded-xl border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center mb-3 group"
                  title="Tap to simulate scan"
                >
                  {/* Corner brackets */}
                  {[
                    "top-2 left-2 border-t-2 border-l-2",
                    "top-2 right-2 border-t-2 border-r-2",
                    "bottom-2 left-2 border-b-2 border-l-2",
                    "bottom-2 right-2 border-b-2 border-r-2",
                  ].map((cls, i) => (
                    <span
                      key={i}
                      className={`absolute w-5 h-5 border-gray-700 rounded-sm ${cls}`}
                    />
                  ))}
                  {/* Scan line */}
                  <span className="absolute w-4/5 h-0.5 bg-red-500 left-[10%] animate-[scanLine_1.8s_ease-in-out_infinite]" />
                  <svg
                    className="w-16 h-16 text-gray-300 group-hover:text-gray-400 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="19" y="14" width="2" height="2" />
                    <rect x="14" y="19" width="2" height="2" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                </button>
                <p className="text-sm text-gray-500">Tap bingkai untuk simulasi scan</p>
                <p className="text-xs text-gray-400">atau masukkan ID secara manual</p>
              </div>

              {/* Manual entry */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleManualCheckIn()}
                  placeholder="ID peserta (e.g. P001)"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                />
                <button
                  onClick={handleManualCheckIn}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Check In
                </button>
              </div>

              {/* Scan result */}
              {scanResult && (
                <div
                  className={`mt-4 p-4 rounded-xl border transition-all ${
                    scanResult.ok
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{scanResult.ok ? "✅" : "⚠️"}</span>
                    <div>
                      <p
                        className={`font-medium ${
                          scanResult.ok ? "text-green-900" : "text-red-900"
                        }`}
                      >
                        {scanResult.title}
                      </p>
                      <p
                        className={`text-sm mt-0.5 ${
                          scanResult.ok ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {scanResult.sub}
                      </p>
                      {scanResult.detail && (
                        <p className="text-xs text-gray-500 mt-1">{scanResult.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {tab === "attendance" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="search"
                placeholder="Cari nama, ID, atau sekolah..."
                value={attSearch}
                onChange={(e) => setAttSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <select
                value={attFilter}
                onChange={(e) =>
                  setAttFilter(e.target.value as "all" | "present" | "absent")
                }
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="all">Semua</option>
                <option value="present">Hadir</option>
                <option value="absent">Belum hadir</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Nama</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Kategori</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Asal</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                        Tidak ada peserta ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p, i) => {
                      const time = attendance[p.id]?.[dayKey];
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-gray-50 last:border-0 ${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant="info">{p.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.school || "-"}</td>
                          <td className="px-4 py-3">
                            {time ? (
                              <Badge variant="success">Hadir</Badge>
                            ) : (
                              <Badge variant="danger">Belum</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                            {time ?? "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
                Export CSV — Day {day}
              </button>
            </div>
          </div>
        )}

        {/* ── PARTICIPANTS TAB ── */}
        {tab === "participants" && (
          <div className="space-y-5">
            {/* Add form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Tambah peserta baru</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Nama lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama peserta"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">Sekolah / Asal</label>
                  <input
                    type="text"
                    value={form.school}
                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                    placeholder="Nama sekolah"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kategori lomba</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Jenjang</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddParticipant}
                className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                + Tambah Peserta
              </button>
            </div>

            {/* List */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Daftar Peserta ({participants.length})
              </p>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Nama</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Kategori</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Asal</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                          Belum ada peserta. Tambahkan peserta di atas.
                        </td>
                      </tr>
                    ) : (
                      participants.map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant="info">{p.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.school || "-"}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemoveParticipant(p.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`Hapus ${p.name}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Scan line animation */}
      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 20%; }
          50% { top: 75%; }
        }
      `}</style>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}