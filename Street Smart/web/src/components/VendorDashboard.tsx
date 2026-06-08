'use client';
import { useState, useEffect } from 'react';
import { streamPayments } from '@/lib/stellar';
import QRGenerator from './QRGenerator';
import BalanceCard from './BalanceCard';

interface Sale {
  id: string;
  from: string;
  amount: string;
  asset_code?: string;
  created_at: string;
}

export default function VendorDashboard({ publicKey }: { publicKey: string }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!publicKey) return;

    // Stream incoming payments
    const unsubscribe = streamPayments(publicKey, (payment) => {
      // payment is a Horizon.ServerApi.PaymentOperationRecord
      // Check if it's an incoming payment
      if (payment.to === publicKey) {
        const newSale: Sale = {
          id: payment.id,
          from: payment.from,
          amount: payment.amount,
          asset_code: payment.asset_code,
          created_at: payment.created_at,
        };
        
        setSales((prev) => [newSale, ...prev].slice(0, 10)); // Keep last 10
        setRefreshKey((k) => k + 1); // Trigger balance refresh
        
        // Notification sound or visual could go here
        console.log('New sale received!', newSale);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [publicKey]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Receive Payments</h2>
          <QRGenerator value={publicKey} />
        </section>

        <section className="flex flex-col space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Your Wallet</h2>
          <BalanceCard publicKey={publicKey} refreshKey={refreshKey} />
          
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Live Sales Feed</h3>
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">Waiting for your first sale...</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {sales.map((sale) => (
                  <li key={sale.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <p className="text-xs font-mono text-gray-400">From: {sale.from.slice(0, 4)}...{sale.from.slice(-4)}</p>
                      <p className="text-xs text-gray-400">{new Date(sale.created_at).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+{sale.amount} {sale.asset_code || 'XLM'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
