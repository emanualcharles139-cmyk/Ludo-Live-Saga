import React from 'react';

interface AdSpaceProps {
  position: 'top' | 'bottom';
}

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  return (
    <aside
      aria-label="Advertisement Banner"
      className={`w-full max-w-[560px] mx-auto px-2 ${position === 'top' ? 'mb-1' : 'mt-1'}`}
    >
      <div className="w-full h-11 sm:h-12 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between px-3 text-slate-500 overflow-hidden select-none">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
            Ad
          </span>
          <span className="text-xs font-medium text-slate-400 truncate max-w-[220px] sm:max-w-none">
            Google AdSense Reserved Space (320x50 / 468x60)
          </span>
        </div>
        <span className="text-[10px] text-slate-600 hidden sm:inline">Ludo Blitz Sponsor</span>
      </div>
    </aside>
  );
};
