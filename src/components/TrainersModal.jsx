import { Modal, ModalHeader } from './Modal.jsx';
import { getPokemonImage } from '../utils/pokemon.js';
import '../css/TrainersModal.css';

const TITLE_ID = 'trainers-title';

export function TrainersModal({ trainers, pokemonList, onSelectPokemon, onClose }) {
  const pokemonById = new Map(pokemonList.map((pokemon) => [pokemon.id, pokemon]));

  return (
    <Modal labelledBy={TITLE_ID} onClose={onClose} className="trainers-modal">
      <ModalHeader
        titleId={TITLE_ID}
        title="Treinadores"
        tag={`${trainers.length} registros`}
        onClose={onClose}
      />

      <div className="screen trainers-screen">
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <section key={trainer.id} className="trainer-card" aria-label={trainer.name}>
              <div className="trainer-header">
                <h3>{trainer.name}</h3>
                <span className="badges">
                  <span className="badge-icon" aria-hidden="true" />
                  {trainer.badges} {trainer.badges === 1 ? 'insígnia' : 'insígnias'}
                </span>
              </div>

              <div className="trainer-pokemon-list">
                {trainer.pokemonIds.map((pokemonId, index) => {
                  const pokemon = pokemonById.get(pokemonId);
                  if (!pokemon) return null;

                  return (
                    <button
                      key={`${pokemonId}-${index}`}
                      type="button"
                      className="trainer-pokemon-mini"
                      onClick={() => onSelectPokemon(pokemon)}
                      title={pokemon.name}
                      aria-label={`Ver detalhes de ${pokemon.name}`}
                    >
                      <img
                        src={getPokemonImage(pokemonId)}
                        alt=""
                        width="48"
                        height="48"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Modal>
  );
}
