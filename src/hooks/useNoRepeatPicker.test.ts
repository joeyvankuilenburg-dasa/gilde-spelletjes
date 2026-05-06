import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useNoRepeatPicker } from './useNoRepeatPicker';

interface Item {
  id: string;
}

describe('useNoRepeatPicker', () => {
  it('cycles through all items before repeating', () => {
    const items: Item[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const { result } = renderHook(() => useNoRepeatPicker(items));

    const seen: string[] = [];
    for (let i = 0; i < items.length; i++) {
      act(() => result.current.pick());
      seen.push(result.current.current!.id);
    }

    expect(new Set(seen).size).toBe(items.length);
  });

  it('resets when the pool is exhausted and continues picking', () => {
    const items: Item[] = [{ id: 'a' }, { id: 'b' }];
    const { result } = renderHook(() => useNoRepeatPicker(items));

    act(() => result.current.pick());
    act(() => result.current.pick());
    // Pool is exhausted; next pick starts a fresh cycle.
    act(() => result.current.pick());

    expect(result.current.current).not.toBeNull();
    expect(['a', 'b']).toContain(result.current.current!.id);
  });

  it('returns null current and zero remaining for empty input', () => {
    const { result } = renderHook(() => useNoRepeatPicker([] as Item[]));
    act(() => result.current.pick());
    expect(result.current.current).toBeNull();
  });

  it('resets on items change', () => {
    const itemsA: Item[] = [{ id: 'a' }, { id: 'b' }];
    const { result, rerender } = renderHook(
      ({ items }: { items: Item[] }) => useNoRepeatPicker(items),
      { initialProps: { items: itemsA } },
    );

    act(() => result.current.pick());
    expect(result.current.current).not.toBeNull();

    const itemsB: Item[] = [{ id: 'x' }];
    rerender({ items: itemsB });
    expect(result.current.current).toBeNull();
  });
});
