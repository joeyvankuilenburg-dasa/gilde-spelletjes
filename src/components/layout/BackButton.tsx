import { Link } from 'react-router-dom';

export function BackButton() {
  return (
    <Link
      to="/"
      className="hover:bg-primary/8 inline-flex min-h-tap min-w-tap items-center gap-1.5 rounded-xl px-3 text-base font-bold text-ink hover:text-primary"
      aria-label="Terug naar overzicht"
    >
      <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
        arrow_back
      </span>
      Terug
    </Link>
  );
}
