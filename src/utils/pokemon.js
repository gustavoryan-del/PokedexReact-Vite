const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const getPokemonImage = (id) => `${ARTWORK_BASE}/${id}.png`;

export const formatId = (id) => String(id).padStart(3, '0');

/* ---------- Tipos ---------- */

export const getTypeColor = (typeName) => `var(--type-${typeName.toLowerCase()})`;

// Tipos escuros ficam com texto branco; os demais, com texto escuro (melhor contraste).
const LIGHT_TEXT_TYPES = new Set(['fighting', 'poison', 'ghost', 'dragon', 'dark']);

export const getTypeTextColor = (typeName) =>
  LIGHT_TEXT_TYPES.has(typeName.toLowerCase()) ? '#ffffff' : '#101820';

const TYPE_LABELS = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Planta',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Veneno',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dark: 'Sombrio',
  dragon: 'Dragão',
  steel: 'Aço',
  fairy: 'Fada',
  typeless: 'Sem tipo',
};

export const getTypeLabel = (typeName) => TYPE_LABELS[typeName.toLowerCase()] ?? typeName;

/* ---------- Estatísticas ---------- */

export const MAX_STAT_VALUE = 255;

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  specialAttack: 'Atq. Esp.',
  specialDefense: 'Def. Esp.',
  speed: 'Velocidade',
};

const STAT_SHORT_LABELS = {
  hp: 'HP',
  attack: 'Atq',
  defense: 'Def',
  specialAttack: 'Atq.E',
  specialDefense: 'Def.E',
  speed: 'Vel',
};

export const getStatShortLabel = (key) => STAT_SHORT_LABELS[key] ?? key;

export const getStatLabel = (key) =>
  STAT_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').trim();

export const sumStats = (stats) => Object.values(stats).reduce((total, value) => total + value, 0);

/* ---------- Ordenação ---------- */

export const SORT_OPTIONS = [
  { value: 'id', label: 'Número' },
  { value: 'name', label: 'Nome' },
  { value: 'hp', label: 'HP' },
  { value: 'attack', label: 'Ataque' },
  { value: 'defense', label: 'Defesa' },
  { value: 'specialAttack', label: 'Atq. Esp.' },
  { value: 'specialDefense', label: 'Def. Esp.' },
  { value: 'speed', label: 'Velocidade' },
];

// Em empates, o número da Pokédex desempata (sempre crescente).
export function sortPokemon(list, key, direction) {
  const factor = direction === 'desc' ? -1 : 1;

  return [...list].sort((a, b) => {
    let result;
    if (key === 'id') result = a.id - b.id;
    else if (key === 'name') result = a.name.localeCompare(b.name, 'pt-BR');
    else result = a.stats[key] - b.stats[key];

    return result !== 0 ? result * factor : a.id - b.id;
  });
}

/* ---------- Formatação de dados da PokéAPI ---------- */

// "special-attack" -> "Special Attack"
export const formatApiName = (name) =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const formatMeasure = (value, unit) =>
  `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit}`;
