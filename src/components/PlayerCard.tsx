import React from 'react';
import { Player, PlayerColor } from '../types/ludo';
import { Bot, User, Crown } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  totalTokensPerPlayer: number;
}

const COLOR_STYLES: Record<PlayerColor, {
  name: string;
  bg: string;
  border: string;
  activeBorder: string;
  activeRing: string;
  badge: string;
  text: string;
}> = {
  red: {
    name: 'Red',
    bg: 'bg-red-950/40',
    border: 'border-red-800/40',
    activeBorder: 'border-red-400',
    activeRing: 'ring-4 ring-red-500/40 shadow-lg shadow-red-500/30',
    badge: 'bg-red-500 text-white',
    text: 'text-red-400',
  },
  green: {
    name: 'Green',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/40',
    activeBorder: 'border-emerald-400',
    activeRing: 'ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/30',
    badge: 'bg-emerald-500 text-white',
    text: 'text-emerald-400',
  },
  yellow: {
    name: 'Yellow',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/40',
    activeBorder: 'border-amber-400',
    activeRing: 'ring-4 ring-amber-500/40 shadow-lg shadow-amber-500/30',
    badge: 'bg-amber-400 text-slate-950',
    text: 'text-amber-400',
  },
  blue: {
    name: 'Blue',
    bg: 'bg-blue-950/40',
    border: 'border-blue-800/40',
    activeBorder: 'border-blue-400',
    activeRing: 'ring-4 ring-blue-500/40 shadow-lg shadow-blue-500/30',
    badge: 'bg-blue-500 text-white',
    text: 'text-blue-400',
  },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, totalTokensPerPlayer }) => {
  const style = COLOR_STYLES[player.color];
  const inYard = player.tokens.filter((t) => t.state === 'yard').length;
  const onTrack = player.tokens.filter((t) => t.state === 'track').length;
  const inHome = player.tokens.filter((t) => t.state === 'home').length;

  return (
    <div
      className={`relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center justify-between border ${
        isActive ? `${style.activeBorder} ${style.activeRing} scale-[1.02] bg-slate-900/90` : `${style.border} ${style.bg} opacity-85`
      }`}
    >
      {/* Active turn indicator pulse */}
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
        </span>
      )}

      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md ${style.badge}`}>
          {player.rank ? (
            <Crown className="w-4 h-4 text-yellow-300 animate-bounce" />
          ) : player.type === 'ai' ? (
            <Bot className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[85px] sm:max-w-[110px]">
              {player.name}
            </span>
            {player.rank && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-yellow-500 text-black">
                #{player.rank}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {player.type === 'ai' ? `AI (${player.difficulty})` : 'Player'}
          </span>
        </div>
      </div>

      {/* Right: Token progress pills */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] font-semibold">
        <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded text-slate-300" title="Tokens in Yard">
          <span className="text-[9px] text-slate-400">Y:</span>
          <span>{inYard}</span>
        </div>
        <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded text-amber-300" title="Tokens on Board">
          <span className="text-[9px] text-slate-400">T:</span>
          <span>{onTrack}</span>
        </div>
        <div className="flex items-center gap-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold" title="Tokens Home">
          <span>{inHome}</span>
          <span className="text-[9px] text-emerald-400">/{totalTokensPerPlayer}</span>
        </div>
      </div>
    </div>
  );
};
