import { useState } from 'react';
import { useGames } from '../hooks/useGames';
import { SearchBar } from '../components/games/SearchBar';
import { GenreFilter } from '../components/games/GenreFilter';
import { GameGrid } from '../components/games/GameGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export function Explore() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const { games, loading, loadingMore, hasMore, error, loadMore } = useGames({
    search,
    genre,
  });

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>
        Explorar Catálogo Indie
      </h1>
      <p style={{ margin: 0, color: '#94a3b8' }}>
        Busque pelo título ou filtre por subgênero para encontrar seu próximo jogo.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          margin: '1.5rem 0 2rem',
          flexWrap: 'wrap',
        }}
      >
        <SearchBar value={search} onChange={setSearch} />
        <GenreFilter value={genre} onChange={setGenre} />
      </div>

      {loading && <LoadingSpinner message="Buscando jogos indie..." />}

      {!loading && error && (
        <EmptyState title="Erro ao buscar jogos" description={error} />
      )}

      {!loading && !error && games.length === 0 && (
        <EmptyState
          title="Nenhum jogo encontrado"
          description="Tente alterar o termo de busca ou selecionar outro subgênero."
        />
      )}

      {!loading && !error && games.length > 0 && (
        <>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Exibindo {games.length} jogos
          </p>

          <GameGrid games={games} />

          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                style={{
                  padding: '0.75rem 1.75rem',
                  borderRadius: 8,
                  border: '1px solid #7c3aed',
                  background: loadingMore ? '#334155' : '#7c3aed',
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                }}
              >
                {loadingMore ? 'Carregando mais jogos...' : 'Carregar mais jogos'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
