import type { IGDBGame } from '../../types/game';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: IGDBGame[];
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
