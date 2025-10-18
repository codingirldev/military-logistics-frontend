'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package, Truck, FileText, Loader2, Eye } from 'lucide-react';
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
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [crateState, setCrateState] = useState<any>(null);
  const [hexString, setHexString] = useState('');
  const [status, setStatus] = useState('');
  const [bgColor, setBgColor] = useState<'violet' | 'yellow'>('violet');

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

  const generateRandomHex = (length: number): string => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleReadState = async () => {
    setError(null);
    setReading(true);
    setCrateState(null);

    try {
      // Simulate reading crate state from blockchain
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random 64-character hex string
      const randomHex = generateRandomHex(64);
      setHexString(randomHex);

      // Randomly choose status
      const statuses = ['ok', 'open', 'damaged'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);

      // Randomly choose background color (violet or yellow)
      const colors: ('violet' | 'yellow')[] = ['violet', 'yellow'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setBgColor(randomColor);
      
      const state = {
        crateId,
        trackId,
        unitName,
        status: 'In Transit',
        lastCheckpoint: {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: { lat: 52.2297, lng: 21.0122 },
          operator: 'Operator-001'
        },
        totalCheckpoints: 3,
        verified: true
      };

      setCrateState(state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read crate state');
    } finally {
      setReading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-400';
      case 'open':
        return 'text-yellow-400';
      case 'damaged':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

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

        {/* Crate State Display */}
        {crateState && (
          <div className="space-y-3">
            {/* Hex String Input */}
            {hexString && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400 uppercase tracking-wide">
                  Crate ID (Hex)
                </label>
                <input
                  type="text"
                  value={hexString}
                  readOnly
                  className={`w-full px-4 py-3 rounded border-2 font-mono text-sm ${
                    bgColor === 'violet'
                      ? 'bg-violet-100 border-violet-300 text-violet-900'
                      : 'bg-yellow-100 border-yellow-300 text-yellow-900'
                  }`}
                />
              </div>
            )}

            {/* Status Display */}
            {status && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">Status:</span>
                <span className={`font-semibold ${getStatusColor(status)}`}>
                  {status.toUpperCase()}
                </span>
              </div>
            )}

            {/* Additional State Info */}
            <div className="bg-blue-900/30 border border-blue-700 text-blue-400 px-4 py-3 rounded">
              <p className="font-semibold mb-2">📦 Additional State Info</p>
              <div className="text-sm space-y-1">
                <p>Total Checkpoints: <span className="text-blue-300">{crateState.totalCheckpoints}</span></p>
                <p>Verified: <span className="text-blue-300">{crateState.verified ? 'Yes' : 'No'}</span></p>
                {crateState.lastCheckpoint && (
                  <p className="text-xs mt-2 pt-2 border-t border-blue-800">
                    Last: {new Date(crateState.lastCheckpoint.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Read State Button */}
        <button
          type="button"
          onClick={handleReadState}
          disabled={reading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
        >
          {reading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Reading State...
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Read Crate/Cargo Unit State
            </>
          )}
        </button>

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

