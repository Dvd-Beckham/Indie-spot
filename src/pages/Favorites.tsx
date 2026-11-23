import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { GameGrid } from '../components/games/GameGrid';
import { EmptyState } from '../components/ui/EmptyState';

export function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.4rem', fontSize: '2rem' }}>
        Meus Favoritos ({favorites.length})
      </h1>
      <p style={{ margin: 0, color: '#94a3b8' }}>
        Sua lista pessoal fica salva automaticamente neste navegador.
      </p>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart size={44} strokeWidth={1.6} />}
          title="Nenhum jogo favoritado ainda"
          description="Explore o catálogo e clique no coração de um jogo para salvá-lo aqui."
          actionLabel="Explorar catálogo"
          actionTo="/explorar"
        />
      ) : (
        <GameGrid games={favorites} />
      )}
    </section>
  );
}