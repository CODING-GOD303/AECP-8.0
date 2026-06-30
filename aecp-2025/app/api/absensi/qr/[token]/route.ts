import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getAllParticipants } from '@/lib/absensi/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const participant = getAllParticipants().find((p) => p.qrToken === token);

  if (!participant) {
    return NextResponse.json({ message: 'Unknown token' }, { status: 404 });
  }

  const pngBuffer = await QRCode.toBuffer(participant.qrToken, {
    type: 'png',
    width: 360,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#F8FAFC',
    },
  });

  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
