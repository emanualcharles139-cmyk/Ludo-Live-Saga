import React from 'react';
import { DailyChallenge } from '../types/ludo';
import { Calendar, CheckCircle2, Award, X, Sparkles } from 'lucide-react';
import { sound } from '../services/audio';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: DailyChallenge;
  onClaim?: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
}) => {
  if (!isOpen) return null;

  const percentage = Math.min(100, Math.round((challenge.currentCount / challenge.targetCount) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-8 h-8 text-white" />
        </div>

        <span className="text-xs uppercase tracking-widest font-black text-cyan-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Daily Mission
        </span>
        <h3 className="text-xl font-black text-white mt-0.5">{challenge.title}</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-[280px] mx-auto">{challenge.description}</p>

        {/* Progress Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400">Mission Progress</span>
            <span className={challenge.completed ? 'text-emerald-400' : 'text-amber-400'}>
              {challenge.currentCount} / {challenge.targetCount} ({percentage}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                challenge.completed
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50 text-xs">
            <span className="text-slate-400">Reward</span>
            <span className="font-black text-yellow-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {challenge.rewardText}
            </span>
          </div>
        </div>

        {challenge.completed ? (
          <div className="py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Challenge Completed for Today!</span>
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-600/30 active:scale-95 transition-all cursor-pointer"
          >
            Play & Complete Mission
          </button>
        )}
      </div>
    </div>
  );
};
