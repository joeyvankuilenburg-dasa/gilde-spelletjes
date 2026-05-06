import { lazy } from 'react';
import type { Game } from '../types';
import { DiceIcon } from '../icons';

export const letterDobbelsteenGame: Game = {
  id: 'letterdobbelsteen',
  path: '/letterdobbelsteen',
  title: 'Letter-dobbelsteen',
  tagline: 'Rol een letter en speel een woord- of zinspel.',
  tag: 'Raden',
  description:
    'Rol een virtuele 30-zijdige dobbelsteen met alle letters van het alfabet en vier wilde vlakken. Kies van tevoren een spelmodus — dan weet je meteen wat je met de letter moet doen.',
  howToPlay: [
    'Kies een spelmodus (bijv. "Beginklank" of "Thema + letter").',
    'Kies bij "Thema" ook een thema, zoals dieren of eten.',
    'Tik op de dobbelsteen om een letter te rollen.',
    'Wild (⭐) betekent: kies zelf een letter!',
  ],
  icon: DiceIcon,
  supportsLevels: false,
  Component: lazy(() => import('./Game')),
};
