import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Explore } from '../pages/Explore';
import { GameDetails } from '../pages/GameDetails';
import { Favorites } from '../pages/Favorites';
import { About } from '../pages/About';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function AppRoutes() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        color: '#f8fafc',
      }}
    >
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/jogo/:id" element={<GameDetails />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
