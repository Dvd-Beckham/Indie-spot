import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatIGDBImage } from '../services/igdbService';

export function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1>Meus Favoritos ({favorites.length})</h1>
      {favorites.length === 0 ? (
        <p>Nenhum jogo favoritado ainda. Explore o catálogo para salvar seus preferidos.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {favorites.map((game) => (
            <div key={game.id} style={{ background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
              <Link to={`/jogo/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={formatIGDBImage(game.cover?.url)} alt={game.name} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
                <div style={{ padding: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{game.name}</h3>
                </div>
              </Link>
              <button onClick={() => toggleFavorite(game)} style={{ width: '100%', padding: '0.5rem', cursor: 'pointer' }}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
