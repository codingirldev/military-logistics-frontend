'use client';

import { useState } from 'react';
import { Package, Truck } from 'lucide-react';
import type { Crate, Track } from '@/types/logistics';
import CheckpointForm from './CheckpointForm';

interface TrackViewProps {
  track: Track;
  onCrateClick?: (crate: Crate) => void;
}

export default function TrackView({ track, onCrateClick }: TrackViewProps) {
  const [selectedCrate, setSelectedCrate] = useState<Crate | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCrateClick = (crate: Crate) => {
    setSelectedCrate(crate);
    setShowForm(true);
    if (onCrateClick) {
      onCrateClick(crate);
    }
  };

  const getStatusColor = (status: Crate['status']) => {
    switch (status) {
      case 'Loaded':
        return 'bg-blue-600';
      case 'In Transit':
        return 'bg-yellow-600';
      case 'Verified':
        return 'bg-green-600';
      case 'Delivered':
        return 'bg-gray-600';
      default:
        return 'bg-gray-700';
    }
  };

  const getStatusIcon = (status: Crate['status']) => {
    switch (status) {
      case 'Loaded':
        return '📦';
      case 'In Transit':
        return '🚚';
      case 'Verified':
        return '✓';
      case 'Delivered':
        return '✓✓';
      default:
        return '📦';
    }
  };

  // Create a grid representation (5x5 for visualization)
  const gridSize = 5;
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  // Place crates on grid
  track.crates.forEach(crate => {
    if (crate.position.row < gridSize && crate.position.col < gridSize) {
      grid[crate.position.row][crate.position.col] = crate;
    }
  });

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      {/* Track Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">{track.name}</h2>
            <p className="text-gray-400 text-sm">
              Status: <span className="text-green-400">{track.status}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Crates</p>
          <p className="text-white text-2xl font-bold">{track.crates.length}</p>
        </div>
      </div>

      {/* Grid Visualization */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">
          Top-Down View
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {grid.map((row, rowIndex) =>
            row.map((crate, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded border-2 border-gray-700 flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                  crate ? `${getStatusColor(crate.status)} border-gray-500` : 'bg-gray-800'
                }`}
                onClick={() => crate && handleCrateClick(crate)}
                title={crate ? `${crate.id} - ${crate.status}` : 'Empty slot'}
              >
                {crate ? (
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getStatusIcon(crate.status)}</div>
                    <div className="text-xs font-mono text-white">
                      {crate.id.split('-')[1]}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-xs">•</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Crate List */}
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">
          Crate Details
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {track.crates.map((crate) => (
            <div
              key={crate.id}
              className="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => handleCrateClick(crate)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(crate.status)}`} />
                <div>
                  <p className="text-white font-mono text-sm">{crate.id}</p>
                  <p className="text-gray-400 text-xs">{crate.unitName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">{crate.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkpoint Form Modal */}
      {showForm && selectedCrate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto">
            <CheckpointForm
              crateId={selectedCrate.id}
              trackId={track.id}
              unitName={selectedCrate.unitName}
              onSuccess={(checkpoint) => {
                console.log('Checkpoint recorded:', checkpoint);
                setShowForm(false);
                setSelectedCrate(null);
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedCrate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

