import { describe, expect, it } from 'vitest';
import { pickRandom, shuffle } from './random';

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const items = [1, 2, 3, 4, 5];
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(pickRandom(items));
    }
  });

  it('throws on empty array', () => {
    expect(() => pickRandom([])).toThrow();
  });

  it('always returns the only element when array has one item', () => {
    expect(pickRandom([42])).toBe(42);
  });
});

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shuffle(items)).toHaveLength(items.length);
  });

  it('contains the same elements', () => {
    const items = [1, 2, 3, 4, 5];
    expect(shuffle(items).slice().sort()).toEqual(items.slice().sort());
  });

  it('does not mutate the input', () => {
    const items = [1, 2, 3, 4, 5];
    const snapshot = items.slice();
    shuffle(items);
    expect(items).toEqual(snapshot);
  });

  it('eventually changes order across many runs', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const original = items.join(',');
    let differs = false;
    for (let i = 0; i < 30; i++) {
      if (shuffle(items).join(',') !== original) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });
});
