import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGames } from '../hooks/useGames';
import { formatIGDBImage } from '../services/igdbService';

export function Explore() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const { games, loading, error } = useGames({ search, genre });

  return (
    <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1>Explorar Catálogo Indie</h1>

      {/* Substituir pelos componentes <SearchBar /> e <GenreFilter /> do Netinho */}
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0 2rem' }}>
        <input
          type="text"
          placeholder="Buscar jogo indie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.6rem', flex: 1, borderRadius: 6 }}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ padding: '0.6rem', borderRadius: 6 }}>
          <option value="">Todos os subgêneros</option>
          <option value="8">Plataforma</option>
          <option value="12">RPG</option>
          <option value="31">Aventura</option>
          <option value="15">Estratégia</option>
          <option value="5">Shooter</option>
        </select>
      </div>

      {loading && <p>Buscando jogos...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {games.map((game) => (
          <Link key={game.id} to={`/jogo/${game.id}`} style={{ textDecoration: 'none', color: 'inherit', background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
            <img src={formatIGDBImage(game.cover?.url)} alt={game.name} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
            <div style={{ padding: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{game.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
