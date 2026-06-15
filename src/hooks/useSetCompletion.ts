import { useEffect, useRef } from 'react';
import { useGameStats } from './useGameStats';
import { setCompletePhrase } from '../lib/sam/phrases';

/**
 * Fires a Sam set-complete event when `remaining` drops from > 0 to 0
 * within the same set (signalled by stable `setKey`). When the set key
 * changes (e.g. filter change), the transition is rearmed without firing.
 */
export function useSetCompletion(setKey: string, remaining: number, totalItems: number): void {
  const { recordSetComplete } = useGameStats();
  const prevRemainingRef = useRef<number | null>(null);
  const prevKeyRef = useRef<string>(setKey);

  useEffect(() => {
    if (prevKeyRef.current !== setKey) {
      prevKeyRef.current = setKey;
      prevRemainingRef.current = remaining;
      return;
    }
    const prev = prevRemainingRef.current;
    prevRemainingRef.current = remaining;
    if (totalItems > 0 && prev !== null && prev > 0 && remaining === 0) {
      recordSetComplete(setCompletePhrase());
    }
  }, [setKey, remaining, totalItems, recordSetComplete]);
}
