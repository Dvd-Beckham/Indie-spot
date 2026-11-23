import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { IGDBGame } from '../types/game';

interface FavoritesContextData {
  favorites: IGDBGame[];
  totalFavorites: number;
  toggleFavorite: (game: IGDBGame) => void;
  isFavorite: (gameId: number) => boolean;
}

const STORAGE_KEY = '@indie-spot:favorites';

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<IGDBGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as IGDBGame[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (game: IGDBGame) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === game.id);
      return exists ? prev.filter((item) => item.id !== game.id) : [...prev, game];
    });
  };

  const isFavorite = (gameId: number) => favorites.some((item) => item.id === gameId);

  const value = useMemo(
    () => ({
      favorites,
      totalFavorites: favorites.length,
      toggleFavorite,
      isFavorite,
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
