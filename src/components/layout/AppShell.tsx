import { Link, Outlet, useLocation } from 'react-router-dom';
import { BackButton } from './BackButton';

export function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          {isHome ? <span className="w-[72px]" aria-hidden="true" /> : <BackButton />}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-primary"
            aria-label="Naar startpagina"
          >
            GSSL Spelletjes
          </Link>
          <span className="w-[72px]" aria-hidden="true" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-sm text-muted">
        Gemaakt voor Gilde SamenSpraak Leiden
      </footer>
    </div>
  );
}
