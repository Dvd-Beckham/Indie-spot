import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '3rem 1rem',
        color: '#94a3b8',
      }}
    >
      <Loader2
        size={36}
        color="#a855f7"
        style={{ animation: 'indie-spin 0.9s linear infinite' }}
      />
      <p style={{ margin: 0, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}
