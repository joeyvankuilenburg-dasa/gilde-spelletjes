import { lazy } from 'react';
import type { Game } from '../types';
import { CardsIcon } from '../icons';

export const promptkaartenGame: Game = {
  id: 'promptkaarten',
  path: '/promptkaarten',
  title: 'Promptkaarten',
  tagline: 'Kies een situatie en oefen handige zinnen.',
  tag: 'Zelf oefenen',
  description:
    'Blader door oefenkaarten voor alledaagse gesprekken. Bewaar kaarten lokaal als je ze later nog eens wilt oefenen.',
  howToPlay: [
    'Filter op niveau of thema.',
    'Open een kaart en lees het spreekdoel.',
    'Oefen de vragen en handige zinnen hardop.',
    'Markeer kaarten die je wilt bewaren, oefenen of lastig vindt.',
  ],
  icon: CardsIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
