import { Link, Outlet, useLocation } from 'react-router-dom';
import { BackButton } from './BackButton';
import { useTheme } from '../../hooks/useTheme';
import { useOnboarding } from '../../hooks/useOnboarding';

export function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { resolved, toggleTheme } = useTheme();
  const { replay } = useOnboarding();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          {isHome ? <span className="w-[72px]" aria-hidden="true" /> : <BackButton />}
          <Link to="/" aria-label="Naar startpagina">
            <img src="/Gilde-Logo-768x141.webp" alt="Gilde" className="h-7 w-auto" />
          </Link>
          <div className="flex w-[72px] items-center justify-end gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                resolved === 'dark' ? 'Lichte modus inschakelen' : 'Donkere modus inschakelen'
              }
              className="hover:bg-primary/8 flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-primary"
            >
              <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                {resolved === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            {isHome && (
              <button
                type="button"
                onClick={replay}
                aria-label="Uitleg opnieuw bekijken"
                className="hover:bg-primary/8 flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-primary"
              >
                <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                  info
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-sm text-muted">
        Gemaakt voor Gilde SamenSpraak Leiden
      </footer>
    </div>
  );
}
