import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';
import { X, Camera, CameraOff, RefreshCw, Flashlight, ZoomIn } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  title?: string;
  hint?: string;
}

type ScanStatus = 'requesting' | 'active' | 'error' | 'scanned';

export function BarcodeScanner({ onScan, onClose, title = 'Scan Barcode', hint }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [status, setStatus] = useState<ScanStatus>('requesting');
  const [errorMsg, setErrorMsg] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraIdx, setActiveCameraIdx] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const scannedRef = useRef(false);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startScanner = useCallback(async (cameraIdx: number) => {
    stopScanner();
    scannedRef.current = false;
    setStatus('requesting');
    setErrorMsg('');

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      // Enumerate devices
      let deviceList = cameras;
      if (deviceList.length === 0) {
        deviceList = await BrowserMultiFormatReader.listVideoInputDevices();
        setCameras(deviceList);
      }

      if (deviceList.length === 0) {
        setStatus('error');
        setErrorMsg('No camera found on this device.');
        return;
      }

      const deviceId = deviceList[cameraIdx]?.deviceId;

      const controls = await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current!,
        (result, err) => {
          if (scannedRef.current) return;
          if (result) {
            scannedRef.current = true;
            const text = result.getText();
            setLastScanned(text);
            setStatus('scanned');
            // Brief flash, then callback
            setTimeout(() => {
              stopScanner();
              onScan(text);
            }, 700);
          } else if (err && !(err instanceof NotFoundException)) {
            // Only surface non-trivial errors
            console.warn('ZXing decode error:', err);
          }
        }
      );

      controlsRef.current = controls;

      // Grab the live stream for torch control
      if (videoRef.current?.srcObject) {
        streamRef.current = videoRef.current.srcObject as MediaStream;
      }

      setStatus('active');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setErrorMsg('Camera permission was denied. Please allow camera access and try again.');
      } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('devicesnotfound')) {
        setErrorMsg('No camera found on this device.');
      } else {
        setErrorMsg(`Unable to start scanner: ${msg}`);
      }
      setStatus('error');
    }
  }, [cameras, onScan, stopScanner]);

  // Start on mount
  useEffect(() => {
    startScanner(0);
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = () => {
    if (cameras.length < 2) return;
    const nextIdx = (activeCameraIdx + 1) % cameras.length;
    setActiveCameraIdx(nextIdx);
    startScanner(nextIdx);
  };

  const toggleTorch = () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    const newVal = !torchOn;
    // @ts-expect-error – torch is not in TS lib yet
    track.applyConstraints({ advanced: [{ torch: newVal }] }).catch(() => {});
    setTorchOn(newVal);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#1a1a2e] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-white text-base font-semibold">{title}</h3>
            {hint && <p className="text-white/50 text-xs mt-0.5">{hint}</p>}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative mx-4 mb-2 rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
          {/* Video element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />

          {/* Scanning overlay */}
          {status === 'active' && (
            <>
              {/* Corner brackets */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-56 h-44">
                  {/* Top-left */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#4361EE] rounded-tl-lg" />
                  {/* Top-right */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#4361EE] rounded-tr-lg" />
                  {/* Bottom-left */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#4361EE] rounded-bl-lg" />
                  {/* Bottom-right */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#4361EE] rounded-br-lg" />

                  {/* Scanning line */}
                  <div className="absolute inset-x-2 h-0.5 bg-[#4361EE]/80 shadow-[0_0_8px_2px_rgba(67,97,238,0.6)] scan-line" />
                </div>
              </div>
              {/* Dim surround */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 14rem 11rem at center, transparent 50%, rgba(0,0,0,0.55) 100%)'
                }}
              />
            </>
          )}

          {/* Requesting permission */}
          {status === 'requesting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
              <div className="w-12 h-12 rounded-full border-2 border-[#4361EE] border-t-transparent animate-spin" />
              <p className="text-white/70 text-sm">Starting camera…</p>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                <CameraOff size={26} className="text-red-400" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{errorMsg}</p>
              <button
                onClick={() => startScanner(activeCameraIdx)}
                className="flex items-center gap-2 bg-[#4361EE] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}

          {/* Scanned success flash */}
          {status === 'scanned' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-green-900/70">
              <div className="w-14 h-14 rounded-full bg-green-500/30 flex items-center justify-center">
                <ZoomIn size={28} className="text-green-400" />
              </div>
              <p className="text-green-300 text-sm font-medium">Barcode detected!</p>
              <p className="text-white/60 text-xs font-mono">{lastScanned}</p>
            </div>
          )}
        </div>

        {/* Camera controls */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Torch */}
          <button
            onClick={toggleTorch}
            disabled={status !== 'active'}
            className={`flex flex-col items-center gap-1 transition-colors disabled:opacity-30 ${torchOn ? 'text-yellow-400' : 'text-white/50 hover:text-white/80'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${torchOn ? 'bg-yellow-400/20' : 'bg-white/10'}`}>
              <Flashlight size={18} />
            </div>
            <span className="text-[10px]">Torch</span>
          </button>

          {/* Status dot */}
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${
              status === 'active' ? 'bg-green-400 animate-pulse' :
              status === 'scanned' ? 'bg-green-400' :
              status === 'requesting' ? 'bg-amber-400 animate-pulse' :
              'bg-red-400'
            }`} />
            <span className="text-white/40 text-[10px]">
              {status === 'active' ? 'Scanning…' :
               status === 'scanned' ? 'Found!' :
               status === 'requesting' ? 'Starting…' : 'Error'}
            </span>
          </div>

          {/* Switch camera */}
          <button
            onClick={switchCamera}
            disabled={cameras.length < 2 || status === 'requesting'}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors disabled:opacity-30"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Camera size={18} />
            </div>
            <span className="text-[10px]">Switch</span>
          </button>
        </div>

        {/* Tip */}
        <p className="text-center text-white/30 text-xs pb-5 px-6">
          Position the barcode within the frame. It will be detected automatically.
        </p>
      </div>

      {/* Scan line animation */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 8px; }
          50%  { top: calc(100% - 8px); }
          100% { top: 8px; }
        }
        .scan-line {
          animation: scanLine 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}