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
    <article
      style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        to={`/jogo/${game.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={formatIGDBImage(game.cover?.url)}
            alt={game.name}
            loading="lazy"
            style={{
              width: '100%',
              height: 290,
              objectFit: 'cover',
              display: 'block',
            }}
          />

          <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
            <RatingBadge rating={game.rating} />
          </div>

          <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
            <FavoriteButton game={game} variant="icon" />
          </div>
        </div>

        <div
          style={{
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            flex: 1,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              color: '#f8fafc',
              lineHeight: 1.3,
            }}
          >
            {game.name}
          </h3>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#94a3b8',
            }}
          >
            <span>{game.genres?.[0]?.name ?? 'Indie'}</span>
            {releaseYear && <span>{releaseYear}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
