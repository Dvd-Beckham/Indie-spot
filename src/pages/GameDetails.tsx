import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { IGDBGame } from '../types/game';
import { fetchGameById, formatIGDBImage } from '../services/igdbService';
import { useFavorites } from '../contexts/FavoritesContext';

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<IGDBGame | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchGameById(id)
      .then(setGame)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: '2rem' }}>Carregando detalhes...</p>;
  if (!game) return <p style={{ padding: '2rem' }}>Jogo não encontrado.</p>;

  return (
    <section style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <Link to="/explorar">← Voltar para Explorar</Link>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <img src={formatIGDBImage(game.cover?.url)} alt={game.name} style={{ width: 264, borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <h1>{game.name}</h1>
          {game.rating && <p>Nota IGDB: <strong>{Math.round(game.rating)}/100</strong></p>}
          <button onClick={() => toggleFavorite(game)} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', marginBottom: '1rem' }}>
            {isFavorite(game.id) ? '★ Remover dos Favoritos' : '☆ Adicionar aos Favoritos'}
          </button>
          <p style={{ lineHeight: 1.6 }}>{game.summary ?? 'Sem sinopse cadastrada.'}</p>
        </div>
      </div>
    </section>
  );
}
