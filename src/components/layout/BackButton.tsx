import { Link } from 'react-router-dom';

export function BackButton() {
  return (
    <Link
      to="/"
      className="inline-flex min-h-tap min-w-tap items-center gap-2 rounded-full px-3 text-base font-bold text-ink hover:bg-ink/5"
      aria-label="Terug naar overzicht"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Terug
    </Link>
  );
}
