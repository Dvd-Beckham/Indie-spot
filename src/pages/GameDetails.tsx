import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Monitor, Tag } from 'lucide-react';
import type { IGDBGame } from '../types/game';
import { fetchGameById, formatIGDBImage } from '../services/igdbService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { RatingBadge } from '../components/games/RatingBadge';

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<IGDBGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    fetchGameById(id)
      .then((data) => {
        if (active) setGame(data);
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
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do jogo..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Erro ao carregar o jogo"
        description={error}
        actionLabel="Voltar para Explorar"
        actionTo="/explorar"
      />
    );
  }

  if (!game) {
    return (
      <EmptyState
        title="Jogo não encontrado"
        description="Não encontramos informações para este ID no catálogo."
        actionLabel="Voltar para Explorar"
        actionTo="/explorar"
      />
    );
  }

  const releaseDate = game.first_release_date
    ? new Date(game.first_release_date * 1000).toLocaleDateString('pt-BR')
    : 'Data não informada';

  return (
    <section style={{ padding: '2rem 1.5rem', maxWidth: 1050, margin: '0 auto' }}>
      <Link
        to="/explorar"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
          color: '#c084fc',
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={18} />
        Voltar para Explorar
      </Link>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <img
          src={formatIGDBImage(game.cover?.url)}
          alt={game.name}
          style={{
            width: 264,
            maxWidth: '100%',
            borderRadius: 10,
            border: '1px solid #334155',
            objectFit: 'cover',
          }}
        />

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>{game.name}</h1>
            <RatingBadge rating={game.rating} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#94a3b8',
              fontSize: '0.9rem',
              margin: '0.75rem 0 1.25rem',
            }}
          >
            <Calendar size={16} />
            <span>Lançamento: {releaseDate}</span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <FavoriteButton game={game} variant="full" />
          </div>

          <p style={{ lineHeight: 1.65, color: '#e2e8f0', marginBottom: '1.5rem' }}>
            {game.summary ?? 'Sem sinopse cadastrada.'}
          </p>

          {game.genres && game.genres.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  marginBottom: '0.45rem',
                }}
              >
                <Tag size={15} />
                <span>Gêneros</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 999,
                      background: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid #7c3aed',
                      color: '#e9d5ff',
                      fontSize: '0.8rem',
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  marginBottom: '0.45rem',
                }}
              >
                <Monitor size={15} />
                <span>Plataformas</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {game.platforms.map((platform) => (
                  <span
                    key={platform.id}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 6,
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#cbd5e1',
                      fontSize: '0.8rem',
                    }}
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {game.screenshots && game.screenshots.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Screenshots</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {game.screenshots.slice(0, 6).map((shot) => (
              <img
                key={shot.id}
                src={formatIGDBImage(shot.url, 't_screenshot_big')}
                alt={`Screenshot de ${game.name}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 175,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #334155',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
