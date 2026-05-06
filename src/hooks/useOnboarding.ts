import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

const EVENT = 'gssl:onboarding-change';

function readDone() {
  return readStorage('gssl.onboarding_done', false, (v): v is boolean => typeof v === 'boolean');
}

export function useOnboarding() {
  const [done, setDone] = useState<boolean>(readDone);

  useEffect(() => {
    const handler = () => setDone(readDone());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const complete = () => {
    writeStorage('gssl.onboarding_done', true);
    setDone(true);
    window.dispatchEvent(new Event(EVENT));
  };

  const replay = () => {
    writeStorage('gssl.onboarding_done', false);
    setDone(false);
    window.dispatchEvent(new Event(EVENT));
  };

  return { showOnboarding: !done, complete, replay };
}
