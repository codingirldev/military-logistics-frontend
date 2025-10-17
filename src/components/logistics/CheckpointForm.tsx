'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package, Truck, FileText, Loader2 } from 'lucide-react';
import { blockchainService } from '@/services/blockchain';
import type { Checkpoint } from '@/types/logistics';

interface CheckpointFormProps {
  crateId: string;
  trackId: string;
  unitName: string;
  onSuccess?: (checkpoint: Checkpoint) => void;
  onClose?: () => void;
}

export default function CheckpointForm({
  crateId,
  trackId,
  unitName,
  onSuccess,
  onClose
}: CheckpointFormProps) {
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [report, setReport] = useState('');
  const [operator, setOperator] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Set default location (Warsaw, Poland)
          setGeolocation({ lat: 52.2297, lng: 21.0122 });
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!geolocation) {
        throw new Error('Geolocation is required');
      }

      // Connect wallet if not already connected
      await blockchainService.connectWallet();

      // Record checkpoint on blockchain
      const hash = await blockchainService.recordCheckpoint({
        crateId,
        trackId,
        unitName,
        geolocation: {
          latitude: geolocation.lat,
          longitude: geolocation.lng,
          timestamp: Date.now()
        },
        report,
        operator,
        timestamp: Date.now()
      });

      setTxHash(hash);
      setSuccess(true);

      // Call success callback
      if (onSuccess) {
        const checkpoint: Checkpoint = {
          id: Date.now().toString(),
          crateId,
          trackId,
          unitName,
          geolocation: {
            latitude: geolocation.lat,
            longitude: geolocation.lng,
            timestamp: Date.now()
          },
          report,
          operator,
          timestamp: Date.now(),
          transactionHash: hash,
          verified: false,
          flagged: false
        };
        onSuccess(checkpoint);
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setReport('');
        setOperator('');
        setSuccess(false);
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record checkpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-green-500" />
          Record Checkpoint
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Crate Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
              Crate ID
            </label>
            <p className="text-white font-mono">{crateId}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
              Track ID
            </label>
            <p className="text-white font-mono">{trackId}</p>
          </div>
        </div>

        {/* Unit Name */}
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Unit Name
          </label>
          <p className="text-white">{unitName}</p>
        </div>

        {/* Geolocation */}
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Geolocation
          </label>
          {geolocation ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 text-sm">Lat:</span>
                <p className="text-white font-mono">{geolocation.lat.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Lng:</span>
                <p className="text-white font-mono">{geolocation.lng.toFixed(6)}</p>
              </div>
            </div>
          ) : (
            <p className="text-yellow-500 text-sm">Detecting location...</p>
          )}
        </div>

        {/* Operator */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            Operator Name
          </label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
            placeholder="Enter operator name"
          />
        </div>

        {/* Report */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Report / Notes
          </label>
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            required
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
            placeholder="Enter checkpoint report..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded">
            <p className="font-semibold mb-1">✓ Checkpoint recorded successfully!</p>
            {txHash && (
              <p className="text-xs font-mono break-all">
                TX: {txHash}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !geolocation}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Recording on Blockchain...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Record on Blockchain
            </>
          )}
        </button>
      </form>
    </div>
  );
}

