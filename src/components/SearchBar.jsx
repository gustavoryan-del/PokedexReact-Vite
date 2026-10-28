import { useEffect, useRef, useState } from 'react';
import { SORT_OPTIONS, getTypeColor, getTypeLabel, getTypeTextColor } from '../utils/pokemon.js';
import '../css/SearchBar.css';

function SortDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedLabel = options[selectedIndex].label;

  // Ao abrir, foca a opção selecionada; clique fora fecha o menu.
  useEffect(() => {
    if (!open) return;
    optionRefs.current[selectedIndex]?.focus();

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const next = (index + step + options.length) % options.length;
        optionRefs.current[next]?.focus();
        break;
      }
      case 'Home':
        event.preventDefault();
        optionRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        optionRefs.current[last]?.focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(options[index].value);
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="sort-dropdown" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className="sort-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>Ordenar por {selectedLabel}</span>
        <span className="sort-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul className="sort-menu" role="listbox" aria-label="Ordenar por">
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
              className={`sort-option${option.value === value ? ' is-selected' : ''}`}
              onClick={() => choose(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              Ordenar por {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  types,
  selectedType,
  onSelectType,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onToggleSortDirection,
  resultCount,
  totalCount,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && searchTerm) {
      event.stopPropagation();
      onSearchChange('');
    }
  };

  const directionLabel =
    sortDirection === 'asc'
      ? 'Ordem crescente. Alternar para decrescente'
      : 'Ordem decrescente. Alternar para crescente';

  return (
    <div className="search-and-filter-container">
      <div className="search-row">
        <div className="search-bar-container">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M15 15l6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <label htmlFor="pokemon-search" className="sr-only">
            Buscar Pokémon por nome ou número
          </label>
          <input
            id="pokemon-search"
            type="text"
            className="search-input"
            placeholder="Buscar por nome ou número"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <div className="sort-controls">
          <SortDropdown value={sortKey} options={SORT_OPTIONS} onChange={onSortKeyChange} />
          <button
            type="button"
            className="sort-direction"
            onClick={onToggleSortDirection}
            aria-label={directionLabel}
            title={directionLabel}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <p className="results-count" aria-live="polite" aria-atomic="true">
          <strong>{resultCount}</strong>{' '}
          {resultCount === totalCount ? '' : `de ${totalCount} `}
          {resultCount === 1 ? 'registro' : 'registros'}
        </p>
      </div>

      <div className="type-chips" role="group" aria-label="Filtrar por tipo">
        <button
          type="button"
          className="type-chip"
          style={{ '--chip-color': 'var(--screen-glow)', '--chip-text': 'var(--on-glow)' }}
          aria-pressed={selectedType === ''}
          onClick={() => onSelectType('')}
        >
          Todos
        </button>

        {types.map((type) => (
          <button
            key={type.id}
            type="button"
            className="type-chip"
            style={{
              '--chip-color': getTypeColor(type.name),
              '--chip-text': getTypeTextColor(type.name),
            }}
            aria-pressed={selectedType === type.name}
            disabled={type.disabled}
            title={type.disabled ? 'Nenhum Pokémon deste tipo nos dados' : undefined}
            onClick={() => onSelectType(selectedType === type.name ? '' : type.name)}
          >
            {getTypeLabel(type.name)}
          </button>
        ))}
      </div>
    </div>
  );
}