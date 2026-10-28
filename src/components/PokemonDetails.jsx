import { useEffect } from 'react';
import { Modal, ModalHeader } from './Modal.jsx';
import { Pokeball } from './Pokeball.jsx';
import { TypeBadge } from './TypeBadge.jsx';
import { usePokemonExtra } from '../hooks/usePokemonExtra.js';
import {
  MAX_STAT_VALUE,
  formatApiName,
  formatId,
  formatMeasure,
  getPokemonImage,
  getStatLabel,
  getTypeColor,
  sumStats,
} from '../utils/pokemon.js';
import '../css/PokemonDetails.css';

const TITLE_ID = 'pokemon-details-title';

function ExtraInfo({ data }) {
  return (
    <>
      {data.genus && <p className="extra-genus">{data.genus}</p>}
      {data.description && (
        <p className="extra-description" lang="en">
          {data.description}
        </p>
      )}
      <dl className="extra-facts">
        <div>
          <dt>Altura</dt>
          <dd>{formatMeasure(data.height, 'm')}</dd>
        </div>
        <div>
          <dt>Peso</dt>
          <dd>{formatMeasure(data.weight, 'kg')}</dd>
        </div>
        <div className="extra-abilities">
          <dt>Habilidades</dt>
          <dd>
            <ul className="ability-list">
              {data.abilities.map((ability) => (
                <li key={ability.name}>
                  {formatApiName(ability.name)}
                  {ability.hidden && <span className="ability-hidden"> (oculta)</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </>
  );
}

export function PokemonDetails({
  pokemon,
  pokemonList,
  isCaptured,
  onClose,
  onNavigate,
  onToggleCapture,
}) {
  const extra = usePokemonExtra(pokemon.id);

  const index = pokemonList.findIndex((item) => item.id === pokemon.id);
  const canNavigate = pokemonList.length > 1 && index !== -1;
  const previous = canNavigate ? pokemonList[(index - 1 + pokemonList.length) % pokemonList.length] : null;
  const next = canNavigate ? pokemonList[(index + 1) % pokemonList.length] : null;

  // Setas do teclado percorrem a lista, como o direcional da Pokédex.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && previous) onNavigate(previous);
      if (event.key === 'ArrowRight' && next) onNavigate(next);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previous, next, onNavigate]);

  const primaryType = pokemon.types[0]?.name ?? 'typeless';

  return (
    <Modal labelledBy={TITLE_ID} onClose={onClose} className="dex-entry">
      <ModalHeader
        titleId={TITLE_ID}
        title={pokemon.name}
        tag={`Nº ${formatId(pokemon.id)}`}
        onClose={onClose}
      />

      <div className="entry-body" style={{ '--entry-type': getTypeColor(primaryType) }}>
        <section className="screen entry-visual" aria-label="Imagem e tipos">
          <div className="entry-image-wrap">
            <Pokeball className="entry-watermark" />
            <img
              key={pokemon.id}
              src={getPokemonImage(pokemon.id)}
              alt={pokemon.name}
              className="entry-image"
              width="260"
              height="260"
            />
          </div>
          <div className="pokemon-types">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.id} name={type.name} />
            ))}
          </div>
        </section>

        <section className="screen entry-stats" aria-label="Estatísticas base">
          <h3>Estatísticas base</h3>
          {/* key remonta a lista ao trocar de Pokémon e reinicia a animação das barras */}
          <ul className="stat-list" key={pokemon.id}>
            {Object.entries(pokemon.stats).map(([statName, statValue], position) => (
              <li
                className="stat-row"
                key={statName}
                style={{
                  '--value': `${Math.min((statValue / MAX_STAT_VALUE) * 100, 100)}%`,
                  '--position': position,
                }}
              >
                <span className="stat-name">{getStatLabel(statName)}</span>
                <span className="stat-value">{statValue}</span>
                <div
                  className="stat-bar-bg"
                  role="meter"
                  aria-label={getStatLabel(statName)}
                  aria-valuemin={0}
                  aria-valuemax={MAX_STAT_VALUE}
                  aria-valuenow={statValue}
                >
                  <div className="stat-bar-fill" />
                </div>
              </li>
            ))}
          </ul>
          <p className="stat-total">
            <span>Total</span>
            <strong>{sumStats(pokemon.stats)}</strong>
          </p>
        </section>

        <section
          className="screen entry-extra"
          aria-label="Dados complementares da PokéAPI"
          aria-live="polite"
        >
          <h3>Registro da PokéAPI</h3>
          {extra.status === 'loading' && (
            <p className="extra-status">Carregando dados complementares…</p>
          )}
          {extra.status === 'error' && (
            <p className="extra-status">
              Não foi possível carregar os dados complementares. Verifique a conexão; os demais
              dados continuam disponíveis.
            </p>
          )}
          {extra.status === 'success' && <ExtraInfo data={extra.data} />}
        </section>
      </div>

      <footer className="entry-footer">
        {previous ? (
          <button
            type="button"
            className="dex-button nav-button nav-button--prev"
            onClick={() => onNavigate(previous)}
            aria-label={`Anterior: ${previous.name}`}
            aria-keyshortcuts="ArrowLeft"
          >
            <span aria-hidden="true">‹</span>
            <span className="nav-name">{previous.name}</span>
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          className="dex-button capture-toggle"
          onClick={() => onToggleCapture(pokemon.id)}
          aria-pressed={isCaptured}
        >
          <Pokeball size={20} />
          {isCaptured ? 'Capturado' : 'Capturar'}
        </button>

        {next ? (
          <button
            type="button"
            className="dex-button nav-button nav-button--next"
            onClick={() => onNavigate(next)}
            aria-label={`Próximo: ${next.name}`}
            aria-keyshortcuts="ArrowRight"
          >
            <span className="nav-name">{next.name}</span>
            <span aria-hidden="true">›</span>
          </button>
        ) : (
          <span />
        )}
      </footer>
    </Modal>
  );
}
