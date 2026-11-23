import { useState, useEffect } from 'react';
import type { IGDBGame } from '../types/game';
import { fetchIndieGames } from '../services/igdbService';
import type { GameFeedMode } from '../services/igdbService';
import { useDebounce } from './useDebounce';

export function useGames(filters?: {
  search?: string;
  genre?: string;
  mode?: GameFeedMode;
}) {
  const [games, setGames] = useState<IGDBGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters?.search ?? '', 400);
  const genre = filters?.genre ?? '';
  const mode = filters?.mode;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchIndieGames({ search: debouncedSearch, genre, mode })
      .then((data) => {
        if (active) setGames(data);
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
  }, [debouncedSearch, genre, mode]);

  return { games, loading, error };
}