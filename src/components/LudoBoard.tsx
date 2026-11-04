import React from 'react';
import { Player, PlayerColor, Token } from '../types/ludo';
import { getTokenCoordinate } from '../services/ludoEngine';
import { Star, Trophy } from 'lucide-react';

interface LudoBoardProps {
  players: Player[];
  activePlayerColor: PlayerColor;
  legalTokens: Token[];
  animatingTokenId: string | null;
  onSelectToken: (token: Token) => void;
  canPickToken: boolean;
}

// 8 Classic Safe Squares on 15x15 board
const SAFE_SQUARES_MAP: Record<string, boolean> = {
  '8,1': true,   // Red start
  '12,6': true,  // Bottom arm star
  '13,8': true,  // Blue start
  '8,12': true,  // Right arm star
  '6,13': true,  // Yellow start
  '2,8': true,   // Top arm star
  '1,6': true,   // Green start
  '6,2': true,   // Left arm star
};

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  activePlayerColor,
  legalTokens,
  animatingTokenId,
  onSelectToken,
  canPickToken,
}) => {
  // Map all current active tokens by their cell coordinate string "r,c"
  // to calculate offsets if multiple tokens occupy the same cell.
  const tokenMap: Record<string, { token: Token; isLegal: boolean; player: Player }[]> = {};

  players.forEach((player) => {
    player.tokens.forEach((token) => {
      const coord = getTokenCoordinate(token);
      const key = `${coord.r},${coord.c}`;
      if (!tokenMap[key]) tokenMap[key] = [];
      const isLegal =
        canPickToken &&
        player.color === activePlayerColor &&
        legalTokens.some((lt) => lt.id === token.id && lt.color === token.color);
      tokenMap[key].push({ token, isLegal, player });
    });
  });

  return (
    <div className="relative w-full aspect-square max-w-[500px] sm:max-w-[560px] mx-auto select-none p-1 sm:p-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl shadow-2xl border-4 border-slate-700/80">
      
      {/* Board Surface */}
      <div className="relative w-full h-full bg-[#f8fafc] rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300">
        
        {/* SVG Base Layer: Yards, Arms, Runways, Safe Stars, Triangles */}
        <svg
          viewBox="0 0 15 15"
          className="w-full h-full block"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Gradients for Yards */}
            <radialGradient id="grad-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </radialGradient>
            <radialGradient id="grad-green" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            <radialGradient id="grad-yellow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <radialGradient id="grad-blue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>

            {/* Inner yard white dish shadow */}
            <filter id="yard-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0.1" stdDeviation="0.1" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 1. GREEN YARD (Top-Left 0..5, 0..5) */}
          <rect x="0" y="0" width="6" height="6" fill="url(#grad-green)" />
          <rect x="0.8" y="0.8" width="4.4" height="4.4" rx="0.6" fill="#ffffff" filter="url(#yard-shadow)" />
          {/* Green 4 Token Docks */}
          <circle cx="2" cy="2" r="0.8" fill="#d1fae5" stroke="#10b981" strokeWidth="0.1" />
          <circle cx="4" cy="2" r="0.8" fill="#d1fae5" stroke="#10b981" strokeWidth="0.1" />
          <circle cx="2" cy="4" r="0.8" fill="#d1fae5" stroke="#10b981" strokeWidth="0.1" />
          <circle cx="4" cy="4" r="0.8" fill="#d1fae5" stroke="#10b981" strokeWidth="0.1" />

          {/* 2. YELLOW YARD (Top-Right 9..14, 0..5) */}
          <rect x="9" y="0" width="6" height="6" fill="url(#grad-yellow)" />
          <rect x="9.8" y="0.8" width="4.4" height="4.4" rx="0.6" fill="#ffffff" filter="url(#yard-shadow)" />
          {/* Yellow 4 Token Docks */}
          <circle cx="11" cy="2" r="0.8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.1" />
          <circle cx="13" cy="2" r="0.8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.1" />
          <circle cx="11" cy="4" r="0.8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.1" />
          <circle cx="13" cy="4" r="0.8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.1" />

          {/* 3. RED YARD (Bottom-Left 0..5, 9..14) */}
          <rect x="0" y="9" width="6" height="6" fill="url(#grad-red)" />
          <rect x="0.8" y="9.8" width="4.4" height="4.4" rx="0.6" fill="#ffffff" filter="url(#yard-shadow)" />
          {/* Red 4 Token Docks */}
          <circle cx="2" cy="11" r="0.8" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.1" />
          <circle cx="4" cy="11" r="0.8" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.1" />
          <circle cx="2" cy="13" r="0.8" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.1" />
          <circle cx="4" cy="13" r="0.8" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.1" />

          {/* 4. BLUE YARD (Bottom-Right 9..14, 9..14) */}
          <rect x="9" y="9" width="6" height="6" fill="url(#grad-blue)" />
          <rect x="9.8" y="9.8" width="4.4" height="4.4" rx="0.6" fill="#ffffff" filter="url(#yard-shadow)" />
          {/* Blue 4 Token Docks */}
          <circle cx="11" cy="11" r="0.8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.1" />
          <circle cx="13" cy="11" r="0.8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.1" />
          <circle cx="11" cy="13" r="0.8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.1" />
          <circle cx="13" cy="13" r="0.8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.1" />

          {/* 5. GRID CELLS: Draw borders for 15x15 */}
          {Array.from({ length: 15 }).map((_, r) =>
            Array.from({ length: 15 }).map((_, c) => {
              // Exclude yard interiors and center 3x3 from standard white cell drawing
              const isYard =
                (r < 6 && c < 6) ||
                (r < 6 && c >= 9) ||
                (r >= 9 && c < 6) ||
                (r >= 9 && c >= 9);
              const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

              if (isYard || isCenter) return null;

              // Check special colored cells:
              // Home Runways:
              const isRedRunway = r === 7 && c >= 1 && c <= 5;
              const isGreenRunway = c === 7 && r >= 1 && r <= 5;
              const isYellowRunway = r === 7 && c >= 9 && c <= 13;
              const isBlueRunway = c === 7 && r >= 9 && r <= 13;

              // Starting cells:
              const isRedStart = r === 8 && c === 1;
              const isGreenStart = r === 1 && c === 6;
              const isYellowStart = r === 6 && c === 13;
              const isBlueStart = r === 13 && c === 8;

              let fillColor = '#ffffff';
              if (isRedRunway || isRedStart) fillColor = '#fee2e2';
              else if (isGreenRunway || isGreenStart) fillColor = '#d1fae5';
              else if (isYellowRunway || isYellowStart) fillColor = '#fef3c7';
              else if (isBlueRunway || isBlueStart) fillColor = '#dbeafe';

              return (
                <rect
                  key={`cell-${r}-${c}`}
                  x={c}
                  y={r}
                  width="1"
                  height="1"
                  fill={fillColor}
                  stroke="#cbd5e1"
                  strokeWidth="0.04"
                />
              );
            })
          )}

          {/* Entry Arrows on Start Squares */}
          {/* Red Start Arrow (8, 1) -> pointing right */}
          <polygon points="1.2,8.3 1.8,8.5 1.2,8.7" fill="#ef4444" />
          {/* Green Start Arrow (1, 6) -> pointing down */}
          <polygon points="6.3,1.2 6.5,1.8 6.7,1.2" fill="#10b981" />
          {/* Yellow Start Arrow (6, 13) -> pointing left */}
          <polygon points="13.8,6.3 13.2,6.5 13.8,6.7" fill="#f59e0b" />
          {/* Blue Start Arrow (13, 8) -> pointing up */}
          <polygon points="8.3,13.8 8.5,13.2 8.7,13.8" fill="#3b82f6" />

          {/* 6. CENTER 3x3 TRIANGLES (Rows 6..8, Cols 6..8) */}
          {/* Background center box */}
          <rect x="6" y="6" width="3" height="3" fill="#0f172a" />
          {/* Red Triangle (Left) */}
          <polygon points="6,6 7.5,7.5 6,9" fill="#ef4444" stroke="#ffffff" strokeWidth="0.06" />
          {/* Green Triangle (Top) */}
          <polygon points="6,6 7.5,7.5 9,6" fill="#10b981" stroke="#ffffff" strokeWidth="0.06" />
          {/* Yellow Triangle (Right) */}
          <polygon points="9,6 7.5,7.5 9,9" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.06" />
          {/* Blue Triangle (Bottom) */}
          <polygon points="6,9 7.5,7.5 9,9" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.06" />

          {/* Center Trophy / Blitz Emblem */}
          <circle cx="7.5" cy="7.5" r="0.65" fill="#1e293b" stroke="#fbbf24" strokeWidth="0.08" />
        </svg>

        {/* Center Golden Icon */}
        <div
          className="absolute pointer-events-none flex items-center justify-center text-amber-400"
          style={{
            left: `${(7.5 / 15) * 100}%`,
            top: `${(7.5 / 15) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md text-amber-300 animate-pulse" />
        </div>

        {/* 8 SAFE STARS OVERLAY */}
        {Object.keys(SAFE_SQUARES_MAP).map((key) => {
          const [rStr, cStr] = key.split(',');
          const r = parseInt(rStr, 10);
          const c = parseInt(cStr, 10);
          return (
            <div
              key={`star-${key}`}
              className="absolute pointer-events-none flex items-center justify-center opacity-70"
              style={{
                left: `${(c / 15) * 100}%`,
                top: `${(r / 15) * 100}%`,
                width: `${(1 / 15) * 100}%`,
                height: `${(1 / 15) * 100}%`,
              }}
            >
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 drop-shadow-sm" />
            </div>
          );
        })}

        {/* RUNWAY DIRECTIONAL ARROWS */}
        {/* Red runway arrow (col 1..5, row 7) */}
        <div
          className="absolute pointer-events-none flex items-center justify-center text-red-500 font-black text-[10px]"
          style={{ left: `${(5.2 / 15) * 100}%`, top: `${(7.05 / 15) * 100}%`, transform: 'scale(1.2)' }}
        >
          ▶
        </div>
        {/* Green runway arrow (col 7, row 1..5) */}
        <div
          className="absolute pointer-events-none flex items-center justify-center text-emerald-500 font-black text-[10px]"
          style={{ left: `${(7.05 / 15) * 100}%`, top: `${(5.2 / 15) * 100}%`, transform: 'scale(1.2) rotate(90deg)' }}
        >
          ▶
        </div>
        {/* Yellow runway arrow (col 9..13, row 7) */}
        <div
          className="absolute pointer-events-none flex items-center justify-center text-amber-500 font-black text-[10px]"
          style={{ left: `${(8.9 / 15) * 100}%`, top: `${(7.05 / 15) * 100}%`, transform: 'scale(1.2) rotate(180deg)' }}
        >
          ▶
        </div>
        {/* Blue runway arrow (col 7, row 9..13) */}
        <div
          className="absolute pointer-events-none flex items-center justify-center text-blue-500 font-black text-[10px]"
          style={{ left: `${(7.05 / 15) * 100}%`, top: `${(8.9 / 15) * 100}%`, transform: 'scale(1.2) rotate(270deg)' }}
        >
          ▶
        </div>

        {/* TOKENS LAYER */}
        {Object.entries(tokenMap).map(([coordKey, cellTokens]) => {
          const [rStr, cStr] = coordKey.split(',');
          const r = parseFloat(rStr);
          const c = parseFloat(cStr);

          const count = cellTokens.length;

          return cellTokens.map(({ token, isLegal }, idx) => {
            // Offset tokens if multiple exist on the same cell
            let offsetX = 0;
            let offsetY = 0;
            if (count === 2) {
              offsetX = idx === 0 ? -18 : 18;
              offsetY = idx === 0 ? -18 : 18;
            } else if (count === 3) {
              const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
              offsetX = Math.cos(angles[idx]) * 20;
              offsetY = Math.sin(angles[idx]) * 20;
            } else if (count >= 4) {
              const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
              offsetX = Math.cos(angles[idx % 4]) * 22;
              offsetY = Math.sin(angles[idx % 4]) * 22;
            }

            const isAnimating = animatingTokenId === `${token.color}-${token.id}`;

            // Colors for tokens
            const colorGradients: Record<PlayerColor, string> = {
              red: 'from-rose-500 via-red-600 to-red-800 border-red-300 ring-red-400',
              green: 'from-emerald-400 via-emerald-600 to-teal-800 border-emerald-200 ring-emerald-400',
              yellow: 'from-amber-300 via-yellow-500 to-amber-700 border-amber-100 ring-amber-300',
              blue: 'from-sky-400 via-blue-600 to-indigo-800 border-blue-200 ring-blue-400',
            };

            return (
              <div
                key={`tok-${token.color}-${token.id}`}
                onClick={isLegal ? () => onSelectToken(token) : undefined}
                className={`absolute transition-all duration-300 flex items-center justify-center ${
                  isLegal ? 'cursor-pointer z-30' : 'z-20 pointer-events-none'
                }`}
                style={{
                  left: `${((c + 0.5) / 15) * 100}%`,
                  top: `${((r + 0.5) / 15) * 100}%`,
                  transform: `translate(-50%, -50%) translate(${offsetX}%, ${offsetY}%) ${
                    isAnimating ? 'scale(1.25)' : 'scale(1)'
                  }`,
                  width: `${(1 / 15) * 100}%`,
                  height: `${(1 / 15) * 100}%`,
                }}
              >
                {/* Legal Move Pulsing Halo Ring */}
                {isLegal && (
                  <span className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-yellow-400/80 animate-ping pointer-events-none" />
                )}

                {/* 3D Pawn Token Body */}
                <div
                  className={`relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${
                    colorGradients[token.color]
                  } border-2 shadow-lg flex items-center justify-center transition-transform ${
                    isLegal
                      ? 'ring-2 ring-yellow-400 animate-bounce scale-110 shadow-yellow-500/50'
                      : 'shadow-black/50'
                  }`}
                  style={{
                    boxShadow: isLegal
                      ? '0 0 12px rgba(250, 204, 21, 0.9), 0 4px 8px rgba(0,0,0,0.4)'
                      : '0 3px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.6)',
                  }}
                >
                  {/* Pawn top spherical highlight */}
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 shadow-inner flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            );
          });
        })}

      </div>
    </div>
  );
};
