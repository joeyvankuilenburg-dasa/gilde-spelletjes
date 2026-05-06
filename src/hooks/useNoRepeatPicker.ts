import { useCallback, useEffect, useRef, useState } from 'react';
import { pickRandom } from '../lib/random';

interface HasId {
  id: string;
}

export interface NoRepeatPicker<T> {
  current: T | null;
  pick: () => void;
  reset: () => void;
  remaining: number;
}

export function useNoRepeatPicker<T extends HasId>(items: readonly T[]): NoRepeatPicker<T> {
  const seenRef = useRef<Set<string>>(new Set());
  const [current, setCurrent] = useState<T | null>(null);

  const pick = useCallback(() => {
    if (items.length === 0) {
      setCurrent(null);
      return;
    }
    const available = items.filter((item) => !seenRef.current.has(item.id));
    const pool = available.length > 0 ? available : items;
    if (available.length === 0) {
      seenRef.current = new Set();
    }
    const next = pickRandom(pool);
    seenRef.current.add(next.id);
    setCurrent(next);
  }, [items]);

  useEffect(() => {
    seenRef.current = new Set();
    setCurrent(null);
  }, [items]);

  const reset = useCallback(() => {
    seenRef.current = new Set();
    setCurrent(null);
  }, []);

  return {
    current,
    pick,
    reset,
    remaining: Math.max(0, items.length - seenRef.current.size),
  };
}
