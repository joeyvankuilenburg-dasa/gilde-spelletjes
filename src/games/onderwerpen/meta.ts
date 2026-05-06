import { lazy } from 'react';
import type { Game } from '../types';
import { ChatIcon } from '../icons';

export const onderwerpenGame: Game = {
  id: 'onderwerpen',
  path: '/onderwerpen',
  title: 'Onderwerpen',
  tagline: 'Krijg een willekeurig gespreksonderwerp.',
  icon: ChatIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
