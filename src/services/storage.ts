import { Achievement, DailyChallenge, GameSettings, UserStats } from '../types/ludo';

const STORAGE_KEYS = {
  SETTINGS: 'ludo_blitz_settings_v1',
  STATS: 'ludo_blitz_stats_v1',
  ACHIEVEMENTS: 'ludo_blitz_achievements_v1',
  DAILY: 'ludo_blitz_daily_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  autoMoveSingleToken: false,
  quickAnimation: false,
};

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  totalCaptures: 0,
  totalSixes: 0,
  quickMatchesWon: 0,
  aiHardBeaten: 0,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Crown',
    description: 'Win your very first match in Ludo Blitz',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'first_capture',
    title: 'Blitz Hunter',
    description: 'Capture your first opponent token',
    icon: '⚔️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'triple_six',
    title: 'Sixer Master',
    description: 'Roll a total of 25 sixes across all games',
    icon: '🎲',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Achieve a winning streak of 3 games in a row',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'beat_hard_ai',
    title: 'Grandmaster',
    description: 'Defeat Hard AI in a Computer match',
    icon: '🤖',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'quick_master',
    title: 'Speed Demon',
    description: 'Win 3 Quick Match games',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'capture_15',
    title: 'Board Dominator',
    description: 'Capture 15 opponent tokens in your career',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
  },
  {
    id: 'home_run_quad',
    title: 'Flawless Finish',
    description: 'Bring all 4 tokens home in a single classic match',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

class StorageManager {
  public getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }

  public getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  }

  public saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }

  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!data) return INITIAL_ACHIEVEMENTS;
      const saved: Achievement[] = JSON.parse(data);
      // Merge with latest structure in case new achievements were added
      return INITIAL_ACHIEVEMENTS.map((init) => {
        const found = saved.find((s) => s.id === init.id);
        return found ? { ...init, ...found } : init;
      });
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public updateAchievements(updater: (list: Achievement[]) => Achievement[]): Achievement[] {
    const current = this.getAchievements();
    const updated = updater(current);
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }

  public getDailyChallenge(): DailyChallenge {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY);
      if (data) {
        const parsed: DailyChallenge = JSON.parse(data);
        if (parsed.dateKey === today) {
          return parsed;
        }
      }
    } catch {
      // Continue to generate
    }

    // Generate daily based on day of month
    const dayNum = new Date().getDate();
    const pool = [
      { title: 'Blitz Strike', desc: 'Capture at least 2 tokens in any game', target: 2, reward: '+50 Blitz Score' },
      { title: 'Lucky Sixes', desc: 'Roll 4 sixes in your matches today', target: 4, reward: '+75 Blitz Score' },
      { title: 'Victory Rush', desc: 'Win a Quick Match today', target: 1, reward: '+100 Blitz Score' },
      { title: 'AI Hunter', desc: 'Beat the Computer on Medium or Hard', target: 1, reward: '+120 Blitz Score' },
      { title: 'Token Caravan', desc: 'Bring 4 tokens safely out of the yard', target: 4, reward: '+80 Blitz Score' },
    ];
    const picked = pool[dayNum % pool.length];

    const newDaily: DailyChallenge = {
      id: `daily_${today}`,
      dateKey: today,
      title: picked.title,
      description: picked.desc,
      targetCount: picked.target,
      currentCount: 0,
      rewardText: picked.reward,
      completed: false,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(newDaily));
    } catch {
      // Ignore
    }

    return newDaily;
  }

  public updateDailyProgress(amount: number): DailyChallenge {
    const daily = this.getDailyChallenge();
    if (daily.completed) return daily;

    daily.currentCount = Math.min(daily.targetCount, daily.currentCount + amount);
    if (daily.currentCount >= daily.targetCount) {
      daily.completed = true;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(daily));
    } catch {
      // Ignore
    }
    return daily;
  }
}

export const storage = new StorageManager();
