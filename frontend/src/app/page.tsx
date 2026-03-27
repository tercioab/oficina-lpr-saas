'use client';

import React, { useState } from 'react';
import Scanner from '@/components/Scanner';
import { LogOut, History, User, Search, Car, Settings } from 'lucide-react';

export default function Dashboard() {
  const [scannedPlate, setScannedPlate] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [isCapturing, setIsCapturing] = useState(true);

  const handleScan = (plate: string, data: any) => {
    setScannedPlate(plate);
    setVehicleData(data);
    setIsCapturing(false); // Pausa para ver o resultado
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-blue-500">
            LPR<span className="text-zinc-400">SAAS</span>
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Oficina Pro</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
          <User className="w-5 h-5 text-zinc-400" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto space-y-6">
        {/* Scanner View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">Scanner de Placas</h2>
            <button 
              onClick={() => setIsCapturing(!isCapturing)}
              className="text-xs font-bold text-blue-500 uppercase hover:underline"
            >
              {isCapturing ? 'Pausar' : 'Ativar Câmera'}
            </button>
          </div>
          <Scanner onScan={handleScan} isScanning={isCapturing} />
        </div>

        {/* Results Card */}
        {scannedPlate && (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase">Resultado</span>
                <h3 className="text-4xl font-black tracking-tight mt-1">{scannedPlate}</h3>
              </div>
              <div className="px-3 py-1 bg-green-900/30 text-green-500 border border-green-800 rounded-full text-[10px] font-bold uppercase">
                {vehicleData?.type || 'VALIDO'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-colors font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-95">
                <Car className="w-4 h-4" />
                ABRIR CHECKLIST
              </button>
              <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors font-bold text-sm active:scale-95">
                <History className="w-4 h-4 text-zinc-400" />
                HISTÓRICO
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col items-start gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold uppercase text-zinc-400">Manual</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col items-start gap-2">
            <Settings className="w-5 h-5 text-zinc-600" />
            <span className="text-xs font-bold uppercase text-zinc-400">Config</span>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <nav className="fixed bottom-6 left-4 right-4 h-16 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 flex items-center justify-around shadow-2xl">
        <button className="p-3 text-blue-500"><Search className="w-6 h-6" /></button>
        <button className="w-20 h-20 -mt-10 rounded-full bg-blue-600 border-8 border-zinc-950 flex items-center justify-center shadow-xl shadow-blue-900/40 transform active:scale-90 transition-transform">
          <CameraIcon className="w-8 h-8 text-white" />
        </button>
        <button className="p-3 text-zinc-500"><LogOut className="w-6 h-6" /></button>
      </nav>
    </div>
  );
}

function CameraIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
