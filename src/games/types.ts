import type { ComponentType, LazyExoticComponent } from 'react';

export type GameId =
  | 'onderwerpen'
  | 'stellingen'
  | 'beeldraden'
  | 'letterdobbelsteen'
  | 'situaties'
  | 'woordenweb'
  | 'wiewatbenik'
  | 'spreekwoorden'
  | 'ai-gesprek'
  | 'oefenvragen'
  | 'promptkaarten'
  | 'nazeggen'
  | 'uitspraakoefening'
  | 'taal-slam';

export type GameTag =
  | 'Spreken'
  | 'Mening geven'
  | 'Beschrijven'
  | 'Raden'
  | 'Rollenspel'
  | 'Woordenschat'
  | 'Zelf oefenen'
  | 'Uitspraak'
  | 'Creatief';

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
