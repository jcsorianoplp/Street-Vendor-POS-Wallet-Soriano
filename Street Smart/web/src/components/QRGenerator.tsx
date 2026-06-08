'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator({ value, size = 200 }: { value: string; size?: number }) {
  if (!value) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="rounded-lg border-4 border-emerald-50 p-2">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: '/globe.svg',
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Your Wallet Address</p>
        <p className="mt-1 break-all font-mono text-sm text-gray-600 max-w-[240px]">
          {value}
        </p>
      </div>
    </div>
  );
}
