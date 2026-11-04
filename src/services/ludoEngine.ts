import { BoardCellCoord, PlayerColor, Player, Token, AIDifficulty } from '../types/ludo';

export const TRACK_COORDS: BoardCellCoord[] = [
  /* 0 - Red start */  { r: 8, c: 1 },
  /* 1 */              { r: 8, c: 2 },
  /* 2 */              { r: 8, c: 3 },
  /* 3 */              { r: 8, c: 4 },
  /* 4 */              { r: 8, c: 5 },
  /* 5 */              { r: 9, c: 6 },
  /* 6 */              { r: 10, c: 6 },
  /* 7 */              { r: 11, c: 6 },
  /* 8 - Safe star */  { r: 12, c: 6 },
  /* 9 */              { r: 13, c: 6 },
  /* 10 */             { r: 14, c: 6 },
  /* 11 - Bottom cap */{ r: 14, c: 7 },
  /* 12 */             { r: 14, c: 8 },
  /* 13 - Blue start */{ r: 13, c: 8 },
  /* 14 */             { r: 12, c: 8 },
  /* 15 */             { r: 11, c: 8 },
  /* 16 */             { r: 10, c: 8 },
  /* 17 */             { r: 9, c: 8 },
  /* 18 */             { r: 8, c: 9 },
  /* 19 */             { r: 8, c: 10 },
  /* 20 */             { r: 8, c: 11 },
  /* 21 - Safe star */ { r: 8, c: 12 },
  /* 22 */             { r: 8, c: 13 },
  /* 23 */             { r: 8, c: 14 },
  /* 24 - Right cap */ { r: 7, c: 14 },
  /* 25 */             { r: 6, c: 14 },
  /* 26 - Yellow start */{ r: 6, c: 13 },
  /* 27 */             { r: 6, c: 12 },
  /* 28 */             { r: 6, c: 11 },
  /* 29 */             { r: 6, c: 10 },
  /* 30 */             { r: 6, c: 9 },
  /* 31 */             { r: 5, c: 8 },
  /* 32 */             { r: 4, c: 8 },
  /* 33 */             { r: 3, c: 8 },
  /* 34 - Safe star */ { r: 2, c: 8 },
  /* 35 */             { r: 1, c: 8 },
  /* 36 */             { r: 0, c: 8 },
  /* 37 - Top cap */   { r: 0, c: 7 },
  /* 38 */             { r: 0, c: 6 },
  /* 39 - Green start */{ r: 1, c: 6 },
  /* 40 */             { r: 2, c: 6 },
  /* 41 */             { r: 3, c: 6 },
  /* 42 */             { r: 4, c: 6 },
  /* 43 */             { r: 5, c: 6 },
  /* 44 */             { r: 6, c: 5 },
  /* 45 */             { r: 6, c: 4 },
  /* 46 */             { r: 6, c: 3 },
  /* 47 - Safe star */ { r: 6, c: 2 },
  /* 48 */             { r: 6, c: 1 },
  /* 49 */             { r: 6, c: 0 },
  /* 50 - Left cap */  { r: 7, c: 0 },
  /* 51 */             { r: 8, c: 0 },
];

export const COLOR_START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39,
};

export const SAFE_TRACK_INDICES = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

export const YARD_SLOT_COORDS: Record<PlayerColor, BoardCellCoord[]> = {
  red: [
    { r: 10.5, c: 1.5 },
    { r: 10.5, c: 3.5 },
    { r: 12.5, c: 1.5 },
    { r: 12.5, c: 3.5 },
  ],
  green: [
    { r: 1.5, c: 1.5 },
    { r: 1.5, c: 3.5 },
    { r: 3.5, c: 1.5 },
    { r: 3.5, c: 3.5 },
  ],
  yellow: [
    { r: 1.5, c: 10.5 },
    { r: 1.5, c: 12.5 },
    { r: 3.5, c: 10.5 },
    { r: 3.5, c: 12.5 },
  ],
  blue: [
    { r: 10.5, c: 10.5 },
    { r: 10.5, c: 12.5 },
    { r: 12.5, c: 10.5 },
    { r: 12.5, c: 12.5 },
  ],
};

export const HOME_DESTINATIONS: Record<PlayerColor, BoardCellCoord> = {
  red: { r: 7, c: 6 },
  blue: { r: 8, c: 7 },
  yellow: { r: 7, c: 8 },
  green: { r: 6, c: 7 },
};

/**
 * Get board coordinate for a token at a given step.
 * Step -1: Yard slot
 * Step 0..50: Outer track
 * Step 51..55: Home runway
 * Step 56: Home center
 */
export function getTokenCoordinate(token: Token): BoardCellCoord {
  const { color, step, id } = token;

  if (step === -1) {
    return YARD_SLOT_COORDS[color][id] || { r: 0, c: 0 };
  }

  if (step >= 0 && step <= 50) {
    const globalIdx = (COLOR_START_INDEX[color] + step) % 52;
    return TRACK_COORDS[globalIdx];
  }

  if (step >= 51 && step <= 55) {
    const offset = step - 50; // 1 to 5
    switch (color) {
      case 'red':
        return { r: 7, c: offset };
      case 'blue':
        return { r: 14 - offset, c: 7 };
      case 'yellow':
        return { r: 7, c: 14 - offset };
      case 'green':
        return { r: offset, c: 7 };
    }
  }

  // Home
  return HOME_DESTINATIONS[color];
}

/**
 * Get global track index for a token on the outer track. Returns -1 if not on track.
 */
export function getGlobalTrackIndex(token: Token): number {
  if (token.step < 0 || token.step > 50) return -1;
  return (COLOR_START_INDEX[token.color] + token.step) % 52;
}

/**
 * Check if a token can legally move given a dice roll.
 */
export function canTokenMove(token: Token, diceRoll: number): boolean {
  if (token.step === 56) return false; // Already home

  if (token.step === -1) {
    return diceRoll === 6; // Needs 6 to exit yard
  }

  // Exact roll required to reach or enter home
  return token.step + diceRoll <= 56;
}

/**
 * Get all tokens of a player that can legally move with the given roll.
 */
export function getLegalTokens(player: Player, diceRoll: number): Token[] {
  return player.tokens.filter((t) => canTokenMove(t, diceRoll));
}

/**
 * Returns the path of coordinates a token will step through during animation.
 */
export function getAnimationPath(token: Token, diceRoll: number): BoardCellCoord[] {
  const path: BoardCellCoord[] = [];
  const currentStep = token.step;

  if (currentStep === -1 && diceRoll === 6) {
    // Moves directly from yard to start square
    path.push(YARD_SLOT_COORDS[token.color][token.id]);
    path.push(getTokenCoordinate({ ...token, step: 0 }));
    return path;
  }

  for (let s = currentStep + 1; s <= currentStep + diceRoll && s <= 56; s++) {
    path.push(getTokenCoordinate({ ...token, step: s }));
  }

  return path;
}

/**
 * Determine if moving a token will capture an opponent token.
 * Returns the captured token if any, or null.
 */
export function findCapturedToken(
  movingToken: Token,
  diceRoll: number,
  allPlayers: Player[]
): Token | null {
  const targetStep = movingToken.step === -1 ? 0 : movingToken.step + diceRoll;

  // Captures can only happen on the outer track (steps 0 to 50)
  if (targetStep < 0 || targetStep > 50) return null;

  const targetGlobalIdx = (COLOR_START_INDEX[movingToken.color] + targetStep) % 52;

  // Safe squares cannot have captures
  if (SAFE_TRACK_INDICES.has(targetGlobalIdx)) return null;

  for (const player of allPlayers) {
    if (player.color === movingToken.color) continue;
    for (const enemyToken of player.tokens) {
      if (enemyToken.state === 'track') {
        const enemyGlobalIdx = getGlobalTrackIndex(enemyToken);
        if (enemyGlobalIdx === targetGlobalIdx) {
          return enemyToken;
        }
      }
    }
  }

  return null;
}

/**
 * AI Decision Maker supporting Easy, Medium, and Hard difficulties.
 */
export function chooseAIMove(
  aiPlayer: Player,
  legalTokens: Token[],
  diceRoll: number,
  allPlayers: Player[],
  difficulty: AIDifficulty = 'medium'
): Token | null {
  if (legalTokens.length === 0) return null;
  if (legalTokens.length === 1) return legalTokens[0];

  if (difficulty === 'easy') {
    // 60% random choice, 40% simple heuristic
    if (Math.random() < 0.6) {
      const randIdx = Math.floor(Math.random() * legalTokens.length);
      return legalTokens[randIdx];
    }
  }

  let bestToken = legalTokens[0];
  let bestScore = -9999;

  for (const token of legalTokens) {
    let score = 0;
    const targetStep = token.step === -1 ? 0 : token.step + diceRoll;

    // 1. Capture Opportunity
    const willCapture = findCapturedToken(token, diceRoll, allPlayers);
    if (willCapture) {
      score += difficulty === 'hard' ? 200 : 120;
    }

    // 2. Reaching Home
    if (targetStep === 56) {
      score += difficulty === 'hard' ? 150 : 100;
    }

    // 3. Entering Safe Runway
    if (targetStep >= 51 && targetStep < 56 && token.step < 51) {
      score += 70;
    }

    // 4. Exiting Yard on 6
    if (token.step === -1) {
      // If we already have multiple tokens out, maybe advance them instead
      const tokensOut = aiPlayer.tokens.filter((t) => t.step >= 0 && t.step < 56).length;
      score += tokensOut === 0 ? 90 : 60;
    }

    // 5. Landing on a Safe Square
    if (targetStep >= 0 && targetStep <= 50) {
      const targetGlobal = (COLOR_START_INDEX[token.color] + targetStep) % 52;
      if (SAFE_TRACK_INDICES.has(targetGlobal)) {
        score += 45;
      }
    }

    // 6. Hard AI Danger Assessment
    if (difficulty === 'hard') {
      // Check if current position is in danger and moving helps escape
      if (token.step >= 0 && token.step <= 50) {
        const currentGlobal = getGlobalTrackIndex(token);
        if (!SAFE_TRACK_INDICES.has(currentGlobal)) {
          let underThreat = false;
          for (const opp of allPlayers) {
            if (opp.color === aiPlayer.color) continue;
            for (const ot of opp.tokens) {
              if (ot.state === 'track') {
                const oppGlobal = getGlobalTrackIndex(ot);
                const distance = (currentGlobal - oppGlobal + 52) % 52;
                if (distance >= 1 && distance <= 6) {
                  underThreat = true;
                  break;
                }
              }
            }
          }
          if (underThreat) {
            score += 65; // High priority to escape
          }
        }
      }

      // Check if target position puts token in danger
      if (targetStep >= 0 && targetStep <= 50) {
        const targetGlobal = (COLOR_START_INDEX[token.color] + targetStep) % 52;
        if (!SAFE_TRACK_INDICES.has(targetGlobal)) {
          for (const opp of allPlayers) {
            if (opp.color === aiPlayer.color) continue;
            for (const ot of opp.tokens) {
              if (ot.state === 'track') {
                const oppGlobal = getGlobalTrackIndex(ot);
                const distance = (targetGlobal - oppGlobal + 52) % 52;
                if (distance >= 1 && distance <= 6) {
                  score -= 30; // Risky move
                }
              }
            }
          }
        }
      }
    }

    // General progress bonus (furthest along or closest to home)
    score += targetStep * 1.2;

    if (score > bestScore) {
      bestScore = score;
      bestToken = token;
    }
  }

  return bestToken;
}
