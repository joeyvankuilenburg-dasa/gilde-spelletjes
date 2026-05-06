import type { ComponentType, LazyExoticComponent } from 'react';

export type GameId = 'onderwerpen' | 'stellingen' | 'beeldraden' | 'letterdobbelsteen';

export interface Game {
  id: GameId;
  path: string;
  title: string;
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  supportsLevels: boolean;
  Component: LazyExoticComponent<ComponentType>;
}
