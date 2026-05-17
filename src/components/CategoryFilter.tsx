import { TOPIC_CATEGORIES, type TopicCategory } from '../types/content';
import { cn } from '../lib/cn';

export const CATEGORY_EMOJI: Record<TopicCategory, string> = {
  Buurt: '🏘️',
  Familie: '👨‍👩‍👧',
  Werk: '💼',
  Eten: '🍽️',
  Reizen: '✈️',
  'Vrije tijd': '🎉',
  Wonen: '🏠',
  Gezondheid: '💚',
};

interface CategoryFilterProps {
  value: TopicCategory | null;
  onChange: (category: TopicCategory | null) => void;
  label?: string;
}

export function CategoryFilter({ value, onChange, label = 'Onderwerp' }: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
            value === null
              ? 'bg-primary text-primary-fg'
              : 'bg-surface text-muted shadow-card hover:text-ink',
          )}
        >
          Alles
        </button>
        {TOPIC_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat === value ? null : cat)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
              value === cat
                ? 'bg-primary text-primary-fg'
                : 'bg-surface text-muted shadow-card hover:text-ink',
            )}
          >
            {CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
