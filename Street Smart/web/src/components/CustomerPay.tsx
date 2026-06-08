'use client';
import { useState } from 'react';
import QRScanner from './QRScanner';
import PaymentForm from './PaymentForm';

export default function CustomerPay({ publicKey, onSent }: { publicKey: string; onSent: () => void }) {
  const [vendorAddress, setVendorAddress] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = (text: string) => {
    // 1. Look for a raw Stellar address (G... 56 chars)
    const addressMatch = text.match(/G[A-Z2-7]{55}/);
    
    // 2. Look for common URL patterns (stellar.expert, lab, etc) that contain an address
    // 3. Look for "stellar:G..." patterns
    
    if (addressMatch) {
      setVendorAddress(addressMatch[0]);
      setScanning(false);
    } else {
      // If it's a generic QR, we just show what we found and help the user
      alert(`Scanned Content: "${text}"\n\nNo Stellar address found. Please make sure the QR contains a valid address starting with 'G'.`);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {!vendorAddress && !scanning && (
        <div className="w-full max-w-md text-center">
          <button
            onClick={() => setScanning(true)}
            className="group flex w-full flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-gray-200 bg-white py-12 transition-all hover:border-emerald-300 hover:bg-emerald-50"
          >
            <div className="rounded-full bg-emerald-100 p-6 text-emerald-600 group-hover:bg-emerald-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">Scan QR to Pay</p>
              <p className="text-sm text-gray-500">Tap to open camera</p>
            </div>
          </button>
        </div>
      )}

      {scanning && (
        <div className="w-full flex flex-col items-center">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Scanning...</h2>

          <div className="w-full flex justify-center">
            <QRScanner onScan={handleScan} />
          </div>

          <div className="mt-4">
            <button
              onClick={() => setScanning(false)}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {vendorAddress && (
        <div className="w-full flex flex-col items-center">
          <div className="mb-4 w-full max-w-md flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Confirm Payment</h2>
            <button
              onClick={() => setVendorAddress(null)}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Scan Different Vendor
            </button>
          </div>
          <PaymentForm
            publicKey={publicKey}
            initialDestination={vendorAddress}
            onSent={onSent}
          />
        </div>
      )}
    </div>
  );
}
