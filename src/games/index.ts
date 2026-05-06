import type { Game } from './types';
import { onderwerpenGame } from './onderwerpen/meta';
import { stellingenGame } from './stellingen/meta';
import { beeldradenGame } from './beeldraden/meta';
import { letterDobbelsteenGame } from './letterdobbelsteen/meta';
import { situatiesGame } from './situaties/meta';
import { woordenwebGame } from './woordenweb/meta';
import { wieWatBenIkGame } from './wiewatbenik/meta';
import { spreekwoordenGame } from './spreekwoorden/meta';

export const GAMES: Game[] = [
  onderwerpenGame,
  stellingenGame,
  beeldradenGame,
  letterDobbelsteenGame,
  situatiesGame,
  woordenwebGame,
  wieWatBenIkGame,
  spreekwoordenGame,
];
