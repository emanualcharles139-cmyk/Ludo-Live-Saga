import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, X } from 'lucide-react';
import { sound } from '../services/audio';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xs bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onResume();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-2xl font-black text-white mb-1">Game Paused</h3>
        <p className="text-xs text-slate-400 mb-6">Take a breather</p>

        <div className="space-y-3">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm active:scale-95 transition-all cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>Sound: OFF</span>
              </>
            )}
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Restart Match</span>
          </button>

          {/* Quit */}
          <button
            onClick={() => {
              sound.playClick();
              onQuit();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-sm active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Exit to Menu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
