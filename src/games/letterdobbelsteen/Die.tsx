import { useEffect, useRef, useState } from 'react';
import type { DieFace } from './faces';
import { FACES } from './faces';
import { pickRandom } from '../../lib/random';
import { cn } from '../../lib/cn';

interface DieProps {
  onRoll: (face: DieFace) => void;
  disabled?: boolean;
}

const ROLL_DURATION_MS = 700;
const TICK_MS = 60;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function FaceVisual({ face, rolling }: { face: DieFace; rolling: boolean }) {
  if (face.kind === 'wild') {
    return (
      <div className="flex flex-col items-center gap-1">
        <span aria-hidden="true" className="text-5xl">
          ⭐
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Wild</span>
      </div>
    );
  }
  return (
    <span
      className={cn(
        'font-extrabold leading-none transition-colors duration-150',
        rolling ? 'text-5xl text-muted' : 'text-7xl text-primary',
      )}
    >
      {face.value}
    </span>
  );
}

export function Die({ onRoll, disabled }: DieProps) {
  const [display, setDisplay] = useState<DieFace>({ kind: 'letter', value: '?' });
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const roll = () => {
    if (rolling || disabled) return;
    const finalFace = pickRandom(FACES);

    if (prefersReducedMotion()) {
      setDisplay(finalFace);
      onRoll(finalFace);
      return;
    }

    setRolling(true);
    intervalRef.current = window.setInterval(() => {
      setDisplay(pickRandom(FACES));
    }, TICK_MS);

    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplay(finalFace);
      setRolling(false);
      onRoll(finalFace);
    }, ROLL_DURATION_MS);
  };

  return (
    <button
      type="button"
      onClick={roll}
      disabled={disabled || rolling}
      aria-label="Rol de dobbelsteen"
      className={cn(
        'flex h-52 w-52 select-none items-center justify-center rounded-3xl bg-surface transition-all duration-200',
        'hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60',
        rolling ? 'animate-shake shadow-die-rolling' : 'shadow-die hover:shadow-card-hover',
      )}
    >
      <FaceVisual face={display} rolling={rolling} />
    </button>
  );
}
