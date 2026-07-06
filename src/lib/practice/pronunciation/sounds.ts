import { ALL_WORDS } from './index';
import { selectSessionFromPools } from './progress';
import type { PronunciationWord } from './index';
import type { DifficultSound, PronunciationProgress } from './types';

export type { DifficultSound } from './types';

/**
 * The Dutch vowel digraphs targeted by the "Moeilijke klanken" practice mode,
 * in the order they are shown to the learner. ei/ij sound identical to each
 * other, and au/ou sound identical to each other — that overlap is exactly why
 * learners mix up the spelling, so both members of each pair are practised.
 */
export const DIFFICULT_SOUNDS: readonly DifficultSound[] = [
  'oe',
  'eu',
  'ui',
  'ei',
  'ij',
  'au',
  'ou',
] as const;

/** A familiar anchor word for each sound, shown on the selection chips. */
export const SOUND_EXAMPLES: Record<DifficultSound, string> = {
  oe: 'boek',
  eu: 'deur',
  ui: 'huis',
  ei: 'trein',
  ij: 'wijn',
  au: 'auto',
  ou: 'koud',
};

/**
 * Short Dutch hints for the sounds that are genuinely confusing because they
 * sound identical to another sound. Shown under the chip grid when relevant.
 */
export const SOUND_HINTS: Partial<Record<DifficultSound, string>> = {
  ei: 'De ei (korte ei) en de ij (lange ij) klinken hetzelfde.',
  ij: 'De ij (lange ij) en de ei (korte ei) klinken hetzelfde.',
  au: 'De au en de ou klinken hetzelfde.',
  ou: 'De ou en de au klinken hetzelfde.',
};

/** Whether a word contains a specific difficult sound (literal substring match). */
export function wordContainsSound(word: string, sound: DifficultSound): boolean {
  return word.toLowerCase().includes(sound);
}

/** Every difficult sound present in a word, in canonical order. */
export function getSoundsInWord(word: string): DifficultSound[] {
  const lower = word.toLowerCase();
  return DIFFICULT_SOUNDS.filter((sound) => lower.includes(sound));
}

/** Whether a word contains at least one difficult sound. */
export function hasAnyDifficultSound(word: string): boolean {
  const lower = word.toLowerCase();
  return DIFFICULT_SOUNDS.some((sound) => lower.includes(sound));
}

/**
 * All corpus words containing the given sound, or — for `'all'` — every word
 * containing at least one difficult sound.
 */
export function getWordsBySound(sound: DifficultSound | 'all'): PronunciationWord[] {
  if (sound === 'all') return ALL_WORDS.filter((w) => hasAnyDifficultSound(w.word));
  return ALL_WORDS.filter((w) => wordContainsSound(w.word, sound));
}

let cachedCounts: Record<DifficultSound | 'all', number> | null = null;

/** Word counts per sound (plus `'all'`), cached after first use, for chip labels. */
export function getSoundCounts(): Record<DifficultSound | 'all', number> {
  if (cachedCounts) return cachedCounts;
  const counts: Record<DifficultSound | 'all', number> = {
    all: 0,
    oe: 0,
    eu: 0,
    ui: 0,
    ei: 0,
    ij: 0,
    au: 0,
    ou: 0,
  };
  counts.all = getWordsBySound('all').length;
  for (const sound of DIFFICULT_SOUNDS) {
    counts[sound] = getWordsBySound(sound).length;
  }
  cachedCounts = counts;
  return counts;
}

export interface WordSegment {
  text: string;
  isSound: boolean;
  sound?: DifficultSound;
}

/**
 * Split a word into segments so the target sound(s) can be highlighted in the
 * UI. With `'all'`, every difficult sound is marked; with a single sound, only
 * that sound is marked. Matching is left-to-right and non-overlapping, and the
 * concatenation of all segment `text` values always equals the original word.
 */
export function segmentWord(word: string, target: DifficultSound | 'all'): WordSegment[] {
  const targets: readonly DifficultSound[] = target === 'all' ? DIFFICULT_SOUNDS : [target];
  const lower = word.toLowerCase();
  const segments: WordSegment[] = [];
  let buffer = '';
  let i = 0;

  while (i < word.length) {
    const pair = lower.slice(i, i + 2);
    const match = pair.length === 2 ? targets.find((s) => s === pair) : undefined;
    if (match) {
      if (buffer) {
        segments.push({ text: buffer, isSound: false });
        buffer = '';
      }
      segments.push({ text: word.slice(i, i + 2), isSound: true, sound: match });
      i += 2;
    } else {
      buffer += word[i];
      i += 1;
    }
  }

  if (buffer) segments.push({ text: buffer, isSound: false });
  return segments;
}

/** Build a 10-word (default) session from the pool of words for a given sound. */
export function getSoundSessionWords(
  progress: PronunciationProgress,
  sound: DifficultSound | 'all',
  count = 10,
): PronunciationWord[] {
  return selectSessionFromPools(getWordsBySound(sound), progress, count);
}

/** Mastery breakdown for the pool of words containing a given sound. */
export function getSoundStats(
  progress: PronunciationProgress,
  sound: DifficultSound | 'all',
): { total: number; mastered: number; practicing: number; difficult: number; new: number } {
  const words = getWordsBySound(sound);
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
