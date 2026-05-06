import type { ComponentType, LazyExoticComponent } from 'react';

export type GameId =
  | 'onderwerpen'
  | 'stellingen'
  | 'beeldraden'
  | 'letterdobbelsteen'
  | 'situaties'
  | 'woordenweb';

export type GameTag =
  | 'Spreken'
  | 'Mening geven'
  | 'Beschrijven'
  | 'Raden'
  | 'Rollenspel'
  | 'Woordenschat';

export interface Game {
  id: GameId;
  path: string;
  title: string;
  tagline: string;
  tag: GameTag;
  description: string;
  howToPlay: string[];
  icon: ComponentType<{ className?: string }>;
  supportsLevels: boolean;
  Component: LazyExoticComponent<ComponentType>;
}
