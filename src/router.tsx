import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { GAMES } from './games';

const gameLoader = (
  <div className="flex items-center justify-center py-12 text-muted">Bezig met laden…</div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      ...GAMES.map((game) => ({
        path: game.path.replace(/^\//, ''),
        element: (
          <Suspense fallback={gameLoader}>
            <game.Component />
          </Suspense>
        ),
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
