import { lazy } from 'react';
import type { Game } from '../types';
import { HearingIcon } from '../icons';

export const uitspraakoefeningGame: Game = {
  id: 'uitspraakoefening',
  path: '/uitspraakoefening',
  title: 'Uitspraakoefening',
  tagline: 'Train woorden per niveau, thema of moeilijke klank.',
  tag: 'Uitspraak',
  description:
    'Luister naar Nederlandse woorden, neem jezelf lokaal op en houd je voortgang bij in deze browser.',
  howToPlay: [
    'Kies oefenen op niveau of op moeilijke klanken.',
    'Start een sessie met maximaal tien woorden.',
    'Luister naar het voorbeeld en spreek het woord na.',
    'Geef zelf aan of het goed ging, nog oefening vraagt of moeilijk is.',
  ],
  icon: HearingIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
