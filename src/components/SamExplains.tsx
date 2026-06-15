import { SamAvatar } from './SamAvatar';

interface SamExplainsProps {
  title?: string;
  intro?: string;
  steps: string[];
}

export function SamExplains({ title = 'Sam legt het uit', intro, steps }: SamExplainsProps) {
  return (
    <div className="relative flex items-start gap-3 rounded-card bg-surface p-4 shadow-card">
      <span
        aria-hidden="true"
        className="absolute -right-1 -top-2 text-2xl text-joy drop-shadow"
      >
        ✦
      </span>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <SamAvatar className="h-24 w-24 sm:h-28 sm:w-28" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
          Sam
        </span>
      </div>
      <div className="relative flex-1 rounded-2xl bg-primary/10 px-4 py-3">
        <span
          aria-hidden="true"
          className="absolute -left-2 top-5 h-4 w-4 rotate-45 bg-primary/10"
        />
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{title}</p>
        {intro && <p className="mt-2 text-sm text-ink">{intro}</p>}
        <ul className="mt-2 flex flex-col gap-1.5">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
