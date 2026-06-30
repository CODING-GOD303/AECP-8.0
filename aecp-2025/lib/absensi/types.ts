export type AttendanceStatus = 'pending' | 'checked-in';

export interface Participant {
  id: string; // e.g. "AECP8-014"
  qrToken: string; // unique token encoded in the QR
  name: string;
  team: string;
  category: string; // competition category/track
  origin: string; // school / university / institution
  status: AttendanceStatus;
  checkedInAt: string | null; // ISO timestamp
  checkedInBy: string | null; // panitia name/id who scanned
}

export interface CheckinLogEntry {
  id: string;
  participantId: string;
  participantName: string;
  team: string;
  timestamp: string;
  scannedBy: string;
}
