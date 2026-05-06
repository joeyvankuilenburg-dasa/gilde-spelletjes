import { lazy } from 'react';
import type { Game } from '../types';
import { DiceIcon } from '../icons';

export const letterDobbelsteenGame: Game = {
  id: 'letterdobbelsteen',
  path: '/letterdobbelsteen',
  title: 'Letter-dobbelsteen',
  tagline: 'Rol een letter en speel een woord-of-zinspel.',
  icon: DiceIcon,
  supportsLevels: false,
  Component: lazy(() => import('./Game')),
};
