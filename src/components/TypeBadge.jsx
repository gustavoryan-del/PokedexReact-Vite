import { getTypeColor, getTypeLabel, getTypeTextColor } from '../utils/pokemon.js';

export function TypeBadge({ name }) {
  return (
    <span
      className="type-badge"
      style={{ backgroundColor: getTypeColor(name), color: getTypeTextColor(name) }}
    >
      {getTypeLabel(name)}
    </span>
  );
}
