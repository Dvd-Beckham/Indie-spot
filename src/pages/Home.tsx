import { Link } from 'react-router-dom';
import { useGames } from '../hooks/useGames';
import { formatIGDBImage } from '../services/igdbService';

export function Home() {
  const { games, loading, error } = useGames();

  return (
    <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1>Indie Spot — Destaques Indie</h1>
      <p>Descubra jogos independentes avaliados pela comunidade.</p>

      {loading && <p>Carregando destaques...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {/* Substituir a grid provisória abaixo pelo componente <GameGrid /> da Grazielly */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {games.slice(0, 8).map((game) => (
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
