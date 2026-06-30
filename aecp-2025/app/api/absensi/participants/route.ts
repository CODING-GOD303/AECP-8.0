import { NextResponse } from 'next/server';
import { getAllParticipants, getStats, getRecentLog } from '@/lib/absensi/store';

export async function GET() {
  const participants = getAllParticipants();
  const stats = getStats();
  const log = getRecentLog(10);

  return NextResponse.json({ participants, stats, log });
}
