import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#1e293b',
        borderTop: '1px solid #334155',
        color: '#94a3b8',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
          <Gamepad2 size={18} color="#a855f7" />
          <span>Indie Spot © {year} — Dados fornecidos por IGDB.com</span>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <Link to="/explorar" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Explorar
          </Link>
          <Link to="/favoritos" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Favoritos
          </Link>
          <Link to="/sobre" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Sobre
          </Link>
        </div>
      </div>
    </footer>
  );
}
