import React from 'react';
import { BookOpen, X, Shield, Star, Swords, Target, Zap } from 'lucide-react';
import { sound } from '../services/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      icon: <Target className="w-5 h-5 text-rose-400" />,
      title: 'Goal of the Game',
      desc: 'Move all your tokens from your yard around the board and into your center Home triangle.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Roll a 6 to Unlock',
      desc: 'You must roll a 6 to bring a token out of the yard. Rolling a 6 also gives you an extra turn! (3 sixes in a row skips turn).',
    },
    {
      icon: <Swords className="w-5 h-5 text-red-400" />,
      title: 'Capture Opponents',
      desc: "Landing on an opponent's token sends it straight back to their yard and earns you an immediate bonus roll!",
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      title: '8 Safe Squares',
      desc: 'Squares marked with Stars (including starting squares) are completely safe. Multiple tokens can safely coexist on stars.',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Home Run & Exact Roll',
      desc: 'Once inside your color home runway, you are immune to opponents. You need the exact dice roll to reach the center.',
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Quick Match Mode',
      desc: 'Want faster gameplay? Quick Match uses 2 tokens per player for intense 3-5 minute blitz battles!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">How to Play</h3>
              <p className="text-xs text-slate-400 font-semibold">Standard Indian Ludo Rules</p>
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                {rule.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Got it button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
        >
          Got It, Let's Play!
        </button>

      </div>
    </div>
  );
};
