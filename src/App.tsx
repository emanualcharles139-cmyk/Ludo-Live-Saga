import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AIDifficulty,
  GameMode,
  MatchStats,
  Player,
  PlayerColor,
  Token,
  UserStats,
} from './types/ludo';
import { storage } from './services/storage';
import { sound } from './services/audio';
import {
  canTokenMove,
  chooseAIMove,
  findCapturedToken,
  getAnimationPath,
  getLegalTokens,
} from './services/ludoEngine';
import { MainMenu } from './components/MainMenu';
import { LudoBoard } from './components/LudoBoard';
import { Dice3D } from './components/Dice3D';
import { PlayerCard } from './components/PlayerCard';
import { GameOverModal } from './components/GameOverModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RulesModal } from './components/RulesModal';
import { PauseModal } from './components/PauseModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { AdSpace } from './components/AdSpace';
import { Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation / Top State
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('MENU');
  const [activeModal, setActiveModal] = useState<'DAILY' | 'ACHIEVEMENTS' | 'RULES' | 'REWARDED' | null>(null);

  // User Settings & Career Stats
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [userStats, setUserStats] = useState<UserStats>(() => storage.getStats());
  const [achievements, setAchievements] = useState(() => storage.getAchievements());
  const [dailyChallenge, setDailyChallenge] = useState(() => storage.getDailyChallenge());

  // Active Match State
  const [gameMode, setGameMode] = useState<GameMode>('4P');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [legalTokens, setLegalTokens] = useState<Token[]>([]);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [animatingTokenId, setAnimatingTokenId] = useState<string | null>(null);
  const [turnMessage, setTurnMessage] = useState<string>('');

  // Match Statistics
  const [matchStats, setMatchStats] = useState<MatchStats>({
    winnerColor: null,
    winnerName: '',
    totalRolls: 0,
    sixesRolled: 0,
    capturesMade: 0,
    tokensCaptured: 0,
    durationSeconds: 0,
    turnsPlayed: 0,
    mode: '4P',
  });
  const matchStartTimeRef = useRef<number>(Date.now());
  const totalTokensPerPlayer = gameMode === 'QUICK' ? 2 : 4;

  // Sync sound settings with audio manager
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    storage.saveSettings(updated);
    sound.setSoundEnabled(updated.soundEnabled);
  };

  // Start new match setup
  const handleStartGame = (
    mode: GameMode,
    playerCount: number,
    names: string[],
    colors: PlayerColor[],
    humanColor: PlayerColor,
    aiDiff: AIDifficulty
  ) => {
    const tokensCount = mode === 'QUICK' ? 2 : 4;
    const initialPlayers: Player[] = colors.slice(0, playerCount).map((color, idx) => {
      const isAI = mode === 'VS_AI' && color !== humanColor;
      const tokens: Token[] = Array.from({ length: tokensCount }).map((_, tIdx) => ({
        id: tIdx,
        color,
        step: -1,
        state: 'yard',
      }));

      return {
        id: `p-${color}`,
        name: isAI ? `Bot ${color.toUpperCase()}` : names[idx] || `Player ${idx + 1}`,
        color,
        type: isAI ? 'ai' : 'human',
        difficulty: isAI ? aiDiff : undefined,
        tokens,
        tokensHome: 0,
        hasRolledSix: false,
      };
    });

    setGameMode(mode);
    setPlayers(initialPlayers);
    setCurrentTurnIdx(0);
    setDiceValue(6);
    setIsRolling(false);
    setHasRolled(false);
    setLegalTokens([]);
    setConsecutiveSixes(0);
    setAnimatingTokenId(null);
    setTurnMessage('Tap the dice to roll!');
    matchStartTimeRef.current = Date.now();

    setMatchStats({
      winnerColor: null,
      winnerName: '',
      totalRolls: 0,
      sixesRolled: 0,
      capturesMade: 0,
      tokensCaptured: 0,
      durationSeconds: 0,
      turnsPlayed: 0,
      mode,
    });

    setGameState('PLAYING');
  };

  const currentPlayer = players[currentTurnIdx];

  // Advance turn to next eligible player
  const advanceTurn = useCallback((playersList: Player[], currentIdx: number) => {
    setHasRolled(false);
    setLegalTokens([]);
    setConsecutiveSixes(0);

    // Find next player who hasn't finished all tokens
    let nextIdx = (currentIdx + 1) % playersList.length;
    let attempts = 0;
    while (playersList[nextIdx].tokensHome >= totalTokensPerPlayer && attempts < playersList.length) {
      nextIdx = (nextIdx + 1) % playersList.length;
      attempts++;
    }

    setCurrentTurnIdx(nextIdx);
    setTurnMessage(`${playersList[nextIdx].name}'s turn!`);
  }, [totalTokensPerPlayer]);

  // Execute Token Movement
  const executeMove = useCallback((tokenToMove: Token) => {
    if (!currentPlayer || animatingTokenId) return;

    setLegalTokens([]);
    setHasRolled(false);
    const tokenKey = `${tokenToMove.color}-${tokenToMove.id}`;
    setAnimatingTokenId(tokenKey);

    const path = getAnimationPath(tokenToMove, diceValue);
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      sound.playStep();

      if (stepIndex >= path.length) {
        clearInterval(interval);
        setAnimatingTokenId(null);

        // Compute final step
        const finalStep = tokenToMove.step === -1 ? 0 : tokenToMove.step + diceValue;
        const reachedHome = finalStep === 56;

        let bonusRoll = false;
        let captureNotice = '';

        // Check for capture
        const captured = findCapturedToken(tokenToMove, diceValue, players);
        if (captured) {
          sound.playCapture();
          bonusRoll = true;
          captureNotice = `Captured ${captured.color.toUpperCase()}! Bonus Roll! ⚔️`;

          // Update match & career stats
          setMatchStats((prev) => ({
            ...prev,
            capturesMade: prev.capturesMade + 1,
            tokensCaptured: prev.tokensCaptured + 1,
          }));

          const updatedStats = { ...userStats, totalCaptures: userStats.totalCaptures + 1 };
          setUserStats(updatedStats);
          storage.saveStats(updatedStats);

          // Daily mission & achievements progress
          storage.updateDailyProgress(1);
          setDailyChallenge(storage.getDailyChallenge());

          storage.updateAchievements((list) =>
            list.map((ach) => {
              if (ach.id === 'first_capture') return { ...ach, unlocked: true, progress: 1 };
              if (ach.id === 'capture_15') {
                const nextProg = Math.min(15, ach.progress + 1);
                return { ...ach, progress: nextProg, unlocked: nextProg >= 15 };
              }
              return ach;
            })
          );
          setAchievements(storage.getAchievements());
        }

        // Apply updated token state to players
        const updatedPlayers = players.map((p) => {
          let updatedTokens = p.tokens.map((t) => {
            if (t.id === tokenToMove.id && t.color === tokenToMove.color) {
              return {
                ...t,
                step: finalStep,
                state: reachedHome ? ('home' as const) : ('track' as const),
              };
            }
            // If captured, reset to yard
            if (captured && t.id === captured.id && t.color === captured.color) {
              return {
                ...t,
                step: -1,
                state: 'yard' as const,
              };
            }
            return t;
          });

          const homeCount = updatedTokens.filter((t) => t.state === 'home').length;
          return {
            ...p,
            tokens: updatedTokens,
            tokensHome: homeCount,
            rank: homeCount >= totalTokensPerPlayer && !p.rank ? 1 : p.rank,
          };
        });

        setPlayers(updatedPlayers);

        // Check if player reached home
        if (reachedHome) {
          sound.playHome();
          bonusRoll = true;
          captureNotice = `${currentPlayer.name} reached Home! 🌟`;

          // Check if this player won the game!
          const playerFinished =
            updatedPlayers.find((p) => p.color === currentPlayer.color)?.tokensHome || 0;
          if (playerFinished >= totalTokensPerPlayer) {
            // Victory!
            sound.playWin();
            const elapsed = Math.round((Date.now() - matchStartTimeRef.current) / 1000);
            const finalStats: MatchStats = {
              ...matchStats,
              winnerColor: currentPlayer.color,
              winnerName: currentPlayer.name,
              durationSeconds: elapsed,
            };
            setMatchStats(finalStats);

            // Update user career stats
            const isHumanWinner = currentPlayer.type === 'human';
            const newStreak = isHumanWinner ? userStats.currentWinStreak + 1 : 0;
            const newCareerStats: UserStats = {
              ...userStats,
              gamesPlayed: userStats.gamesPlayed + 1,
              gamesWon: isHumanWinner ? userStats.gamesWon + 1 : userStats.gamesWon,
              currentWinStreak: newStreak,
              bestWinStreak: Math.max(userStats.bestWinStreak, newStreak),
              quickMatchesWon:
                isHumanWinner && gameMode === 'QUICK'
                  ? userStats.quickMatchesWon + 1
                  : userStats.quickMatchesWon,
              aiHardBeaten:
                isHumanWinner && gameMode === 'VS_AI' && currentPlayer.difficulty === 'hard'
                  ? userStats.aiHardBeaten + 1
                  : userStats.aiHardBeaten,
            };
            setUserStats(newCareerStats);
            storage.saveStats(newCareerStats);

            // Update achievements
            storage.updateAchievements((list) =>
              list.map((ach) => {
                if (ach.id === 'first_win' && isHumanWinner) {
                  return { ...ach, unlocked: true, progress: 1 };
                }
                if (ach.id === 'streak_3' && newStreak >= 3) {
                  return { ...ach, unlocked: true, progress: 3 };
                }
                if (ach.id === 'quick_master' && gameMode === 'QUICK' && isHumanWinner) {
                  const p = Math.min(3, ach.progress + 1);
                  return { ...ach, progress: p, unlocked: p >= 3 };
                }
                if (ach.id === 'beat_hard_ai' && gameMode === 'VS_AI' && isHumanWinner) {
                  return { ...ach, unlocked: true, progress: 1 };
                }
                if (ach.id === 'home_run_quad' && totalTokensPerPlayer === 4 && isHumanWinner) {
                  return { ...ach, unlocked: true, progress: 1 };
                }
                return ach;
              })
            );
            setAchievements(storage.getAchievements());

            setGameState('GAMEOVER');
            return;
          }
        }

        // Check if 6 was rolled
        if (diceValue === 6 && !reachedHome && !captured) {
          bonusRoll = true;
          captureNotice = 'Rolled a 6! Bonus Roll! 🎲';
        }

        if (bonusRoll) {
          setTurnMessage(captureNotice || 'Bonus roll granted!');
          setHasRolled(false);
          setLegalTokens([]);
        } else {
          advanceTurn(updatedPlayers, currentTurnIdx);
        }
      }
    }, 110);
  }, [
    currentPlayer,
    animatingTokenId,
    diceValue,
    players,
    userStats,
    matchStats,
    gameMode,
    totalTokensPerPlayer,
    currentTurnIdx,
    advanceTurn,
  ]);

  // Roll Dice Action
  const handleRollDice = useCallback(() => {
    if (isRolling || hasRolled || !currentPlayer || animatingTokenId) return;

    setIsRolling(true);
    sound.playRoll();

    setMatchStats((prev) => ({
      ...prev,
      totalRolls: prev.totalRolls + 1,
      turnsPlayed: prev.turnsPlayed + 1,
    }));

    setTimeout(() => {
      const rolledNum = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolledNum);
      setIsRolling(false);
      setHasRolled(true);

      // Check Sixes
      if (rolledNum === 6) {
        sound.playSix();
        setMatchStats((prev) => ({ ...prev, sixesRolled: prev.sixesRolled + 1 }));

        const updatedStats = { ...userStats, totalSixes: userStats.totalSixes + 1 };
        setUserStats(updatedStats);
        storage.saveStats(updatedStats);

        // Three sixes in a row penalty
        if (consecutiveSixes >= 2) {
          setTurnMessage('3 Sixes in a row! Turn skipped! 🚫');
          setTimeout(() => {
            advanceTurn(players, currentTurnIdx);
          }, 1200);
          return;
        } else {
          setConsecutiveSixes((prev) => prev + 1);
        }
      } else {
        setConsecutiveSixes(0);
      }

      // Determine Legal Moves
      const valid = getLegalTokens(currentPlayer, rolledNum);
      setLegalTokens(valid);

      if (valid.length === 0) {
        setTurnMessage('No moves available! Passing turn...');
        setTimeout(() => {
          advanceTurn(players, currentTurnIdx);
        }, 1200);
      } else if (valid.length === 1 && currentPlayer.type === 'human' && settings.autoMoveSingleToken) {
        setTurnMessage('Moving token...');
        setTimeout(() => {
          executeMove(valid[0]);
        }, 400);
      } else if (currentPlayer.type === 'human') {
        setTurnMessage('Tap a highlighted token to move!');
      }
    }, 600);
  }, [
    isRolling,
    hasRolled,
    currentPlayer,
    animatingTokenId,
    consecutiveSixes,
    userStats,
    players,
    currentTurnIdx,
    settings.autoMoveSingleToken,
    advanceTurn,
    executeMove,
  ]);

  // AI Automatic Turn Trigger
  useEffect(() => {
    if (
      gameState !== 'PLAYING' ||
      !currentPlayer ||
      currentPlayer.type !== 'ai' ||
      animatingTokenId
    ) {
      return;
    }

    if (!hasRolled && !isRolling) {
      const aiRollTimer = setTimeout(() => {
        handleRollDice();
      }, 750);
      return () => clearTimeout(aiRollTimer);
    }

    if (hasRolled && legalTokens.length > 0) {
      const aiMoveTimer = setTimeout(() => {
        const chosen = chooseAIMove(
          currentPlayer,
          legalTokens,
          diceValue,
          players,
          currentPlayer.difficulty || 'medium'
        );
        if (chosen) {
          executeMove(chosen);
        }
      }, 750);
      return () => clearTimeout(aiMoveTimer);
    }
  }, [
    gameState,
    currentPlayer,
    hasRolled,
    isRolling,
    legalTokens,
    diceValue,
    players,
    animatingTokenId,
    handleRollDice,
    executeMove,
  ]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px]" />
      </div>

      {/* 1. MAIN MENU */}
      {gameState === 'MENU' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <AdSpace position="top" />

          <MainMenu
            onStartGame={handleStartGame}
            onOpenDaily={() => setActiveModal('DAILY')}
            onOpenAchievements={() => setActiveModal('ACHIEVEMENTS')}
            onOpenRules={() => setActiveModal('RULES')}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            userStats={userStats}
          />

          <AdSpace position="bottom" />
        </div>
      )}

      {/* 2. PLAYING / PAUSED / IN-GAME VIEW */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAMEOVER') && (
        <div className="relative z-10 flex-1 flex flex-col justify-between max-w-lg mx-auto w-full px-2 py-1 overflow-hidden">
          
          {/* Top In-Game Bar */}
          <div className="flex items-center justify-between py-1 px-1">
            {/* Pause Button */}
            <button
              onClick={() => {
                sound.playClick();
                setGameState('PAUSED');
              }}
              aria-label="Pause"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" />
            </button>

            {/* Current Turn Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentPlayer?.color === 'red'
                    ? 'bg-red-500'
                    : currentPlayer?.color === 'green'
                    ? 'bg-emerald-500'
                    : currentPlayer?.color === 'yellow'
                    ? 'bg-amber-400'
                    : 'bg-blue-500'
                } animate-pulse`}
              />
              <span className="text-xs font-black text-white tracking-wide">
                {currentPlayer?.name}&apos;s Turn
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              aria-label="Toggle Sound"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>
          </div>

          {/* Top Players Row */}
          <div className="grid grid-cols-2 gap-1.5 my-0.5">
            {players.slice(0, 2).map((player, idx) => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={currentTurnIdx === idx}
                totalTokensPerPlayer={totalTokensPerPlayer}
              />
            ))}
          </div>

          {/* LUDO BOARD CANVAS */}
          <div className="relative my-auto flex items-center justify-center">
            <LudoBoard
              players={players}
              activePlayerColor={currentPlayer?.color || 'red'}
              legalTokens={legalTokens}
              animatingTokenId={animatingTokenId}
              onSelectToken={executeMove}
              canPickToken={hasRolled && currentPlayer?.type === 'human' && !animatingTokenId}
            />
          </div>

          {/* Bottom Players Row (if 3 or 4 players) */}
          {players.length > 2 && (
            <div className="grid grid-cols-2 gap-1.5 my-0.5">
              {players.slice(2, 4).map((player, idx) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={currentTurnIdx === idx + 2}
                  totalTokensPerPlayer={totalTokensPerPlayer}
                />
              ))}
            </div>
          )}

          {/* DICE & ACTION CONTROLS */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2.5 my-1 backdrop-blur-md shadow-xl flex flex-col items-center">
            <Dice3D
              value={diceValue}
              isRolling={isRolling}
              canRoll={!hasRolled && !isRolling && currentPlayer?.type === 'human'}
              currentColor={currentPlayer?.color || 'red'}
              onRoll={handleRollDice}
              isAI={currentPlayer?.type === 'ai'}
              message={turnMessage}
            />
          </div>

          {/* Bottom Ad Space */}
          <AdSpace position="bottom" />
        </div>
      )}

      {/* MODALS */}

      {/* Pause Modal */}
      <PauseModal
        isOpen={gameState === 'PAUSED'}
        onResume={() => setGameState('PLAYING')}
        onRestart={() => {
          setGameState('PLAYING');
          handleStartGame(
            gameMode,
            players.length,
            players.map((p) => p.name),
            players.map((p) => p.color),
            players.find((p) => p.type === 'human')?.color || 'red',
            players.find((p) => p.type === 'ai')?.difficulty || 'medium'
          );
        }}
        onQuit={() => setGameState('MENU')}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Game Over Modal */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={matchStats}
          players={players}
          winStreak={userStats.currentWinStreak}
          onRematch={() => {
            setGameState('PLAYING');
            handleStartGame(
              gameMode,
              players.length,
              players.map((p) => p.name),
              players.map((p) => p.color),
              players.find((p) => p.type === 'human')?.color || 'red',
              players.find((p) => p.type === 'ai')?.difficulty || 'medium'
            );
          }}
          onHome={() => setGameState('MENU')}
        />
      )}

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={activeModal === 'DAILY'}
        onClose={() => setActiveModal(null)}
        challenge={dailyChallenge}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={activeModal === 'ACHIEVEMENTS'}
        onClose={() => setActiveModal(null)}
        achievements={achievements}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={activeModal === 'RULES'}
        onClose={() => setActiveModal(null)}
      />

      {/* Rewarded Ad Perk Modal */}
      <RewardedAdModal
        isOpen={activeModal === 'REWARDED'}
        onClose={() => setActiveModal(null)}
        onAdCompleted={() => {
          setActiveModal(null);
          setTurnMessage('Perk active: Extra roll unlocked! ✨');
        }}
      />

    </div>
  );
}
