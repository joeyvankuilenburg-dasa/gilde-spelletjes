import { WORDS_A1 } from './words-a1';
import { WORDS_A2 } from './words-a2';
import { WORDS_B1 } from './words-b1';
import { WORDS_B2 } from './words-b2';
import { BASIS_WORDS_A1 } from './words-basis-a1';
import { BASIS_WORDS_A2 } from './words-basis-a2';
import { BASIS_WORDS_B1 } from './words-basis-b1';
import { BASIS_WORDS_B2 } from './words-basis-b2';
import type { PronunciationWord, PronunciationTheme } from './types';

export type { PronunciationWord, PronunciationTheme };
export { THEME_LABELS } from './types';
export type { WordStatus, WordProgress, PronunciationProgress } from './types';

export const ALL_WORDS: PronunciationWord[] = [
  ...WORDS_A1,
  ...BASIS_WORDS_A1,
  ...WORDS_A2,
  ...BASIS_WORDS_A2,
  ...WORDS_B1,
  ...BASIS_WORDS_B1,
  ...WORDS_B2,
  ...BASIS_WORDS_B2,
];

const WORDS_BY_LEVEL: Record<string, PronunciationWord[]> = {
  A1: [...WORDS_A1, ...BASIS_WORDS_A1],
  A2: [...WORDS_A2, ...BASIS_WORDS_A2],
  B1: [...WORDS_B1, ...BASIS_WORDS_B1],
  B2: [...WORDS_B2, ...BASIS_WORDS_B2],
};

export function getWordsByLevel(level: string): PronunciationWord[] {
  return WORDS_BY_LEVEL[level] ?? [];
}

export function getWordsByLevelAndTheme(
  level: string,
  theme: PronunciationTheme | 'all',
): PronunciationWord[] {
  const words = getWordsByLevel(level);
  if (theme === 'all') return words;
  return words.filter((w) => w.theme === theme);
}

export function getThemesForLevel(level: string): PronunciationTheme[] {
  const words = getWordsByLevel(level);
  const themes = new Set(words.map((w) => w.theme));
  return Array.from(themes);
}
