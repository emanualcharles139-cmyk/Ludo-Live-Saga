import React, { useState, useEffect } from 'react';
import { Gift, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../services/audio';

interface RewardedAdModalProps {
  isOpen: boolean;
  onAdCompleted: () => void;
  onClose: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onAdCompleted,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isWatching, setIsWatching] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setIsWatching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isWatching && countdown === 0) {
      sound.playSix();
      onAdCompleted();
    }
    return () => clearTimeout(timer);
  }, [isWatching, countdown, onAdCompleted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center">
        
        {/* Close Button */}
        {!isWatching && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-8 h-8 text-slate-950" />
        </div>

        <span className="text-xs uppercase tracking-widest font-black text-amber-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Bonus Perk
        </span>
        <h3 className="text-xl font-black text-white mt-0.5">Reroll Luck Boost</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-[280px] mx-auto">
          Watch a short sponsor placeholder to earn an instant Lucky Reroll this game!
        </p>

        <div className="my-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          {isWatching ? (
            <div className="flex flex-col items-center py-2">
              <span className="text-3xl font-black text-amber-400 animate-pulse">{countdown}s</span>
              <span className="text-xs text-slate-400 mt-1">Simulating sponsor video...</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              <p className="mb-1 text-slate-300 font-semibold">Sponsor Perk Ready</p>
              <p className="text-[11px]">No real ads are clicked or simulated automatically.</p>
            </div>
          )}
        </div>

        {isWatching ? (
          <div className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs">
            Reward unlocking soon...
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              setIsWatching(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Watch Short Demo (3s)</span>
          </button>
        )}
      </div>
    </div>
  );
};
