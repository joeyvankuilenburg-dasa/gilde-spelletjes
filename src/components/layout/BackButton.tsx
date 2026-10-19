import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: unknown } | null)?.idx;

    // React Router stores its position in `idx`. A direct visit to a game has
    // no in-app page to return to, so use the overview as a safe fallback.
    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="hover:bg-primary/8 inline-flex min-h-tap min-w-tap items-center gap-1 rounded-xl px-2 text-sm font-bold text-ink hover:text-primary"
      aria-label="Terug naar vorige pagina"
    >
      <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
        arrow_back
      </span>
      Terug
    </button>
  );
}
