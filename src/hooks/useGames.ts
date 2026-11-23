import { useState, useEffect } from 'react';
import type { IGDBGame } from '../types/game';
import { fetchIndieGames } from '../services/igdbService';
import type { GameFeedMode } from '../services/igdbService';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 24;

export function useGames(filters?: {
  search?: string;
  genre?: string;
  mode?: GameFeedMode;
}) {
  const debouncedSearch = useDebounce(filters?.search ?? '', 400);
  const genre = filters?.genre ?? '';
  const mode = filters?.mode;
  const filterKey = `${debouncedSearch}|${genre}|${mode ?? ''}`;

  const [games, setGames] = useState<IGDBGame[]>([]);
  const [pagination, setPagination] = useState({ filterKey, page: 1 });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = pagination.filterKey === filterKey ? pagination.page : 1;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchIndieGames({
      search: debouncedSearch,
      genre,
      mode,
      page,
      limit: PAGE_SIZE,
    })
      .then((data) => {
        if (!active) return;
        setGames(data);
        setHasNextPage(data.length === PAGE_SIZE);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, genre, mode, page]);

  const nextPage = () => {
    if (!loading && hasNextPage) {
      setPagination({ filterKey, page: page + 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (!loading && page > 1) {
      setPagination({ filterKey, page: page - 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    games,
    loading,
    error,
    page,
    hasNextPage,
    hasPrevPage: page > 1,
    nextPage,
    prevPage,
  };
}