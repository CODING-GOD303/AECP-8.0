'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface QrScannerProps {
  onDecode: (text: string) => void;
  paused: boolean;
}

const REGION_ID = 'aecp-absensi-qr-region';

export function QrScanner({ onDecode, paused }: QrScannerProps) {
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastDecodeRef = useRef<{ text: string; at: number }>({ text: '', at: 0 });

  const handleDecode = useCallback(
    (text: string) => {
      const now = Date.now();
      // debounce identical scans within 2.5s so one badge doesn't fire repeatedly
      if (text === lastDecodeRef.current.text && now - lastDecodeRef.current.at < 2500) {
        return;
      }
      lastDecodeRef.current = { text, at: now };
      onDecode(text);
    },
    [onDecode]
  );

  useEffect(() => {
    let mounted = true;
    let startedInstance: any = null;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!mounted) return;

      const instance = new Html5Qrcode(REGION_ID);
      scannerRef.current = instance;

      instance
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
          (decodedText: string) => handleDecode(decodedText),
          () => {
            /* ignore per-frame decode failures, this fires constantly while scanning */
          }
        )
        .then(() => {
          if (!mounted) {
            instance.stop().then(() => instance.clear()).catch(() => {});
            return;
          }
          startedInstance = instance;
          setReady(true);
        })
        .catch((err: unknown) => {
          if (!mounted) return;
          console.error(err);
          setError(
            'Could not access the camera. Check browser permissions or use a device with a camera.'
          );
        });
    });

    return () => {
      mounted = false;
      const instance = startedInstance ?? scannerRef.current;
      if (instance) {
        instance
          .stop()
          .then(() => instance.clear())
          .catch(() => {
            /* already stopped */
          });
      }
    };
  }, [handleDecode]);

  // Pause/resume camera scanning without tearing down the camera session
  useEffect(() => {
    const instance = scannerRef.current;
    if (!instance || !ready) return;
    if (paused) {
      instance.pause(true);
    } else {
      instance.resume();
    }
  }, [paused, ready]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      <div ref={containerRef} id={REGION_ID} className="aspect-square w-full [&_video]:object-cover" />

      {!ready && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
          <p className="text-sm">Starting camera…</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900 px-6 text-center">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      {/* corner reticle overlay, purely decorative to reinforce "scan here" */}
      {ready && !paused && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[60%] w-[60%] max-w-[260px]">
            {(['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'] as const).map(
              (cls, i) => (
                <span
                  key={i}
                  className={`absolute h-8 w-8 rounded-sm border-emerald-400/80 ${cls}`}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
