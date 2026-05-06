import { lazy } from 'react';
import type { Game } from '../types';
import { PsychologyIcon } from '../icons';

export const wieWatBenIkGame: Game = {
  id: 'wiewatbenik',
  path: '/wiewatbenik',
  title: 'Wie of Wat ben ik?',
  tagline: 'Stel ja/nee-vragen en raad wie of wat op de kaart staat.',
  tag: 'Raden',
  description:
    'Één speler ziet de kaart, de ander stelt ja/nee-vragen om te raden wat erop staat. Kies een categorie of mix alles door elkaar.',
  howToPlay: [
    'Kies een categorie of laat alles door elkaar komen.',
    'Speler A kijkt weg — speler B tikt op de kaart om die te onthullen.',
    'Speler A stelt ja/nee-vragen: "Ben ik een dier?", "Leef ik nog?"',
    'Na het raden: tik op "Geraden!" of "Overgeslagen" voor de volgende kaart.',
  ],
  icon: PsychologyIcon,
  supportsLevels: false,
  Component: lazy(() => import('./Game')),
};
