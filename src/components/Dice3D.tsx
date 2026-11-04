import React from 'react';
import { PlayerColor } from '../types/ludo';
import { Sparkles } from 'lucide-react';

interface Dice3DProps {
  value: number;
  isRolling: boolean;
  canRoll: boolean;
  currentColor: PlayerColor;
  onRoll: () => void;
  isAI: boolean;
  message?: string;
}

const COLOR_ACCENTS: Record<PlayerColor, { bg: string; border: string; glow: string; text: string; btn: string }> = {
  red: {
    bg: 'bg-red-500',
    border: 'border-red-400',
    glow: 'shadow-red-500/50',
    text: 'text-red-400',
    btn: 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 active:scale-95',
  },
  green: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    glow: 'shadow-emerald-500/50',
    text: 'text-emerald-400',
    btn: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95',
  },
  yellow: {
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    glow: 'shadow-amber-500/50',
    text: 'text-amber-400',
    btn: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 active:scale-95',
  },
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-400',
    btn: 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 active:scale-95',
  },
};

// Render standard pips on dice face
function renderPips(value: number, color: PlayerColor) {
  const pipColor = color === 'yellow' ? 'bg-amber-900' : 'bg-slate-900';

  const pipPositions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const activeIndices = new Set(pipPositions[value] || [4]);

  return (
    <div className="grid grid-cols-3 grid-rows-3 w-12 h-12 p-1.5 gap-1 place-items-center">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="w-2.5 h-2.5 flex items-center justify-center">
          {activeIndices.has(i) && (
            <div className={`w-2.5 h-2.5 rounded-full ${pipColor} shadow-inner transition-transform`} />
          )}
        </div>
      ))}
    </div>
  );
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isRolling,
  canRoll,
  currentColor,
  onRoll,
  isAI,
  message,
}) => {
  const theme = COLOR_ACCENTS[currentColor];

  return (
    <div className="flex flex-col items-center justify-center gap-2 select-none">
      {/* Visual notification message above dice */}
      {message && (
        <div className="text-xs sm:text-sm font-bold tracking-wide animate-bounce flex items-center gap-1 text-yellow-300 drop-shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{message}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* 3D-styled physical dice button */}
        <button
          onClick={canRoll && !isAI && !isRolling ? onRoll : undefined}
          disabled={!canRoll || isAI || isRolling}
          aria-label="Roll Dice"
          className={`relative group p-1.5 rounded-2xl transition-all duration-200 ${
            canRoll && !isAI
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'opacity-90 cursor-default'
          }`}
        >
          {/* Glowing pulse ring if ready to roll */}
          {canRoll && !isAI && !isRolling && (
            <span className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 opacity-75 blur-sm animate-pulse`} />
          )}

          {/* Dice Body */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white via-slate-100 to-slate-300 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white/80 transition-transform ${
              isRolling ? 'animate-spin' : ''
            }`}
            style={{
              boxShadow: isRolling
                ? '0 0 25px rgba(255,255,255,0.8), 0 10px 20px rgba(0,0,0,0.5)'
                : '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.2)',
            }}
          >
            {/* Gloss reflection shine */}
            <div className="absolute top-1 left-2 right-2 h-3 bg-white/60 rounded-full blur-[1px] pointer-events-none" />

            {/* Pips */}
            {renderPips(value, currentColor)}
          </div>
        </button>

        {/* Action button */}
        <div className="flex flex-col items-start justify-center">
          <button
            onClick={onRoll}
            disabled={!canRoll || isAI || isRolling}
            className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-lg ${
              canRoll && !isAI
                ? `${theme.btn} shadow-${currentColor}-500/40 text-white cursor-pointer`
                : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
            }`}
          >
            {isRolling ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rolling...
              </span>
            ) : isAI ? (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                AI Rolling...
              </span>
            ) : canRoll ? (
              'TAP TO ROLL'
            ) : (
              'PICK TOKEN'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
