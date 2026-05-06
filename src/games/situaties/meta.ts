import { lazy } from 'react';
import type { Game } from '../types';

export const situatiesGame: Game = {
  id: 'situaties',
  path: '/situaties',
  title: 'Situatiekaarten',
  tagline: 'Speel een situatie na en oefen echte gesprekken.',
  tag: 'Rollenspel',
  description:
    'Trek een situatiekaart en verdeel de rollen. Speel het gesprek na zoals het in het echte leven zou gaan.',
  howToPlay: [
    'Verdeel de rollen (A en B) tussen taalmaatje en deelnemer.',
    'Lees de situatie samen en start het gesprek.',
    'Gebruik de tips als je niet weet hoe je moet beginnen.',
    'Wissel daarna van rol en speel de situatie nog een keer.',
  ],
  icon: () => null,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
