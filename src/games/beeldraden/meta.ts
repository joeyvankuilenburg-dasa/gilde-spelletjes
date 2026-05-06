import { lazy } from 'react';
import type { Game } from '../types';
import { ImageIcon } from '../icons';

export const beeldradenGame: Game = {
  id: 'beeldraden',
  path: '/beeldraden',
  title: 'Beeldraden',
  tagline: 'Beschrijf samen wat je op de foto ziet.',
  icon: ImageIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
