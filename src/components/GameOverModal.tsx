import React, { useEffect, useState } from 'react';
import { MatchStats, Player } from '../types/ludo';
import { Trophy, Share2, Copy, Check, RotateCcw, Home, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  stats: MatchStats;
  players: Player[];
  onRematch: () => void;
  onHome: () => void;
  winStreak: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  players,
  onRematch,
  onHome,
  winStreak,
}) => {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#fbbf24'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Confetti fail-safe
    }
  }, []);

  // Sorted players by rank (1st, 2nd, 3rd, 4th)
  const rankedPlayers = [...players].sort((a, b) => {
    const rankA = a.rank || 99;
    const rankB = b.rank || 99;
    if (rankA !== rankB) return rankA - rankB;
    return b.tokensHome - a.tokensHome;
  });

  const winner = rankedPlayers[0];

  const shareText = `🎲 LUDO BLITZ Champion! 🏆\n${stats.winnerName} conquered the board in ${Math.floor(
    stats.durationSeconds / 60
  )}m ${stats.durationSeconds % 60}s!\n🔥 Win Streak: ${winStreak}\n⚔️ Captures: ${stats.capturesMade} | 🎲 Sixes: ${
    stats.sixesRolled
  }\nCan you defeat me? Play LUDO BLITZ now!`;

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyScore = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-center overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Winner Trophy Header */}
        <div className="relative inline-flex flex-col items-center mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center mb-2 animate-bounce">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950" />
          </div>
          <span className="text-xs uppercase tracking-widest font-black text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Match Concluded
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-0.5">
            {winner?.name || 'Player'} Wins!
          </h2>
          {winStreak > 1 && (
            <div className="flex items-center gap-1 px-3 py-0.5 mt-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{winStreak} Match Win Streak!</span>
            </div>
          )}
        </div>

        {/* Podium Rankings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-800/40 p-2.5 rounded-2xl border border-slate-700/50">
          {rankedPlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`flex flex-col items-center p-2 rounded-xl ${
                idx === 0 ? 'bg-amber-500/15 border border-amber-500/40' : 'bg-slate-900/40'
              }`}
            >
              <span className={`text-xs font-black ${idx === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : '4th'}
              </span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[75px] mt-0.5">
                {p.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {p.tokensHome} home
              </span>
            </div>
          ))}
        </div>

        {/* Detailed Match Statistics */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-900/80 rounded-2xl border border-slate-800 mb-4 text-left">
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Rolls</span>
            <span className="text-base font-black text-white">{stats.totalRolls}</span>
          </div>
          <div className="flex flex-col px-2 border-x border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Captures</span>
            <span className="text-base font-black text-rose-400">{stats.capturesMade}</span>
          </div>
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Sixes Rolled</span>
            <span className="text-base font-black text-amber-400">{stats.sixesRolled}</span>
          </div>
        </div>

        {/* Viral Sharing Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer no-underline"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </a>

          <button
            onClick={handleCopyScore}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Primary Action Buttons: Rematch & Main Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRematch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>

          <button
            onClick={onHome}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Main Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
