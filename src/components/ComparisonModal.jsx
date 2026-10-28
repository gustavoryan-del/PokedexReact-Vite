import { Modal, ModalHeader } from './Modal.jsx';
import { TypeBadge } from './TypeBadge.jsx';
import {
  MAX_STAT_VALUE,
  formatId,
  getPokemonImage,
  getStatLabel,
  getTypeColor,
  sumStats,
} from '../utils/pokemon.js';
import '../css/ComparisonModal.css';

const TITLE_ID = 'comparison-title';

const primaryColor = (pokemon) => getTypeColor(pokemon.types[0]?.name ?? 'typeless');

function Contender({ pokemon, onRemove }) {
  return (
    <div className="contender" style={{ '--side-color': primaryColor(pokemon) }}>
      <img
        className="contender-image"
        src={getPokemonImage(pokemon.id)}
        alt={pokemon.name}
        width="140"
        height="140"
      />
      <p className="contender-id">Nº {formatId(pokemon.id)}</p>
      <h3 className="contender-name">{pokemon.name}</h3>
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type.id} name={type.name} />
        ))}
      </div>
      <button type="button" className="contender-remove" onClick={() => onRemove(pokemon.id)}>
        Remover
      </button>
    </div>
  );
}

function CompareRow({ label, left, right, leftColor, rightColor, max }) {
  const hasBars = max !== null;
  const percent = (value) => `${Math.min((value / max) * 100, 100)}%`;

  return (
    <li className={`compare-row${hasBars ? '' : ' compare-row--total'}`}>
      <div
        className={`compare-side compare-side--left${left > right ? ' is-higher' : ''}`}
        style={{ '--side-color': leftColor, '--value': hasBars ? percent(left) : '0%' }}
      >
        <span className="compare-value">
          {left}
          {left > right && <span className="sr-only"> (maior)</span>}
        </span>
        {hasBars && (
          <div className="compare-bar">
            <div className="compare-bar-fill" />
          </div>
        )}
      </div>

      <span className="compare-label">{label}</span>

      <div
        className={`compare-side compare-side--right${right > left ? ' is-higher' : ''}`}
        style={{ '--side-color': rightColor, '--value': hasBars ? percent(right) : '0%' }}
      >
        {hasBars && (
          <div className="compare-bar">
            <div className="compare-bar-fill" />
          </div>
        )}
        <span className="compare-value">
          {right}
          {right > left && <span className="sr-only"> (maior)</span>}
        </span>
      </div>
    </li>
  );
}

export function ComparisonModal({ pokemon, onRemove, onClear, onClose }) {
  const [left, right] = pokemon;
  const statKeys = Object.keys(left.stats);

  const winsLeft = statKeys.filter((key) => left.stats[key] > right.stats[key]).length;
  const winsRight = statKeys.filter((key) => right.stats[key] > left.stats[key]).length;

  const summary =
    winsLeft === winsRight
      ? `Empate: ${winsLeft} a ${winsRight} nos atributos`
      : `${winsLeft > winsRight ? left.name : right.name} lidera em ${Math.max(winsLeft, winsRight)} de ${statKeys.length} atributos`;

  return (
    <Modal labelledBy={TITLE_ID} onClose={onClose} className="comparison-modal">
      <ModalHeader titleId={TITLE_ID} title="Comparar" tag="2 Pokémon" onClose={onClose} />

      <div className="screen comparison-screen">
        <div className="contenders">
          <Contender pokemon={left} onRemove={onRemove} />
          <span className="versus" aria-hidden="true">
            VS
          </span>
          <Contender pokemon={right} onRemove={onRemove} />
        </div>

        <ul className="compare-list">
          {statKeys.map((key) => (
            <CompareRow
              key={key}
              label={getStatLabel(key)}
              left={left.stats[key]}
              right={right.stats[key]}
              leftColor={primaryColor(left)}
              rightColor={primaryColor(right)}
              max={MAX_STAT_VALUE}
            />
          ))}
          <CompareRow
            label="Total"
            left={sumStats(left.stats)}
            right={sumStats(right.stats)}
            leftColor={primaryColor(left)}
            rightColor={primaryColor(right)}
            max={null}
          />
        </ul>

        <p className="compare-summary" aria-live="polite">
          {summary}
        </p>
      </div>

      <footer className="comparison-footer">
        <button type="button" className="dex-button" onClick={onClear}>
          Limpar comparação
        </button>
      </footer>
    </Modal>
  );
}
