const MILESTONE: string[] = [
  'Goed bezig!',
  'Mooi gedaan!',
  'Lekker bezig met Nederlands!',
  'Ga zo door!',
  'Wat een gesprek!',
  'Knap hoor!',
  'Top!',
  'Heel goed!',
  'Lekker oefenen zo!',
  'Nog een keer? Je kunt het!',
];

const SET_COMPLETE: string[] = [
  'Alle vragen gehad — wat een prestatie!',
  'Je hebt de hele set doorgewerkt. Top!',
  'Klaar met deze ronde — knap gedaan!',
  'Alles gezien! Tijd voor een nieuwe categorie?',
  'Helemaal door de set heen. Gefeliciteerd!',
];

const BIG_TOTAL: Record<number, string> = {
  50: 'Vijftig keer geoefend — wat ben je goed bezig!',
  100: 'Honderd keer! Een echte taalheld.',
  250: 'Tweehonderdvijftig keer geoefend — petje af!',
  500: 'Vijfhonderd! Sam is trots op je.',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function milestonePhrase(): string {
  return pick(MILESTONE);
}

export function setCompletePhrase(): string {
  return pick(SET_COMPLETE);
}

export function bigTotalPhrase(total: number): string | null {
  return BIG_TOTAL[total] ?? null;
}

export const BIG_TOTAL_MILESTONES = Object.keys(BIG_TOTAL)
  .map((n) => Number(n))
  .sort((a, b) => a - b);
