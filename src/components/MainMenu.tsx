import React, { useState } from 'react';
import { AIDifficulty, GameMode, PlayerColor, UserStats } from '../types/ludo';
import { Users, Bot, Zap, Trophy, Calendar, BookOpen, Volume2, VolumeX, Sparkles, ChevronRight, Crown } from 'lucide-react';
import { sound } from '../services/audio';

interface MainMenuProps {
  onStartGame: (
    mode: GameMode,
    playerCount: number,
    playerNames: string[],
    playerColors: PlayerColor[],
    humanColor: PlayerColor,
    aiDifficulty: AIDifficulty
  ) => void;
  onOpenDaily: () => void;
  onOpenAchievements: () => void;
  onOpenRules: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  userStats: UserStats;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenDaily,
  onOpenAchievements,
  onOpenRules,
  soundEnabled,
  onToggleSound,
  userStats,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('4P');
  const [humanColor, setHumanColor] = useState<PlayerColor>('red');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);

  const handleStart = () => {
    sound.playClick();
    let count = 4;
    let colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

    if (selectedMode === '2P') {
      count = 2;
      colors = ['red', 'yellow']; // Opposite corners for classic 2P
    } else if (selectedMode === '3P') {
      count = 3;
      colors = ['red', 'green', 'yellow'];
    } else if (selectedMode === '4P') {
      count = 4;
      colors = ['red', 'green', 'yellow', 'blue'];
    } else if (selectedMode === 'VS_AI') {
      count = 4;
      // Put human first, remaining 3 are bots
      const otherColors: PlayerColor[] = (['red', 'green', 'yellow', 'blue'] as PlayerColor[]).filter(
        (c) => c !== humanColor
      );
      colors = [humanColor, ...otherColors];
    } else if (selectedMode === 'QUICK') {
      count = 2;
      colors = ['red', 'yellow'];
    }

    onStartGame(selectedMode, count, playerNames, colors, humanColor, aiDifficulty);
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 py-2 flex flex-col justify-between overflow-y-auto">
      
      {/* Top Bar: Streaks & Settings */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-sm">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">
            {userStats.gamesWon} Wins
          </span>
          {userStats.currentWinStreak > 0 && (
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-orange-500 text-white ml-1">
              🔥 {userStats.currentWinStreak}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Rules */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            aria-label="Game Rules"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center my-2 sm:my-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Fast-Paced Indian Ludo
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 tracking-tight drop-shadow-md">
          LUDO BLITZ
        </h1>
        <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
          The Ultimate Mini Ludo Challenge
        </p>
      </div>

      {/* Mode Selector Cards */}
      <div className="space-y-2 my-2">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block text-left px-1">
          Select Game Mode
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* 4 Players */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('4P');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedMode === '4P'
                ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-400">Classic</span>
            </div>
            <div className="text-sm font-black text-white">4 Players</div>
            <div className="text-[10px] text-slate-400">All 4 colors battle</div>
          </button>

          {/* Play Against Computer */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('VS_AI');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedMode === 'VS_AI'
                ? 'bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400">Solo</span>
            </div>
            <div className="text-sm font-black text-white">Vs Computer</div>
            <div className="text-[10px] text-slate-400">Human vs Smart Bots</div>
          </button>

          {/* 2 Players */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('2P');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedMode === '2P'
                ? 'bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400">Duel</span>
            </div>
            <div className="text-sm font-black text-white">2 Players</div>
            <div className="text-[10px] text-slate-400">Head-to-head match</div>
          </button>

          {/* Quick Match */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('QUICK');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedMode === 'QUICK'
                ? 'bg-gradient-to-br from-amber-950/80 to-rose-950/80 border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black text-amber-400">Blitz</span>
            </div>
            <div className="text-sm font-black text-white">Quick Match</div>
            <div className="text-[10px] text-slate-400">2 tokens, 3-min rush</div>
          </button>
        </div>
      </div>

      {/* Mode Sub-Settings: Color & AI Difficulty if Vs Computer */}
      {selectedMode === 'VS_AI' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 my-1 space-y-2.5 text-left">
          {/* Pick Color */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Your Color
            </span>
            <div className="grid grid-cols-4 gap-2">
              {(['red', 'green', 'yellow', 'blue'] as PlayerColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sound.playClick();
                    setHumanColor(c);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer border ${
                    humanColor === c
                      ? 'border-white text-white shadow-md scale-105'
                      : 'border-transparent text-slate-400 opacity-60 hover:opacity-100'
                  } ${
                    c === 'red'
                      ? 'bg-red-600'
                      : c === 'green'
                      ? 'bg-emerald-600'
                      : c === 'yellow'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-blue-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              AI Difficulty
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    sound.playClick();
                    setAiDifficulty(diff);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                    aiDifficulty === diff
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Player Names for Local Multiplayer */}
      {selectedMode !== 'VS_AI' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 my-1 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Player Names
          </span>
          <div className="grid grid-cols-2 gap-2">
            {playerNames
              .slice(0, selectedMode === '2P' || selectedMode === 'QUICK' ? 2 : selectedMode === '3P' ? 3 : 4)
              .map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={12}
                  value={name}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[idx] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  placeholder={`Player ${idx + 1}`}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                />
              ))}
          </div>
        </div>
      )}

      {/* Quick Access Badges: Daily & Achievements */}
      <div className="grid grid-cols-2 gap-2 my-2">
        <button
          onClick={() => {
            sound.playClick();
            onOpenDaily();
          }}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Daily Mission</div>
              <div className="text-[10px] text-slate-400">Daily Rewards</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenAchievements();
          }}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Trophies</div>
              <div className="text-[10px] text-slate-400">Achievements</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* PLAY BUTTON */}
      <div className="pt-2 pb-1">
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-black text-base uppercase tracking-wider shadow-xl shadow-orange-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>START MATCH</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};
