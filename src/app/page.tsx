import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 relative">
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Military Logistics Platform
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Blockchain-based checkpoint tracking and audit system
          </p>
          
          <Link
            href="/logistics"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 text-lg shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-105"
          >
            <Package className="w-6 h-6" />
            Launch Logistics System
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Package className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Checkpoint Tracking
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Record and track military delivery checkpoints with geolocation and blockchain verification
              </p>
            </div>
          </div>
          
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Package className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Visual Dashboard
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Top-down visualization of trucks and crates with real-time status updates
              </p>
            </div>
          </div>
          
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Package className="w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Audit System
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Blockchain-based verification and audit trails for complete transparency
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
