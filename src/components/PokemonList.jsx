import { useEffect, useRef } from 'react';
import { PokemonCard } from './PokemonCard.jsx';
import { Pokeball } from './Pokeball.jsx';
import '../css/PokemonList.css';

function EmptyState({ onlyCaptured, capturedCount, hasActiveFilters, onClearFilters }) {
  const noneCaptured = onlyCaptured && capturedCount === 0;

  return (
    <div className="empty-list">
      <Pokeball size={64} className="empty-pokeball" />
      <p className="empty-title">
        {noneCaptured ? 'Nenhum Pokémon capturado ainda' : 'Nenhum Pokémon encontrado'}
      </p>
      <p className="empty-hint">
        {noneCaptured
          ? 'Toque na Poké Bola de um card para registrá-lo aqui.'
          : 'Confira o nome ou número digitado, ou escolha outro tipo.'}
      </p>
      {hasActiveFilters && (
        <button type="button" className="dex-button dex-button--accent" onClick={onClearFilters}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export function PokemonList({
  pokemonList,
  capturedIds,
  compareIds,
  highlightStat,
  onSelectPokemon,
  onToggleCapture,
  onToggleCompare,
  scrollResetKey,
  onlyCaptured,
  capturedCount,
  hasActiveFilters,
  onClearFilters,
}) {
  const scrollRef = useRef(null);

  // Volta ao topo da lista sempre que filtros ou ordenação mudam.
  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 0 });
  }, [scrollResetKey]);

  return (
    <div className="pokemon-list-scroll" ref={scrollRef}>
      {pokemonList.length === 0 ? (
        <EmptyState
          onlyCaptured={onlyCaptured}
          capturedCount={capturedCount}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      ) : (
        <ul className="pokemon-grid">
          {pokemonList.map((pokemon) => (
            <li key={pokemon.id}>
              <PokemonCard
                pokemon={pokemon}
                isCaptured={capturedIds.has(pokemon.id)}
                isComparing={compareIds.includes(pokemon.id)}
                highlightStat={highlightStat}
                onSelect={onSelectPokemon}
                onToggleCapture={onToggleCapture}
                onToggleCompare={onToggleCompare}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
