'use client';
import { useState, useEffect } from 'react';
import {
  buildPaymentXDR,
  submitSignedXDR,
  pollTransaction,
  type AssetCode,
} from '@/lib/payment';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';

type Status =
  | 'idle'
  | 'building'
  | 'signing'
  | 'submitting'
  | 'polling'
  | 'success'
  | 'error';

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Pay Now',
  building: 'Preparing…',
  signing: 'Authorize in Freighter…',
  submitting: 'Sending…',
  polling: 'Confirming…',
  success: 'Paid!',
  error: 'Try Again',
};

export default function PaymentForm({
  publicKey,
  initialDestination = '',
  onSent,
}: {
  publicKey: string;
  initialDestination?: string;
  onSent: () => void;
}) {
  const [destination, setDestination] = useState(initialDestination);
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<AssetCode>('XLM');
  const [status, setStatus] = useState<Status>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialDestination) setDestination(initialDestination);
  }, [initialDestination]);

  const busy = ['building', 'signing', 'submitting', 'polling'].includes(status);

  const handleSend = async () => {
    setStatus('building');
    setErrorMsg('');
    setTxHash('');
    try {
      const xdr = await buildPaymentXDR(publicKey, destination.trim(), amount, asset);

      setStatus('signing');
      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });
      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected',
        );
      }

      setStatus('submitting');
      const hash = await submitSignedXDR(signed.signedTxXdr);
      setTxHash(hash);

      setStatus('polling');
      await pollTransaction(hash);
      setStatus('success');
      onSent();
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Payment failed');
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Send Payment</h2>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Stellar Fast
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Pay To
          </label>
          <input
            type="text"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!!initialDestination || busy}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:opacity-70 transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={busy}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-medium text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Asset
            </label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as AssetCode)}
              disabled={busy}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all appearance-none"
            >
              <option value="XLM">XLM</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={busy || !destination || !amount}
          className={`w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
            status === 'success' ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {STATUS_LABEL[status]}
        </button>
      </div>

      {status === 'success' && (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
          <p className="font-bold text-emerald-800">Transaction Successful!</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-xs font-medium text-emerald-600 hover:underline"
          >
            Receipt: {txHash.slice(0, 10)}...{txHash.slice(-10)}
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-700">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
