import { lazy } from 'react';
import type { Game } from '../types';
import { ImageIcon } from '../icons';

export const beeldradenGame: Game = {
  id: 'beeldraden',
  path: '/beeldraden',
  title: 'Beeldraden',
  tagline: 'Beschrijf samen wat je op de foto ziet.',
  tag: 'Beschrijven',
  description:
    'Er verschijnt een foto op het scherm. Beschrijf wat je ziet — kleuren, mensen, voorwerpen, sfeer. De ander mag vragen stellen of aanvullen.',
  howToPlay: [
    'Bekijk de foto en beschrijf wat je ziet: wat, waar, wie, hoe.',
    'De ander luistert, stelt vragen of vult aan.',
    'Toon eventueel de hint als jullie vastlopen.',
    'Druk op "Volgende foto" voor een nieuw beeld.',
  ],
  icon: ImageIcon,
  supportsLevels: false,
  Component: lazy(() => import('./Game')),
};
