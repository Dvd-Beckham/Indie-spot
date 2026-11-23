import { Link, NavLink } from 'react-router-dom';
import { Gamepad2, Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';

const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? '#c084fc' : '#e2e8f0',
  textDecoration: 'none',
  fontWeight: isActive ? 600 : 400,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.35rem 0.6rem',
  borderRadius: 6,
  background: isActive ? 'rgba(168, 85, 247, 0.14)' : 'transparent',
  transition: 'color 0.2s, background 0.2s',
});

export function Navbar() {
  const { totalFavorites } = useFavorites();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #1e293b',
      }}
    >
      <nav
        aria-label="Navegação principal"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.15rem',
          }}
        >
          <Gamepad2 size={24} color="#a855f7" />
          <span>Indie Spot</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <NavLink to="/" end style={getLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/explorar" style={getLinkStyle}>
            Explorar
          </NavLink>
          <NavLink to="/favoritos" style={getLinkStyle}>
            <Heart size={16} />
            <span>Favoritos</span>
            <span
              style={{
                background: '#7c3aed',
                color: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: 999,
              }}
            >
              {totalFavorites}
            </span>
          </NavLink>
          <NavLink to="/sobre" style={getLinkStyle}>
            Sobre
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
