import { useMemo } from 'react';
import { SamAvatar } from './SamAvatar';
import { loadStats } from '../lib/sam/storage';

const MORNING = [
  'Goedemorgen! Klaar voor wat oefenen?',
  'Goedemorgen! Wat ga je vandaag leren?',
  'Goedemorgen! Een spel om de dag te beginnen?',
];
const AFTERNOON = [
  'Goedemiddag! Tijd voor een rondje Nederlands?',
  'Goedemiddag! Leuk dat je er bent.',
  'Goedemiddag! Een korte oefening tussendoor?',
];
const EVENING = [
  'Goedenavond! Nog even oefenen?',
  'Goedenavond! Fijn dat je er bent.',
  'Goedenavond! Een spel om de dag mee af te sluiten?',
];
const NIGHT = [
  'Nog wakker? Een rustig potje dan.',
  'Hallo nachtuil! Welk spel doen we?',
  'Stil uurtje? Perfect voor wat oefenen.',
];
const RETURNING_SUFFIX = ['Fijn dat je terug bent!', 'Leuk je weer te zien!', 'Welkom terug!'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return pick(MORNING);
  if (hour >= 12 && hour < 18) return pick(AFTERNOON);
  if (hour >= 18 && hour < 23) return pick(EVENING);
  return pick(NIGHT);
}

export function SamGreeting() {
  const { greeting, subtitle } = useMemo(() => {
    const hour = new Date().getHours();
    const stats = loadStats();
    const main = greetingForHour(hour);
    let sub: string | null = null;
    if (stats.total >= 100) {
      sub = `Je hebt al ${stats.total} keer geoefend — wat een doorzetter!`;
    } else if (stats.total >= 10) {
      sub = `Je staat op ${stats.total} rondes. ${pick(RETURNING_SUFFIX)}`;
    } else if (stats.total > 0) {
      sub = pick(RETURNING_SUFFIX);
    }
    return { greeting: main, subtitle: sub };
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-card bg-surface p-4 shadow-card sm:flex-row">
      <span aria-hidden="true" className="absolute -right-1 -top-2 text-2xl text-joy drop-shadow">
        ✦
      </span>
      <SamAvatar notebookContext="home" className="h-40 w-40 shrink-0 sm:h-48 sm:w-48" />
      <div className="relative w-full flex-1 rounded-2xl bg-primary/10 px-4 py-3">
        <span
          aria-hidden="true"
          className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-primary/10 sm:-left-2 sm:top-5 sm:translate-x-0"
        />
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Sam</p>
        <p className="mt-1 text-base font-bold leading-snug text-ink">{greeting}</p>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
