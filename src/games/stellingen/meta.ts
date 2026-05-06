import { lazy } from 'react';
import type { Game } from '../types';
import { BalanceIcon } from '../icons';

export const stellingenGame: Game = {
  id: 'stellingen',
  path: '/stellingen',
  title: "Stellingen & dilemma's",
  tagline: 'Wat vind jij? Geef je mening over een stelling.',
  icon: BalanceIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
