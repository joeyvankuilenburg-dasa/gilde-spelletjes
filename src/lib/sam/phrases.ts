const MILESTONE: string[] = [
  'Goed bezig! Lekker doorgaan.',
  'Tien rondes — knap hoor!',
  'Wauw, wat oefen jij goed!',
  'Sam ziet je vooruitgaan!',
  'Yes! Dat ging weer fijn.',
  'Lekker bezig met Nederlands!',
  'Wat een gesprek, ga zo door!',
  'Trots op je. Echt waar.',
  'Hoor jezelf eens, super!',
  'Nog niet moe? Lekker doortikken!',
  'Topper! Dit smaakt naar meer.',
  'Mooi! Elk woord telt.',
  'Goed gedaan, taalheld!',
  'Sam doet stiekem een dansje voor je.',
  'Hé, je wordt steeds beter!',
];

const SET_COMPLETE: string[] = [
  'Alles gehad! Wat een prestatie.',
  'Hele set door — petje af!',
  'Je hebt alles gezien. Knap gedaan!',
  'Klaar met deze ronde, top hoor!',
  'Helemaal door de set heen. Gefeliciteerd!',
  'Yes! Alles uitgespeeld. Tijd voor een nieuwe categorie?',
  'Sam is trots — alles op groen!',
  'Wat een doorzettingsvermogen. Bravo!',
  'Helemaal uit. Pak je verdiende kop koffie.',
  'Geslaagd! Probeer eens een ander niveau?',
];

const BIG_TOTAL: Record<number, string> = {
  50: 'Vijftig keer geoefend — wat ben je goed bezig!',
  100: 'Honderd keer! Je bent een echte taalheld.',
  250: 'Tweehonderdvijftig keer geoefend. Petje af, hoor!',
  500: 'Vijfhonderd! Sam staat te juichen voor je.',
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
