import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { SearchBar } from '../components/games/SearchBar';
import { GenreFilter } from '../components/games/GenreFilter';
import { GameGrid } from '../components/games/GameGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export function Explore() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const {
    games,
    loading,
    error,
    page,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = useGames({ search, genre });

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

      {loading && <LoadingSpinner message={`Carregando página ${page}...`} />}

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
            Página {page} — exibindo {games.length} jogos
          </p>

          <GameGrid games={games} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={prevPage}
              disabled={!hasPrevPage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.7rem 1.25rem',
                borderRadius: 8,
                border: '1px solid #334155',
                background: hasPrevPage ? '#1e293b' : '#0f172a',
                color: hasPrevPage ? '#f8fafc' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: hasPrevPage ? 'pointer' : 'not-allowed',
              }}
            >
              <ChevronLeft size={18} />
              Página anterior
            </button>

            <span
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              Página {page}
            </span>

            <button
              type="button"
              onClick={nextPage}
              disabled={!hasNextPage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.7rem 1.25rem',
                borderRadius: 8,
                border: '1px solid #7c3aed',
                background: hasNextPage ? '#7c3aed' : '#1e293b',
                color: hasNextPage ? '#f8fafc' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: hasNextPage ? 'pointer' : 'not-allowed',
              }}
            >
              Próxima página
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
