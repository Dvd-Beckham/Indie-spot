import { Routes, Route, NavLink } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Explore } from '../pages/Explore';
import { GameDetails } from '../pages/GameDetails';
import { Favorites } from '../pages/Favorites';
import { About } from '../pages/About';
import { useFavorites } from '../contexts/FavoritesContext';

export function AppRoutes() {
  const { totalFavorites } = useFavorites();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a', color: '#f8fafc' }}>
      {/* Substituir este header provisório pelo <Navbar /> do Beckham */}
      <header style={{ padding: '1rem 2rem', background: '#1e293b', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <strong style={{ marginRight: 'auto' }}>🎮 Indie Spot</strong>
        <NavLink to="/" style={{ color: '#f8fafc' }}>Home</NavLink>
        <NavLink to="/explorar" style={{ color: '#f8fafc' }}>Explorar</NavLink>
        <NavLink to="/favoritos" style={{ color: '#f8fafc' }}>Favoritos ({totalFavorites})</NavLink>
        <NavLink to="/sobre" style={{ color: '#f8fafc' }}>Sobre</NavLink>
      </header>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/jogo/:id" element={<GameDetails />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </main>

      {/* Substituir este footer provisório pelo <Footer /> do Beckham */}
      <footer style={{ padding: '1rem 2rem', background: '#1e293b', textAlign: 'center', fontSize: '0.875rem' }}>
        Indie Spot © 2026 — Dados fornecidos por IGDB.com
      </footer>
    </div>
  );
}
