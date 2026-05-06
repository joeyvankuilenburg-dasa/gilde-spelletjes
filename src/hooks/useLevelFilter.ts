import { useCallback, useEffect, useState } from 'react';
import { LEVELS, type Level } from '../types/content';
import { readStorage, writeStorage } from '../lib/storage';

const STORAGE_KEY = 'gssl.level';
const DEFAULT_LEVEL: Level = 'A2';

function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value);
}

export function useLevelFilter(): [Level, (level: Level) => void] {
  const [level, setLevelState] = useState<Level>(() =>
    readStorage<Level>(STORAGE_KEY, DEFAULT_LEVEL, isLevel),
  );

  useEffect(() => {
    writeStorage(STORAGE_KEY, level);
  }, [level]);

  const setLevel = useCallback((next: Level) => {
    setLevelState(next);
  }, []);

  return [level, setLevel];
}
