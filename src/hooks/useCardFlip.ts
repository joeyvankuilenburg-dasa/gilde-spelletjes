import { useRef, useState } from 'react';

type FlipPhase = 'idle' | 'out' | 'in';

export function useCardFlip() {
  const [phase, setPhase] = useState<FlipPhase>('idle');
  const busyRef = useRef(false);

  const flip = (callback: () => void) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPhase('out');
    setTimeout(() => {
      callback();
      setPhase('in');
      setTimeout(() => {
        setPhase('idle');
        busyRef.current = false;
      }, 180);
    }, 180);
  };

  return { phase, flip };
}
