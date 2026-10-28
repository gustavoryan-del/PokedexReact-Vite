import { useCallback, useMemo, useState } from 'react';
import logoImg from './assets/images/Logo.png';
import { ComparisonModal } from './components/ComparisonModal.jsx';
import { DiceIcon, MoonIcon, SunIcon } from './components/Icons.jsx';
import { PokemonList } from './components/PokemonList.jsx';
import { PokemonDetails } from './components/PokemonDetails.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { TrainersModal } from './components/TrainersModal.jsx';
import { useCaptured } from './hooks/useCaptured.js';
import { useTheme } from './hooks/useTheme.js';
import { formatId, sortPokemon } from './utils/pokemon.js';
import pokedexData from './data/pokedex-data.json';

const { pokemon: allPokemon, types: allTypes, trainers: allTrainers } = pokedexData;

const pokemonById = new Map(allPokemon.map((pokemon) => [pokemon.id, pokemon]));

// Usa todos os tipos do JSON (exceto "Typeless"); os que não têm Pokémon ficam desabilitados.
const filterTypes = allTypes
  .filter((type) => type.id !== 0)
  .map((type) => ({
    ...type,
    disabled: !allPokemon.some((pokemon) => pokemon.types.some((t) => t.name === type.name)),
  }));

const MAX_COMPARE = 2;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [onlyCaptured, setOnlyCaptured] = useState(false);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedId, setSelectedId] = useState(null);
  const [showTrainers, setShowTrainers] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [captured, toggleCaptured] = useCaptured();
  const [theme, toggleTheme] = useTheme();

  const filteredPokemon = useMemo(() => {
    const term = searchTerm.trim().replace(/^#/, '').toLowerCase();

    const matches = allPokemon.filter((pokemon) => {
      const matchesSearch =
        term === '' || pokemon.name.toLowerCase().includes(term) || formatId(pokemon.id).includes(term);
      const matchesType = selectedType === '' || pokemon.types.some((t) => t.name === selectedType);
      const matchesCaptured = !onlyCaptured || captured.has(pokemon.id);
      return matchesSearch && matchesType && matchesCaptured;
    });

    return sortPokemon(matches, sortKey, sortDirection);
  }, [searchTerm, selectedType, onlyCaptured, captured, sortKey, sortDirection]);

  const capturedCount = useMemo(
    () => allPokemon.filter((pokemon) => captured.has(pokemon.id)).length,
    [captured]
  );

  const selectedPokemon = selectedId === null ? null : (pokemonById.get(selectedId) ?? null);
  const comparedPokemon = compareIds.map((id) => pokemonById.get(id)).filter(Boolean);

  // As setas do detalhe seguem a lista filtrada; se o Pokémon veio de fora dela, usa a lista completa.
  const navigationList = filteredPokemon.some((pokemon) => pokemon.id === selectedId)
    ? filteredPokemon
    : allPokemon;

  const hasActiveFilters = searchTerm !== '' || selectedType !== '' || onlyCaptured;

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('');
    setOnlyCaptured(false);
  }, []);

  // Atributos começam do maior para o menor; número e nome, em ordem crescente.
  const handleSortKeyChange = useCallback((key) => {
    setSortKey(key);
    setSortDirection(key === 'id' || key === 'name' ? 'asc' : 'desc');
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
  }, []);

  const openDetails = useCallback((pokemon) => {
    setShowTrainers(false);
    setSelectedId(pokemon.id);
  }, []);

  const openRandom = useCallback(() => {
    const pool = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    openDetails(pool[Math.floor(Math.random() * pool.length)]);
  }, [filteredPokemon, openDetails]);

  // Ao marcar um terceiro Pokémon, o mais antigo da comparação sai.
  const toggleCompare = useCallback((id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length < MAX_COMPARE) return [...current, id];
      return [...current.slice(1), id];
    });
  }, []);

  const removeFromCompare = useCallback(
    (id) => {
      toggleCompare(id);
      setShowCompare(false);
    },
    [toggleCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    setShowCompare(false);
  }, []);

  const closeDetails = useCallback(() => setSelectedId(null), []);
  const closeTrainers = useCallback(() => setShowTrainers(false), []);
  const closeCompare = useCallback(() => setShowCompare(false), []);

  const themeLabel = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';

  return (
    <div className="pokedex">
      <header className="dex-top">
        <div className="dex-lens" aria-hidden="true" />
        <div className="dex-leds" aria-hidden="true">
          <span className="dex-led dex-led--red" />
          <span className="dex-led dex-led--yellow" />
          <span className="dex-led dex-led--green" />
        </div>

        <h1 className="app-title">
          <img src={logoImg} alt="Legends Pokédex Logo" className="app-logo" />
        </h1>

        <div
          className="dex-readout"
          role="status"
          aria-label={`Capturados: ${capturedCount} de ${allPokemon.length}`}
        >
          <span className="readout-label">Capturados</span>
          <span className="readout-value">
            {formatId(capturedCount)}/{formatId(allPokemon.length)}
          </span>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <main className="dex-main">
        <section className="screen dex-screen" aria-label="Tela da Pokédex">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            types={filterTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            sortKey={sortKey}
            onSortKeyChange={handleSortKeyChange}
            sortDirection={sortDirection}
            onToggleSortDirection={toggleSortDirection}
            resultCount={filteredPokemon.length}
            totalCount={allPokemon.length}
          />

          <PokemonList
            pokemonList={filteredPokemon}
            capturedIds={captured}
            compareIds={compareIds}
            highlightStat={sortKey}
            onSelectPokemon={openDetails}
            onToggleCapture={toggleCaptured}
            onToggleCompare={toggleCompare}
            scrollResetKey={`${searchTerm}|${selectedType}|${onlyCaptured}|${sortKey}|${sortDirection}`}
            onlyCaptured={onlyCaptured}
            capturedCount={capturedCount}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </section>
      </main>

      <footer className="dex-bottom">
        <button
          type="button"
          className="dex-button dex-button--accent"
          onClick={() => setShowTrainers(true)}
          aria-haspopup="dialog"
        >
          Treinadores
        </button>

        <button
          type="button"
          className="dex-button"
          aria-pressed={onlyCaptured}
          onClick={() => setOnlyCaptured((value) => !value)}
        >
          <span className="button-led" aria-hidden="true" />
          Só capturados
        </button>

        <button
          type="button"
          className="dex-button"
          disabled={comparedPokemon.length < MAX_COMPARE}
          onClick={() => setShowCompare(true)}
          aria-haspopup="dialog"
          title={
            comparedPokemon.length < MAX_COMPARE
              ? 'Marque 2 Pokémon com o ícone de comparação dos cards'
              : undefined
          }
        >
          Comparar
          <span className="button-count">
            {comparedPokemon.length}/{MAX_COMPARE}
          </span>
        </button>

        <button type="button" className="dex-button" onClick={openRandom}>
          <DiceIcon />
          Aleatório
        </button>

        <div className="dex-grille" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </footer>

      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          pokemonList={navigationList}
          isCaptured={captured.has(selectedPokemon.id)}
          onClose={closeDetails}
          onNavigate={openDetails}
          onToggleCapture={toggleCaptured}
        />
      )}

      {showTrainers && (
        <TrainersModal
          trainers={allTrainers}
          pokemonList={allPokemon}
          onSelectPokemon={openDetails}
          onClose={closeTrainers}
        />
      )}

      {showCompare && comparedPokemon.length === MAX_COMPARE && (
        <ComparisonModal
          pokemon={comparedPokemon}
          onRemove={removeFromCompare}
          onClear={clearCompare}
          onClose={closeCompare}
        />
      )}
    </div>
  );
}

export default App;
