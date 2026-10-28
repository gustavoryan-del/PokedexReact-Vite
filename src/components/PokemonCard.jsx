import { CompareIcon } from './Icons.jsx';
import { Pokeball } from './Pokeball.jsx';
import { TypeBadge } from './TypeBadge.jsx';
import { formatId, getPokemonImage, getStatShortLabel, getTypeColor } from '../utils/pokemon.js';
import '../css/PokemonCard.css';

export function PokemonCard({
  pokemon,
  isCaptured,
  isComparing,
  highlightStat,
  onSelect,
  onToggleCapture,
  onToggleCompare,
}) {
  const formattedId = formatId(pokemon.id);
  const primaryType = pokemon.types[0]?.name ?? 'typeless';

  return (
    <article
      className={`pokemon-card${isCaptured ? ' is-captured' : ''}`}
      style={{ '--card-type': getTypeColor(primaryType) }}
    >
      <button
        type="button"
        className="card-main"
        onClick={() => onSelect(pokemon)}
        aria-label={`Ver detalhes de ${pokemon.name}, número ${formattedId}`}
      >
        <span className="pokemon-id">Nº {formattedId}</span>

        <span className="pokemon-image-container">
          <Pokeball className="card-watermark" />
          <img
            src={getPokemonImage(pokemon.id)}
            alt=""
            className="pokemon-image"
            width="120"
            height="120"
            loading="lazy"
            decoding="async"
          />
        </span>

        <span className="pokemon-name">{pokemon.name}</span>

        <span className="pokemon-types">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.id} name={type.name} />
          ))}
        </span>

        <span className="card-stats">
          {Object.entries(pokemon.stats).map(([statName, statValue]) => (
            <span
              className={`card-stat${statName === highlightStat ? ' is-highlighted' : ''}`}
              key={statName}
            >
              <span className="card-stat-label">{getStatShortLabel(statName)}</span>
              <span className="card-stat-value">{statValue}</span>
            </span>
          ))}
        </span>
      </button>

      <button
        type="button"
        className="compare-button"
        onClick={() => onToggleCompare(pokemon.id)}
        aria-pressed={isComparing}
        aria-label={isComparing ? `Remover ${pokemon.name} da comparação` : `Comparar ${pokemon.name}`}
        title={isComparing ? 'Remover da comparação' : 'Comparar'}
      >
        <CompareIcon />
      </button>

      <button
        type="button"
        className="capture-button"
        onClick={() => onToggleCapture(pokemon.id)}
        aria-pressed={isCaptured}
        aria-label={isCaptured ? `Liberar ${pokemon.name}` : `Capturar ${pokemon.name}`}
        title={isCaptured ? 'Capturado' : 'Capturar'}
      >
        <Pokeball size={20} />
      </button>
    </article>
  );
}
