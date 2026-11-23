import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  icon,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        padding: '3rem 1.5rem',
        margin: '1.5rem auto',
        maxWidth: 480,
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 12,
      }}
    >
      <div style={{ color: '#a855f7' }}>
        {icon ?? <Gamepad2 size={44} strokeWidth={1.6} />}
      </div>
      <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>{title}</h2>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          style={{
            marginTop: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 8,
            background: '#7c3aed',
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
