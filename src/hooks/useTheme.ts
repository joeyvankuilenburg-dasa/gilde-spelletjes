import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

type ThemeSetting = 'light' | 'dark' | 'system';

function isThemeSetting(v: unknown): v is ThemeSetting {
  return v === 'light' || v === 'dark' || v === 'system';
}

function resolveTheme(setting: ThemeSetting): 'light' | 'dark' {
  if (setting !== 'system') return setting;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [setting, setSetting] = useState<ThemeSetting>(() =>
    readStorage('gssl.theme', 'system' as ThemeSetting, isThemeSetting),
  );

  const resolved = resolveTheme(setting);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
  }, [resolved]);

  const toggleTheme = () => {
    const next: ThemeSetting = resolved === 'dark' ? 'light' : 'dark';
    setSetting(next);
    writeStorage('gssl.theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return { resolved, toggleTheme };
}
