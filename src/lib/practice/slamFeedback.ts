import type { SlamLevel } from './taalslam/taalslam';

export type SlamMode = 'finish' | 'words' | 'expression';

export interface SlamFeedbackInput {
  level: SlamLevel;
  theme: string;
  text: string;
  mode: SlamMode;
  requiredWords?: string[];
  expression?: string;
}

export interface SlamFeedbackResult {
  ok: boolean;
  encouragement: string;
  suggestions: string[];
}

const TARGET_LINES = 4;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-zà-ÿ]+/i)
      .filter(Boolean),
  );
}

function usesWord(tokens: Set<string>, word: string): boolean {
  return word
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => tokens.has(part));
}

function countLines(text: string): number {
  return text.split('\n').filter((line) => line.trim().length > 0).length;
}

export function buildSlamFeedback(input: SlamFeedbackInput): SlamFeedbackResult {
  const lines = countLines(input.text);
  if (lines === 0) {
    return {
      ok: false,
      encouragement: 'Begin met één regel. Gewoon proberen telt al.',
      suggestions: [],
    };
  }

  const tokens = tokenize(input.text);
  const suggestions: string[] = [];

  if (lines < TARGET_LINES) {
    suggestions.push(`Probeer er ${TARGET_LINES} regels van te maken. Je hebt er nu ${lines}.`);
  }

  if (input.mode === 'words' && input.requiredWords?.length) {
    const missing = input.requiredWords.filter((word) => !usesWord(tokens, word));
    if (missing.length > 0) suggestions.push(`Gebruik ook nog: ${missing.join(', ')}.`);
  }

  if (input.mode === 'expression' && input.expression) {
    if (!input.text.toLowerCase().includes(input.expression.toLowerCase())) {
      suggestions.push(`Verwerk de uitdrukking "${input.expression}" ergens in je slam.`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push('Lees je slam hardop voor en let op het ritme.');
    suggestions.push('Voeg een regel toe die een gevoel laat zien.');
  }

  const ok = lines >= 3 && suggestions.length <= 2;
  return {
    ok,
    encouragement: ok
      ? 'Mooi bezig! Je slam komt goed op gang.'
      : 'Goed begin. Met een paar kleine dingen wordt hij sterker.',
    suggestions: suggestions.slice(0, 3),
  };
}
