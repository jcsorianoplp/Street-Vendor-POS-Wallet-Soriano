'use client';
import { useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import AddTrustline from '@/components/AddTrustline';
import VendorDashboard from '@/components/VendorDashboard';
import CustomerPay from '@/components/CustomerPay';

type Role = 'vendor' | 'customer';

export default function Home() {
  const wallet = useWallet();
  const { publicKey, connecting } = wallet;
  const [role, setRole] = useState<Role>('customer');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <header className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-emerald-600">
              STREET<span className="text-gray-900">SMART</span>
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Fast · Digital · Seamless Payments
            </p>
          </div>
          <ConnectWallet {...wallet} />
        </header>

        {!publicKey && !connecting && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-6 rounded-full bg-indigo-50 p-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Ready to go digital?</h2>
            <p className="mb-8 text-gray-500 text-center max-w-sm px-6">
              Connect your Freighter wallet to start accepting or sending payments instantly on the Stellar network.
            </p>
            <p className="text-sm text-gray-400">
              No wallet?{' '}
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 hover:underline"
              >
                Get Freighter
              </a>
            </p>
          </div>
        )}

        {publicKey && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex rounded-2xl bg-gray-200/50 p-1.5 backdrop-blur-sm">
                <button
                  onClick={() => setRole('customer')}
                  className={`rounded-xl px-8 py-3 text-sm font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-white text-emerald-600 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I am a Customer
                </button>
                <button
                  onClick={() => setRole('vendor')}
                  className={`rounded-xl px-8 py-3 text-sm font-bold transition-all ${
                    role === 'vendor'
                      ? 'bg-white text-emerald-600 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  I am a Vendor
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <FundAccount publicKey={publicKey} onFunded={refresh} />
              <AddTrustline publicKey={publicKey} onDone={refresh} />
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-500">
              {role === 'vendor' ? (
                <VendorDashboard publicKey={publicKey} />
              ) : (
                <CustomerPay publicKey={publicKey} onSent={refresh} />
              )}
            </div>
          </div>
        )}

        <footer className="mt-20 border-t border-gray-100 pt-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
            Powered by Stellar · StellarX PH
          </p>
        </footer>
      </div>
    </main>
  );
}
