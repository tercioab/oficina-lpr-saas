'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScan: (plate: string, data: any) => void;
  isScanning: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isScanning }) => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPlate, setLastPlate] = useState<string | null>(null);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ocr/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageSrc }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            const plate = result.data.plate;
            setLastPlate(plate);
            // Feedback tátil
            if (window.navigator.vibrate) window.navigator.vibrate(200);
            onScan(plate, result.data);
          } else {
            setError(result.detail || 'Placa não detectada');
          }
        } catch (err) {
          setError('Erro de conexão com o servidor');
        } finally {
          setLoading(false);
        }
      }
    }
  }, [onScan]);

  // Captura automática a cada 3 segundos se estiver escaneando
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && !loading) {
      interval = setInterval(capture, 3000);
    }
    return () => clearInterval(interval);
  }, [isScanning, loading, capture]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border-4 border-zinc-800 bg-black">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment' }}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay de Guia */}
      <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none">
        <div className="w-full h-full border-2 border-dashed border-zinc-400 rounded-lg"></div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 backdrop-blur-sm border border-zinc-700">
        <div className="flex items-center gap-2">
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          ) : lastPlate ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Camera className="w-5 h-5 text-zinc-400" />
          )}
          <span className="text-sm font-medium text-zinc-100">
            {loading ? 'Processando...' : lastPlate || 'Aponte para a placa'}
          </span>
        </div>
        
        {error && (
          <div className="flex items-center gap-1 text-red-500 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs uppercase font-bold">Erro</span>
          </div>
        )}
      </div>
      
      <button
        onClick={capture}
        disabled={loading}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-4 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
      >
        <Camera className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Scanner;
