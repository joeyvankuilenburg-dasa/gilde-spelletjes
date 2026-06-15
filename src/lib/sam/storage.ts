export interface SamStats {
  total: number;
  perGame: Record<string, number>;
  lastMilestonePerGame: Record<string, number>;
  lastMilestoneTotal: number;
  setsCompleted: number;
}

const STORAGE_KEY = 'sam:stats';

const EMPTY: SamStats = {
  total: 0,
  perGame: {},
  lastMilestonePerGame: {},
  lastMilestoneTotal: 0,
  setsCompleted: 0,
};

export function loadStats(): SamStats {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<SamStats>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function saveStats(stats: SamStats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable; silently ignore
  }
}
