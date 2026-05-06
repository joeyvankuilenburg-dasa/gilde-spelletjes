import { useCallback, useEffect, useRef, useState } from 'react';

type CountdownState = 'idle' | 'running' | 'done';

export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const [state, setState] = useState<CountdownState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (state === 'running') return;
    setState('running');
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clear();
          setState('done');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, [state]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    clear();
    setState('idle');
  }, [state]);

  const reset = useCallback(() => {
    clear();
    setRemaining(seconds);
    setState('idle');
  }, [seconds]);

  useEffect(() => () => clear(), []);

  return { remaining, state, start, pause, reset, total: seconds };
}
