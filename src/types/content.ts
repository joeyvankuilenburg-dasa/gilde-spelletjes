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
