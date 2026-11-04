import React from 'react';
import { Achievement } from '../types/ludo';
import { Trophy, X, CheckCircle, Lock } from 'lucide-react';
import { sound } from '../services/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Achievements</h3>
              <p className="text-xs text-amber-400 font-semibold">
                {unlockedCount} of {achievements.length} Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of achievements */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-4 pr-1">
          {achievements.map((item) => {
            const pct = Math.min(100, Math.round((item.progress / item.maxProgress) * 100));

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  item.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-800/40 border-slate-700/50 opacity-80'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md ${
                    item.unlocked ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {item.unlocked ? item.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    {item.unlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.progress}/{item.maxProgress}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.description}</p>

                  {!item.unlocked && item.maxProgress > 1 && (
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
