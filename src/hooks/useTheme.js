import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pokedex:theme';

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage indisponível: usa o tema padrão.
  }
  return 'dark';
}

/** Alterna entre tema escuro (padrão) e claro, lembrando a escolha do usuário. */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // segue sem persistir
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return [theme, toggleTheme];
}
