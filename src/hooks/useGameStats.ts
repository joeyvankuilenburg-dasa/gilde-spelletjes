import { useCallback } from 'react';
import { loadStats, saveStats } from '../lib/sam/storage';
import { emitSam } from '../lib/sam/events';
import { bigTotalPhrase, milestonePhrase, BIG_TOTAL_MILESTONES } from '../lib/sam/phrases';

const DEFAULT_STEP = 10;

export function useGameStats() {
  const recordRound = useCallback((gameId: string, step: number = DEFAULT_STEP) => {
    const stats = loadStats();
    const nextPerGame = (stats.perGame[gameId] ?? 0) + 1;
    const nextTotal = stats.total + 1;

    const updated = {
      ...stats,
      total: nextTotal,
      perGame: { ...stats.perGame, [gameId]: nextPerGame },
    };

    // Big-total milestones take priority over per-game milestones.
    if (BIG_TOTAL_MILESTONES.includes(nextTotal) && nextTotal > stats.lastMilestoneTotal) {
      updated.lastMilestoneTotal = nextTotal;
      saveStats(updated);
      const message = bigTotalPhrase(nextTotal);
      if (message) emitSam({ kind: 'big-milestone', message });
      return;
    }

    // Per-game milestone every `step` rounds.
    const lastPerGame = stats.lastMilestonePerGame[gameId] ?? 0;
    if (nextPerGame % step === 0 && nextPerGame > lastPerGame) {
      updated.lastMilestonePerGame = {
        ...stats.lastMilestonePerGame,
        [gameId]: nextPerGame,
      };
      saveStats(updated);
      emitSam({ kind: 'milestone', message: milestonePhrase() });
      return;
    }

    saveStats(updated);
  }, []);

  const recordSetComplete = useCallback((message: string) => {
    const stats = loadStats();
    saveStats({ ...stats, setsCompleted: stats.setsCompleted + 1 });
    emitSam({ kind: 'set-complete', message });
  }, []);

  return { recordRound, recordSetComplete };
}
