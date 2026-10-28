import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pokedex:captured';

function readStoredIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

/** Guarda no navegador quais Pokémon o usuário marcou como capturados. */
export function useCaptured() {
  const [captured, setCaptured] = useState(readStoredIds);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...captured]));
    } catch {
      // localStorage indisponível (modo privado, por exemplo): segue sem persistir.
    }
  }, [captured]);

  const toggleCaptured = useCallback((id) => {
    setCaptured((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return [captured, toggleCaptured];
}
