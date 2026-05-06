import { lazy } from 'react';
import type { Game } from '../types';
import { ChatIcon } from '../icons';

export const onderwerpenGame: Game = {
  id: 'onderwerpen',
  path: '/onderwerpen',
  title: 'Onderwerpen',
  tagline: 'Krijg een willekeurig gespreksonderwerp.',
  tag: 'Spreken',
  description:
    'Druk op de knop en krijg een gespreksonderwerp passend bij het taalniveau. Vertel om de beurt over het onderwerp — de ander mag vragen stellen.',
  howToPlay: [
    'Kies een taalniveau (A1 t/m B2).',
    'Druk op "Volgend onderwerp" voor een willekeurige vraag.',
    'Vertel over het onderwerp. De ander luistert en stelt vragen.',
    'Wissel na een paar minuten van rol.',
  ],
  icon: ChatIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
