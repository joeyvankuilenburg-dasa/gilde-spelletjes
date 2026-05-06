import type { Game } from './types';
import { onderwerpenGame } from './onderwerpen/meta';
import { stellingenGame } from './stellingen/meta';
import { beeldradenGame } from './beeldraden/meta';
import { letterDobbelsteenGame } from './letterdobbelsteen/meta';

export const GAMES: Game[] = [
  onderwerpenGame,
  stellingenGame,
  beeldradenGame,
  letterDobbelsteenGame,
];
