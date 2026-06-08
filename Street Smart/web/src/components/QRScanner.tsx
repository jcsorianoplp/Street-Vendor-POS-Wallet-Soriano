'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Ensure any existing instance is cleaned up
      if (qrCodeRef.current) {
        try {
          await qrCodeRef.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      qrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      // Start the camera
      await html5QrCode.start(
        { facingMode: "environment" }, // Prefer back camera
        config,
        (decodedText) => {
          html5QrCode.stop().then(() => onScan(decodedText)).catch(() => onScan(decodedText));
        },
        () => { /* ignore frame errors */ }
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera Start Error:", err);
      setIsCameraActive(false);
      
      if (err?.includes("NotAllowedError") || err?.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Please check your browser settings and reload.");
      } else if (err?.includes("NotFoundError") || err?.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError(`Camera Error: ${err?.message || "Could not start camera"}`);
      }
    }
  };

  useEffect(() => {
    // Small delay to ensure the DOM element #qr-reader is fully ready
    const timer = setTimeout(() => {
      startCamera();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (qrCodeRef.current && qrCodeRef.current.isScanning) {
        qrCodeRef.current.stop().catch(err => console.error('Cleanup failed:', err));
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use a fresh instance for file scanning to avoid conflicts with camera
    const html5QrCode = new Html5Qrcode("qr-reader-hidden");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      onScan(decodedText);
    } catch (err) {
      alert("Could not find a QR code in that image. Try a clearer photo.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
      <div className="bg-emerald-600 px-6 py-4 text-white">
        <h3 className="text-lg font-bold">QR Scanner</h3>
        <p className="text-xs opacity-80">Scan a vendor QR or upload an image</p>
      </div>

      <div className="p-6">
        <div className="relative overflow-hidden rounded-xl bg-black">
          {/* Main Camera View */}
          <div id="qr-reader" className="w-full min-h-[300px]" />
          
          {/* Overlay when not active */}
          {!isCameraActive && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 p-8 text-center text-white backdrop-blur-sm">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <p className="font-bold">Waiting for Camera...</p>
              <p className="mt-2 text-xs opacity-70">If it stays stuck, check if another tab is using the camera.</p>
            </div>
          )}

          {/* Error View */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 p-8 text-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mb-4 h-12 w-12 text-red-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="font-bold">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-6 rounded-lg bg-white px-6 py-2 text-sm font-bold text-red-900 shadow-lg hover:bg-gray-100"
              >
                Retry Camera
              </button>
            </div>
          )}
        </div>
        
        <div id="qr-reader-hidden" className="hidden" />

        <div className="mt-6 flex flex-col space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-4 font-bold text-gray-600 transition-all hover:bg-gray-100 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6.75v11.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
            Upload QR Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
}
