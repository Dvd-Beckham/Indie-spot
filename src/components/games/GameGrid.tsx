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
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
