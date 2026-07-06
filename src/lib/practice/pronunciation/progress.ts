import type {
  PronunciationProgress,
  WordProgress,
  WordStatus,
  PronunciationTheme,
  PracticeMode,
  DifficultSound,
} from './types';
import type { PronunciationWord } from './index';
import { getWordsByLevelAndTheme } from './index';

const STORAGE_KEY = 'samenspraak.pronunciationProgress';

const DEFAULT_PROGRESS: PronunciationProgress = {
  version: 1,
  currentLevel: 'A1',
  currentTheme: 'all',
  currentMode: 'level',
  currentSound: 'all',
  words: {},
};

export function loadProgress(): PronunciationProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as PronunciationProgress;
    if (parsed.version !== 1) return DEFAULT_PROGRESS;
    // Merge over defaults so progress saved before newer fields (currentMode,
    // currentSound) existed still loads with every field present.
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: PronunciationProgress): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(
  progress: PronunciationProgress,
  wordId: string,
  status: WordStatus,
): PronunciationProgress {
  const existing = progress.words[wordId];
  const now = new Date().toISOString();

  let consecutiveCorrect = existing?.consecutiveCorrect ?? 0;
  if (status === 'mastered') {
    consecutiveCorrect += 1;
  } else if (status === 'difficult') {
    consecutiveCorrect = 0;
  }

  const finalStatus: WordStatus =
    status === 'mastered' && consecutiveCorrect >= 3
      ? 'mastered'
      : status === 'mastered'
        ? 'practicing'
        : status;

  const wordProgress: WordProgress = {
    attempts: (existing?.attempts ?? 0) + 1,
    status: finalStatus,
    lastAttemptAt: now,
    consecutiveCorrect,
  };

  return {
    ...progress,
    words: { ...progress.words, [wordId]: wordProgress },
  };
}

/**
 * Build a practice session from an arbitrary word pool, prioritising words the
 * learner struggles with: difficult first, then in-progress/new, then fresh,
 * topped up with already-mastered words only if needed. Shared by the level
 * mode (`getSessionWords`) and the sounds mode (`getSoundSessionWords`).
 */
export function selectSessionFromPools(
  allWords: PronunciationWord[],
  progress: PronunciationProgress,
  count = 10,
): PronunciationWord[] {
  if (allWords.length === 0) return [];

  const difficult: PronunciationWord[] = [];
  const practicing: PronunciationWord[] = [];
  const fresh: PronunciationWord[] = [];

  for (const word of allWords) {
    const wp = progress.words[word.id];
    if (!wp) {
      fresh.push(word);
    } else if (wp.status === 'difficult') {
      difficult.push(word);
    } else if (wp.status === 'practicing' || wp.status === 'new') {
      practicing.push(word);
    }
  }

  const session: PronunciationWord[] = [];

  for (const pool of [difficult, practicing, fresh]) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (const word of shuffled) {
      if (session.length >= count) break;
      session.push(word);
    }
    if (session.length >= count) break;
  }

  if (session.length < count) {
    const mastered = allWords
      .filter((w) => progress.words[w.id]?.status === 'mastered')
      .sort(() => Math.random() - 0.5);
    for (const word of mastered) {
      if (session.length >= count) break;
      session.push(word);
    }
  }

  return session;
}

export function getSessionWords(progress: PronunciationProgress, count = 10): PronunciationWord[] {
  const allWords = getWordsByLevelAndTheme(progress.currentLevel, progress.currentTheme);
  return selectSessionFromPools(allWords, progress, count);
}

export function getLevelStats(
  progress: PronunciationProgress,
  level: string,
): {
  total: number;
  mastered: number;
  practicing: number;
  difficult: number;
  new: number;
} {
  const words = getWordsByLevelAndTheme(level, 'all');
  let mastered = 0;
  let practicing = 0;
  let difficult = 0;

  for (const word of words) {
    const wp = progress.words[word.id];
    if (!wp) continue;
    if (wp.status === 'mastered') mastered++;
    else if (wp.status === 'practicing') practicing++;
    else if (wp.status === 'difficult') difficult++;
  }

  return {
    total: words.length,
    mastered,
    practicing,
    difficult,
    new: words.length - mastered - practicing - difficult,
  };
}

export function updateLevel(
  progress: PronunciationProgress,
  level: 'A1' | 'A2' | 'B1' | 'B2',
): PronunciationProgress {
  return { ...progress, currentLevel: level };
}

export function updateTheme(
  progress: PronunciationProgress,
  theme: PronunciationTheme | 'all',
): PronunciationProgress {
  return { ...progress, currentTheme: theme };
}

export function updateMode(
  progress: PronunciationProgress,
  mode: PracticeMode,
): PronunciationProgress {
  return { ...progress, currentMode: mode };
}

export function updateSound(
  progress: PronunciationProgress,
  sound: DifficultSound | 'all',
): PronunciationProgress {
  return { ...progress, currentSound: sound };
}
