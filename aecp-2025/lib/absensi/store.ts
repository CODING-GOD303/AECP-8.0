import { Participant, CheckinLogEntry } from './types';

// --- Dummy seed data for AECP 8.0 finalists -------------------------------
// In-memory store. Resets whenever the dev/prod server restarts.
// Replace this seed list with the real finalist list when ready, and swap
// the qrToken values for whatever you encode in the printed QR badges.

const seedParticipants: Omit<Participant, 'status' | 'checkedInAt' | 'checkedInBy'>[] = [
  { id: 'AECP8-001', qrToken: 'q-7f3a1c-001', name: 'Raka Pradipta', team: 'Solar Synapse', category: 'Energy Systems', origin: 'ITB' },
  { id: 'AECP8-002', qrToken: 'q-9b2e4d-002', name: 'Aisyah Putri Maharani', team: 'Solar Synapse', category: 'Energy Systems', origin: 'ITB' },
  { id: 'AECP8-003', qrToken: 'q-1d8f6a-003', name: 'Bagas Wirawan', team: 'Hydronova', category: 'Energy Systems', origin: 'UGM' },
  { id: 'AECP8-004', qrToken: 'q-5c0b3e-004', name: 'Nadia Kusuma', team: 'Hydronova', category: 'Energy Systems', origin: 'UGM' },
  { id: 'AECP8-005', qrToken: 'q-2a9d7f-005', name: 'Farrel Aditya', team: 'CircuitWeave', category: 'Embedded Systems', origin: 'ITS' },
  { id: 'AECP8-006', qrToken: 'q-8e1c4b-006', name: 'Devina Larasati', team: 'CircuitWeave', category: 'Embedded Systems', origin: 'ITS' },
  { id: 'AECP8-007', qrToken: 'q-3f7a2d-007', name: 'Yusuf Maulana', team: 'Nimbus Grid', category: 'IoT & Automation', origin: 'UI' },
  { id: 'AECP8-008', qrToken: 'q-6b4e9c-008', name: 'Salsabila Rahma', team: 'Nimbus Grid', category: 'IoT & Automation', origin: 'UI' },
  { id: 'AECP8-009', qrToken: 'q-0d2f8a-009', name: 'Kevin Hartono', team: 'Pyrolytic', category: 'Sustainable Materials', origin: 'Universitas Brawijaya' },
  { id: 'AECP8-010', qrToken: 'q-4a6c1e-010', name: 'Clarissa Wijaya', team: 'Pyrolytic', category: 'Sustainable Materials', origin: 'Universitas Brawijaya' },
  { id: 'AECP8-011', qrToken: 'q-7e3b5f-011', name: 'Arman Setiawan', team: 'Aerofoil', category: 'Robotics', origin: 'Universitas Diponegoro' },
  { id: 'AECP8-012', qrToken: 'q-1c9d4a-012', name: 'Putri Anjani', team: 'Aerofoil', category: 'Robotics', origin: 'Universitas Diponegoro' },
  { id: 'AECP8-013', qrToken: 'q-5f8e2b-013', name: 'Galang Saputra', team: 'BioLume', category: 'Sustainable Materials', origin: 'Universitas Padjadjaran' },
  { id: 'AECP8-014', qrToken: 'q-9a1c6d-014', name: 'Intan Permatasari', team: 'BioLume', category: 'Sustainable Materials', origin: 'Universitas Padjadjaran' },
  { id: 'AECP8-015', qrToken: 'q-2d7f3e-015', name: 'Dimas Anggara', team: 'VoltCascade', category: 'Energy Systems', origin: 'Universitas Airlangga' },
  { id: 'AECP8-016', qrToken: 'q-6e4b8a-016', name: 'Marsha Octaviani', team: 'VoltCascade', category: 'Energy Systems', origin: 'Universitas Airlangga' },
];

declare global {
  // eslint-disable-next-line no-var
  var __aecpAbsensiStore: {
    participants: Participant[];
    log: CheckinLogEntry[];
  } | undefined;
}

function initStore() {
  return {
    participants: seedParticipants.map((p) => ({
      ...p,
      status: 'pending' as const,
      checkedInAt: null,
      checkedInBy: null,
    })),
    log: [] as CheckinLogEntry[],
  };
}

// Use a global so the store survives Next.js hot-reload in dev mode.
// Namespaced as __aecpAbsensiStore to avoid colliding with any other
// global state your project might already define.
const store = global.__aecpAbsensiStore ?? (global.__aecpAbsensiStore = initStore());

export function getAllParticipants(): Participant[] {
  return store.participants;
}

export function getParticipantByToken(qrToken: string): Participant | undefined {
  return store.participants.find((p) => p.qrToken === qrToken);
}

export function getParticipantById(id: string): Participant | undefined {
  return store.participants.find((p) => p.id === id);
}

export function checkInParticipant(
  qrToken: string,
  scannedBy: string
): { ok: true; participant: Participant } | { ok: false; reason: 'not_found' | 'already_checked_in'; participant?: Participant } {
  const participant = getParticipantByToken(qrToken);
  if (!participant) {
    return { ok: false, reason: 'not_found' };
  }
  if (participant.status === 'checked-in') {
    return { ok: false, reason: 'already_checked_in', participant };
  }

  participant.status = 'checked-in';
  participant.checkedInAt = new Date().toISOString();
  participant.checkedInBy = scannedBy;

  const entry: CheckinLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    participantId: participant.id,
    participantName: participant.name,
    team: participant.team,
    timestamp: participant.checkedInAt,
    scannedBy,
  };
  store.log.unshift(entry);

  return { ok: true, participant };
}

export function getRecentLog(limit = 20): CheckinLogEntry[] {
  return store.log.slice(0, limit);
}

export function getStats() {
  const total = store.participants.length;
  const checkedIn = store.participants.filter((p) => p.status === 'checked-in').length;
  return { total, checkedIn, pending: total - checkedIn };
}

export function resetStore() {
  const fresh = initStore();
  store.participants = fresh.participants;
  store.log = fresh.log;
}
