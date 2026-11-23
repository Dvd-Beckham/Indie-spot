import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sparkles } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import type { GameFeedMode } from '../services/igdbService';
import { GameGrid } from '../components/games/GameGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export function Home() {
  const [activeTab, setActiveTab] = useState<GameFeedMode>('featured');
  const { games, loading, error } = useGames({ mode: activeTab });

  const isPopular = activeTab === 'popular';

  return (
    <section className="page-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>
            {isPopular ? 'Indie Spot — Populares Agora' : 'Indie Spot — Destaques Indie'}
          </h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            {isPopular
              ? 'Jogos independentes mais jogados recentemente na comunidade IGDB.'
              : 'Seleção combinando popularidade e nota dos melhores jogos independentes.'}
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

      <div
        role="tablist"
        aria-label="Filtrar vitrine da página inicial"
        style={{
          display: 'inline-flex',
          gap: '0.5rem',
          padding: '0.35rem',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 10,
          marginBottom: '0.5rem',
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isPopular}
          onClick={() => setActiveTab('featured')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1rem',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            background: !isPopular ? '#7c3aed' : 'transparent',
            color: !isPopular ? '#f8fafc' : '#94a3b8',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <Sparkles size={16} />
          Destaques Indie
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isPopular}
          onClick={() => setActiveTab('popular')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1rem',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            background: isPopular ? '#7c3aed' : 'transparent',
            color: isPopular ? '#f8fafc' : '#94a3b8',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <Flame size={16} />
          Populares
        </button>
      </div>

      {loading && (
        <LoadingSpinner
          message={
            isPopular
              ? 'Carregando jogos indie mais jogados recentemente...'
              : 'Carregando destaques indie...'
          }
        />
      )}

      {!loading && error && (
        <EmptyState
          title="Não foi possível carregar os jogos"
          description={error}
          actionLabel="Tentar em Explorar"
          actionTo="/explorar"
        />
      )}

      {!loading && !error && games.length === 0 && (
        <EmptyState
          title="Nenhum jogo disponível"
          description="Não encontramos jogos para esta aba no momento. Tente novamente em instantes."
        />
      )}

      {!loading && !error && games.length > 0 && (
        <GameGrid games={games.slice(0, 50)} />
      )}
    </section>
  );
}