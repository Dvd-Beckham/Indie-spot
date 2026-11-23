import { useState, useEffect } from 'react';
import type { IGDBGame } from '../types/game';
import { fetchIndieGames } from '../services/igdbService';
import type { GameFeedMode, GameSortOption } from '../services/igdbService';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 50;

export function useGames(filters?: {
  search?: string;
  genre?: string;
  platform?: string;
  minRating?: string;
  sort?: GameSortOption;
  mode?: GameFeedMode;
}) {
  const debouncedSearch = useDebounce(filters?.search ?? '', 400);
  const genre = filters?.genre ?? '';
  const platform = filters?.platform ?? '';
  const minRating = filters?.minRating ?? '';
  const sort = filters?.sort ?? 'popular';
  const mode = filters?.mode;

  const filterKey = `${debouncedSearch}|${genre}|${platform}|${minRating}|${sort}|${mode ?? ''}`;

  const [games, setGames] = useState<IGDBGame[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ filterKey, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchIndieGames({
      search: debouncedSearch,
      genre,
      platform,
      minRating,
      sort,
      mode,
      page,
      limit: PAGE_SIZE,
    })
      .then((result) => {
        if (!active) return;
        setGames(result.games);
        setTotal(result.total);
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
  }, [debouncedSearch, genre, platform, minRating, sort, mode, page]);

  const goToPage = (targetPage: number) => {
    const clamped = Math.min(Math.max(targetPage, 1), totalPages);
    if (!loading && clamped !== page) {
      setPagination({ filterKey, page: clamped });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  return {
    games,
    total,
    loading,
    error,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    goToPage,
    nextPage,
    prevPage,
  };
}