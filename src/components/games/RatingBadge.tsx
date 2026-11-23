import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating?: number;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  if (rating === undefined || Number.isNaN(rating)) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.2rem 0.5rem',
          borderRadius: 6,
          background: 'rgba(51, 65, 85, 0.9)',
          color: '#cbd5e1',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
      >
        S/N
      </span>
    );
  }

  const score = Math.round(rating);
  const badgeColor =
    score >= 75 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';

  return (
    <span
      title={`Nota IGDB: ${score} de 100`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.55rem',
        borderRadius: 6,
        background: badgeColor,
        color: '#f8fafc',
        fontSize: '0.8rem',
        fontWeight: 700,
      }}
    >
      <Star size={13} fill="currentColor" />
      {score}
    </span>
  );
}
