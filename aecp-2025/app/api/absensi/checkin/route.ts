import { NextRequest, NextResponse } from 'next/server';
import { checkInParticipant, getStats } from '@/lib/absensi/store';

export async function POST(req: NextRequest) {
  let body: { qrToken?: string; scannedBy?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const { qrToken, scannedBy } = body;

  if (!qrToken || typeof qrToken !== 'string') {
    return NextResponse.json({ ok: false, message: 'QR token is missing.' }, { status: 400 });
  }

  const result = checkInParticipant(qrToken, scannedBy?.trim() || 'Panitia');

  if (!result.ok) {
    if (result.reason === 'not_found') {
      return NextResponse.json(
        { ok: false, message: 'QR code not recognized. Not on the finalist list.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        message: `Already checked in at ${new Date(result.participant!.checkedInAt!).toLocaleTimeString('id-ID')}.`,
        participant: result.participant,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    participant: result.participant,
    stats: getStats(),
  });
}
