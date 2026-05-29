import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, PlayCircle } from 'lucide-react';
import AdBanner from '../AdBanner';

interface MandatoryAdModalProps {
  isOpen: boolean;
  onAdComplete: () => void;
  onUpgradeClick: () => void;
  featureType: 'apps' | 'images' | 'videos';
}

export default function MandatoryAdModal({
  isOpen,
  onAdComplete,
  onUpgradeClick,
  featureType
}: MandatoryAdModalProps) {
  const [countdown, setCountdown] = useState(15); // Simulate 15 seconds ad watch
  const [adStarted, setAdStarted] = useState(false);

  useEffect(() => {
    if (isOpen && adStarted) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, adStarted, countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Usage Limit Reached</h2>
          <p className="text-sm text-neutral-400">
            You have reached your free usage limit for {featureType}. 
            To continue generating, please watch a short sponsor message or upgrade to Premium.
          </p>

          {!adStarted ? (
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={() => setAdStarted(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm transition"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Ad to Continue
              </button>
              
              <div className="text-xs text-neutral-500 uppercase">-- OR --</div>
              
              <button 
                onClick={onUpgradeClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm transition"
              >
                <Sparkles className="w-5 h-5" />
                Upgrade to Premium
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {/* Simulated Ad Container */}
              <div className="w-full h-48 bg-black rounded-xl border border-neutral-800 flex flex-col items-center justify-center overflow-hidden relative">
                <AdBanner adSlot="auto" adFormat="fluid" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 px-4 py-2 rounded-lg backdrop-blur text-white font-mono text-sm">
                    {countdown > 0 ? `Ad playing: ${countdown}s` : 'Ad Finished'}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onAdComplete}
                disabled={countdown > 0}
                className={`w-full font-bold py-4 rounded-xl text-sm uppercase tracking-widest transition-all
                  ${countdown > 0 
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
              >
                {countdown > 0 ? `Wait ${countdown}s` : 'Continue Generating'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
