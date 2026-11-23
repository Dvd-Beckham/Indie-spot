import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import type { IGDBGame } from '../../types/game';
import { useFavorites } from '../../contexts/FavoritesContext';

interface FavoriteButtonProps {
  game: IGDBGame;
  variant?: 'icon' | 'full';
}

export function FavoriteButton({ game, variant = 'icon' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(game.id);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(game);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? `Remover ${game.name} dos favoritos` : `Adicionar ${game.name} aos favoritos`}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: variant === 'full' ? '0.65rem 1.2rem' : '0.45rem',
        borderRadius: 8,
        border: `1px solid ${active ? '#9333ea' : '#334155'}`,
        background: active ? '#7c3aed' : 'rgba(15, 23, 42, 0.85)',
        color: '#f8fafc',
        fontWeight: 500,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
      {variant === 'full' && (active ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos')}
    </button>
  );
}
