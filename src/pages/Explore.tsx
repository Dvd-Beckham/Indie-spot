import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import type { GameSortOption } from '../services/igdbService';
import { SearchBar } from '../components/games/SearchBar';
import { GenreFilter } from '../components/games/GenreFilter';
import { GameGrid } from '../components/games/GameGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

const PLATFORM_OPTIONS = [
  { id: '', label: 'Todas as plataformas' },
  { id: '6', label: 'PC (Windows)' },
  { id: '130', label: 'Nintendo Switch' },
  { id: '167', label: 'PlayStation 5' },
  { id: '48', label: 'PlayStation 4' },
  { id: '169', label: 'Xbox Series X|S' },
  { id: '49', label: 'Xbox One' },
  { id: '34', label: 'Android' },
  { id: '39', label: 'iOS' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Qualquer nota' },
  { value: '70', label: 'Nota 70+' },
  { value: '80', label: 'Nota 80+' },
  { value: '90', label: 'Nota 90+' },
];

const SORT_OPTIONS: { value: GameSortOption; label: string }[] = [
  { value: 'popular', label: 'Mais populares' },
  { value: 'rating', label: 'Melhor avaliados' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'name', label: 'Ordem alfabética (A–Z)' },
];

const selectStyle = {
  padding: '0.7rem 0.9rem',
  borderRadius: 8,
  border: '1px solid #334155',
  background: '#1e293b',
  color: '#f8fafc',
  fontSize: '0.9rem',
  cursor: 'pointer',
  outline: 'none',
};

export function Explore() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState<GameSortOption>('popular');

  const {
    games,
    loading,
    error,
    page,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = useGames({ search, genre, platform, minRating, sort });

  const hasActiveFilters = Boolean(
    search || genre || platform || minRating || sort !== 'popular'
  );

  const handleClearFilters = () => {
    setSearch('');
    setGenre('');
    setPlatform('');
    setMinRating('');
    setSort('popular');
  };

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>
        Explorar Catálogo Indie
      </h1>
      <p style={{ margin: 0, color: '#94a3b8' }}>
        Combine busca, subgênero, plataforma, nota mínima e ordenação para explorar o catálogo.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          margin: '1.5rem 0 2rem',
        }}
      >
        <SearchBar value={search} onChange={setSearch} />

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <GenreFilter value={genre} onChange={setGenre} />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            aria-label="Filtrar por plataforma"
            style={selectStyle}
          >
            {PLATFORM_OPTIONS.map((item) => (
              <option key={item.id || 'all-platforms'} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            aria-label="Filtrar por nota mínima"
            style={selectStyle}
          >
            {RATING_OPTIONS.map((item) => (
              <option key={item.value || 'all-ratings'} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as GameSortOption)}
            aria-label="Ordenar jogos"
            style={selectStyle}
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                Ordenar: {item.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.7rem 1rem',
                borderRadius: 8,
                border: '1px solid #475569',
                background: 'transparent',
                color: '#cbd5e1',
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={15} />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner message={`Carregando página ${page}...`} />}

      {!loading && error && (
        <EmptyState title="Erro ao buscar jogos" description={error} />
      )}

      {!loading && !error && games.length === 0 && (
        <EmptyState
          title="Nenhum jogo encontrado"
          description="Tente remover algum filtro ou alterar o termo de busca."
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
