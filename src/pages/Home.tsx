import { Link } from 'react-router-dom';
import { useGames } from '../hooks/useGames';
import { GameGrid } from '../components/games/GameGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export function Home() {
  const { games, loading, error } = useGames();

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>
            Indie Spot — Destaques Indie
          </h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            Descubra jogos independentes bem avaliados pela comunidade.
          </p>
        </div>

        <Link
          to="/explorar"
          style={{
            padding: '0.6rem 1.15rem',
            borderRadius: 8,
            background: '#7c3aed',
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Ver catálogo completo
        </Link>
      </div>

      {loading && <LoadingSpinner message="Carregando destaques indie..." />}

      {!loading && error && (
        <EmptyState
          title="Não foi possível carregar os destaques"
          description={error}
          actionLabel="Tentar em Explorar"
          actionTo="/explorar"
        />
      )}

      {!loading && !error && games.length === 0 && (
        <EmptyState
          title="Nenhum destaque disponível"
          description="Não encontramos jogos no momento. Tente novamente em instantes."
        />
      )}

      {!loading && !error && games.length > 0 && (
        <GameGrid games={games.slice(0, 8)} />
      )}
    </section>
  );
}