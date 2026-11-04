export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type PlayerType = 'human' | 'ai';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameMode = '2P' | '3P' | '4P' | 'VS_AI' | 'QUICK';

export type TokenState = 'yard' | 'track' | 'home';

export interface Token {
  id: number; // 0 to 3 (or 0 to 1 for quick match)
  color: PlayerColor;
  step: number; // -1 for yard, 0..50 for outer track relative to player, 51..55 for home runway, 56 for finished home
  state: TokenState;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  type: PlayerType;
  difficulty?: AIDifficulty;
  tokens: Token[];
  tokensHome: number;
  rank?: number; // 1 for 1st place, etc.
  hasRolledSix: boolean;
}

export interface BoardCellCoord {
  r: number; // 0 to 14
  c: number; // 0 to 14
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoMoveSingleToken: boolean;
  quickAnimation: boolean;
}

export interface MatchStats {
  winnerColor: PlayerColor | null;
  winnerName: string;
  totalRolls: number;
  sixesRolled: number;
  capturesMade: number;
  tokensCaptured: number;
  durationSeconds: number;
  turnsPlayed: number;
  mode: GameMode;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface DailyChallenge {
  id: string;
  dateKey: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardText: string;
  completed: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentWinStreak: number;
  bestWinStreak: number;
  totalCaptures: number;
  totalSixes: number;
  quickMatchesWon: number;
  aiHardBeaten: number;
}
