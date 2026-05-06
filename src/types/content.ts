export const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
export type Level = (typeof LEVELS)[number];

export interface Topic {
  id: string;
  text: string;
  levels: Level[];
  tags?: string[];
}

export interface Statement {
  id: string;
  text: string;
  levels: Level[];
}

export interface ImagePrompt {
  id: string;
  src: string;
  alt: string;
  levels: Level[];
  hintCaption?: string;
  credit?: string;
}

export interface DiceTheme {
  id: string;
  label: string;
  emoji?: string;
}

export interface Situation {
  id: string;
  scenario: string;
  roleA: string;
  roleB: string;
  levels: Level[];
  tips?: string[];
}

export interface WordPrompt {
  id: string;
  word: string;
  emoji?: string;
  levels: Level[];
}

export type WieWatCategory = 'Beroep' | 'Dier' | 'Voorwerp' | 'Persoon' | 'Eten' | 'Plek';

export interface WieWatCard {
  id: string;
  word: string;
  category: WieWatCategory;
  emoji?: string;
}

export interface Spreekwoord {
  id: string;
  text: string;
  meaning: string;
  example?: string;
  levels: Level[];
}
