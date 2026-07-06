import { lazy } from 'react';
import type { Game } from '../types';
import { ChatIcon } from '../icons';

export const aiGesprekGame: Game = {
  id: 'ai-gesprek',
  path: '/ai-gesprek',
  title: 'AI-gesprek',
  tagline: 'Praat vrij met een regelgestuurde gesprekspartner.',
  tag: 'Zelf oefenen',
  description:
    'Kies een onderwerp en voer een kort Nederlands gesprek. De antwoorden worden lokaal in de browser gemaakt, zonder account of AI-dienst.',
  howToPlay: [
    'Kies een onderwerp op jouw niveau.',
    'Typ of spreek een bericht in het Nederlands.',
    'Lees of beluister het korte antwoord van Sam.',
    'Begin opnieuw wanneer je een ander onderwerp wilt oefenen.',
  ],
  icon: ChatIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
