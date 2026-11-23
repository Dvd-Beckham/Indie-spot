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
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = pagination.filterKey === filterKey ? pagination.page : 1;

  useEffect(() => {
    let active = true;
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
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
        setGames((prev) => {
          if (isFirstPage) return data;
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...data.filter((item) => !seen.has(item.id))];
        });
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, genre, mode, page]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPagination({ filterKey, page: page + 1 });
    }
  };

  return { games, loading, loadingMore, hasMore, error, loadMore };
}