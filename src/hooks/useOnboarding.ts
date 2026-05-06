import { useState } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

export function useOnboarding() {
  const [done, setDone] = useState<boolean>(() =>
    readStorage('gssl.onboarding_done', false, (v): v is boolean => typeof v === 'boolean'),
  );

  const complete = () => {
    writeStorage('gssl.onboarding_done', true);
    setDone(true);
  };

  const replay = () => {
    writeStorage('gssl.onboarding_done', false);
    setDone(false);
  };

  return { showOnboarding: !done, complete, replay };
}
