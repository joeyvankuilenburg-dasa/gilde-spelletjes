import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Onboarding } from './components/Onboarding';
import { useOnboarding } from './hooks/useOnboarding';

function AppWithOnboarding() {
  const { showOnboarding, complete } = useOnboarding();
  return (
    <>
      <RouterProvider router={router} />
      {showOnboarding && <Onboarding onComplete={complete} />}
    </>
  );
}

export default function App() {
  return <AppWithOnboarding />;
}
