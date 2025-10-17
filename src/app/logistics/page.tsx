'use client';

import { useState } from 'react';
import { LayoutDashboard, Package, FileCheck, Shield, Menu, X } from 'lucide-react';
import TrackView from '@/components/logistics/TrackView';
import CheckpointTable from '@/components/logistics/CheckpointTable';
import AuditorPanel from '@/components/logistics/AuditorPanel';
import type { Track, Crate } from '@/types/logistics';

// Mock data for tracks and crates
const mockTracks: Track[] = [
  {
    id: 'TR-001',
    name: 'Alpha Convoy',
    status: 'In Transit',
    crates: [
      {
        id: 'CR-001',
        trackId: 'TR-001',
        unitName: 'Alpha Company',
        status: 'Loaded',
        position: { row: 0, col: 0 },
        color: 'blue'
      },
      {
        id: 'CR-002',
        trackId: 'TR-001',
        unitName: 'Bravo Company',
        status: 'In Transit',
        position: { row: 0, col: 1 },
        color: 'yellow'
      },
      {
        id: 'CR-003',
        trackId: 'TR-001',
        unitName: 'Charlie Company',
        status: 'Loaded',
        position: { row: 0, col: 2 },
        color: 'blue'
      },
      {
        id: 'CR-004',
        trackId: 'TR-001',
        unitName: 'Delta Company',
        status: 'Verified',
        position: { row: 1, col: 0 },
        color: 'green'
      },
      {
        id: 'CR-005',
        trackId: 'TR-001',
        unitName: 'Echo Company',
        status: 'In Transit',
        position: { row: 1, col: 1 },
        color: 'yellow'
      }
    ]
  },
  {
    id: 'TR-002',
    name: 'Bravo Convoy',
    status: 'Active',
    crates: [
      {
        id: 'CR-006',
        trackId: 'TR-002',
        unitName: 'Foxtrot Company',
        status: 'Loaded',
        position: { row: 0, col: 0 },
        color: 'blue'
      },
      {
        id: 'CR-007',
        trackId: 'TR-002',
        unitName: 'Golf Company',
        status: 'Loaded',
        position: { row: 0, col: 1 },
        color: 'blue'
      }
    ]
  }
];

type View = 'dashboard' | 'tracks' | 'checkpoints' | 'auditor';

export default function LogisticsPage() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTrack, setSelectedTrack] = useState<Track>(mockTracks[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCrateClick = (crate: Crate) => {
    console.log('Crate clicked:', crate);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-blue-400 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Military Logistics Checkpoint
              </span>
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            System Status: <span className="text-emerald-400 font-semibold">●</span> <span className="text-emerald-400">Operational</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)] relative z-10">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:relative lg:translate-x-0 w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-800 transition-transform duration-300 z-40 overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-blue-400 hover:border-blue-500/50 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setCurrentView('tracks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'tracks'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-blue-400 hover:border-blue-600/50 border border-transparent'
              }`}
            >
              <Package className="w-5 h-5" />
              Track View
            </button>

            <button
              onClick={() => setCurrentView('checkpoints')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'checkpoints'
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-500 text-white shadow-lg shadow-emerald-900/50'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/50 border border-transparent'
              }`}
            >
              <FileCheck className="w-5 h-5" />
              Checkpoints
            </button>

            <button
              onClick={() => setCurrentView('auditor')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentView === 'auditor'
                  ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-blue-300 hover:border-blue-700/50 border border-transparent'
              }`}
            >
              <Shield className="w-5 h-5" />
              Auditor Panel
            </button>
          </nav>

          {/* Track List */}
          <div className="p-4 border-t border-slate-800">
            <h3 className="text-xs text-blue-400 uppercase tracking-wide mb-3 px-4 font-semibold">
              Active Tracks
            </h3>
            <div className="space-y-2">
              {mockTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrack(track);
                    setCurrentView('tracks');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                    selectedTrack.id === track.id
                      ? 'bg-slate-800 border border-blue-500 shadow-lg shadow-blue-900/20'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-blue-400 hover:border-blue-500/50 border border-transparent'
                  }`}
                >
                  <p className="font-semibold text-sm">{track.name}</p>
                  <p className="text-xs text-gray-500">{track.id}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                    <p className="text-gray-400 text-sm mb-2">Active Tracks</p>
                    <p className="text-3xl font-bold text-blue-400">{mockTracks.length}</p>
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-sm border border-blue-600/30 rounded-lg p-6 hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                    <p className="text-gray-400 text-sm mb-2">Total Crates</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {mockTracks.reduce((sum, track) => sum + track.crates.length, 0)}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-6 hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20">
                    <p className="text-gray-400 text-sm mb-2">In Transit</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {mockTracks
                        .flatMap(t => t.crates)
                        .filter(c => c.status === 'In Transit').length}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <CheckpointTable />
              </div>
            </div>
          )}

          {currentView === 'tracks' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Track Visualization
              </h2>
              <TrackView track={selectedTrack} onCrateClick={handleCrateClick} />
            </div>
          )}

          {currentView === 'checkpoints' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Checkpoint Records
              </h2>
              <CheckpointTable />
            </div>
          )}

          {currentView === 'auditor' && (
            <div>
              <AuditorPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

