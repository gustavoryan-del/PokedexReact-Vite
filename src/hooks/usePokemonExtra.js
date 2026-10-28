import { useEffect, useState } from 'react';

const API_URL = 'https://pokeapi.co/api/v2';

// Evita repetir requisições ao navegar de volta para um Pokémon já consultado.
const cache = new Map();

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadExtra(id, signal) {
  const [pokemon, species] = await Promise.all([
    fetchJson(`${API_URL}/pokemon/${id}`, signal),
    fetchJson(`${API_URL}/pokemon-species/${id}`, signal),
  ]);

  const flavor = species.flavor_text_entries.find((entry) => entry.language.name === 'en');
  const genus = species.genera.find((entry) => entry.language.name === 'en');

  return {
    height: pokemon.height / 10, // decímetros -> metros
    weight: pokemon.weight / 10, // hectogramas -> quilos
    abilities: pokemon.abilities.map((item) => ({
      name: item.ability.name,
      hidden: item.is_hidden,
    })),
    genus: genus?.genus ?? null,
    description: flavor ? flavor.flavor_text.replace(/[\n\f\u00ad]+/g, ' ') : null,
  };
}

/**
 * Complementa os dados do JSON com informações da PokéAPI (altura, peso, habilidades e descrição).
 * Se a API falhar, a Pokédex continua funcionando com os dados locais.
 */
export function usePokemonExtra(id) {
  const [state, setState] = useState({ id, status: 'loading', data: null });

  useEffect(() => {
    if (cache.has(id)) {
      setState({ id, status: 'success', data: cache.get(id) });
      return undefined;
    }

    const controller = new AbortController();
    setState({ id, status: 'loading', data: null });

    loadExtra(id, controller.signal)
      .then((data) => {
        cache.set(id, data);
        setState({ id, status: 'success', data });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ id, status: 'error', data: null });
      });

    return () => controller.abort();
  }, [id]);

  // Enquanto o estado ainda é de outro Pokémon, considera "carregando".
  return state.id === id ? state : { id, status: 'loading', data: null };
}
