import { Link } from 'react-router-dom';
import type { IGDBGame } from '../../types/game';
import { formatIGDBImage } from '../../services/igdbService';
import { FavoriteButton } from '../ui/FavoriteButton';
import { RatingBadge } from './RatingBadge';

interface GameCardProps {
  game: IGDBGame;
}

export function GameCard({ game }: GameCardProps) {
  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;

  return (
    <article className="game-card">
      <Link to={`/jogo/${game.id}`} className="game-card-link">
        <div className="game-card-media">
          <img
            src={formatIGDBImage(game.cover?.url)}
            alt={game.name}
            loading="lazy"
            className="game-card-cover"
          />

          <div className="game-card-badge-left">
            <RatingBadge rating={game.rating} />
          </div>

          <div className="game-card-badge-right">
            <FavoriteButton game={game} variant="icon" />
          </div>
        </div>

        <div className="game-card-body">
          <h3 className="game-card-title">{game.name}</h3>

          <div className="game-card-meta">
            <span>{game.genres?.[0]?.name ?? 'Indie'}</span>
            {releaseYear && <span>{releaseYear}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
