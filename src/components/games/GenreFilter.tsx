import { SlidersHorizontal } from 'lucide-react';

interface GenreOption {
  id: string;
  label: string;
}

const INDIE_GENRES: GenreOption[] = [
  { id: '', label: 'Todos os subgêneros' },
  { id: '31', label: 'Aventura' },
  { id: '8', label: 'Plataforma' },
  { id: '12', label: 'RPG' },
  { id: '9', label: 'Puzzle' },
  { id: '15', label: 'Estratégia' },
  { id: '16', label: 'Estratégia por Turnos (TBS)' },
  { id: '13', label: 'Simulador' },
  { id: '5', label: 'Shooter' },
  { id: '25', label: "Hack and Slash / Beat 'em up" },
  { id: '33', label: 'Arcade' },
  { id: '2', label: 'Point-and-Click' },
  { id: '34', label: 'Visual Novel' },
  { id: '35', label: 'Cartas & Tabuleiro' },
  { id: '4', label: 'Luta' },
  { id: '10', label: 'Corrida' },
];

interface GenreFilterProps {
  value: string;
  onChange: (genreId: string) => void;
}

export function GenreFilter({ value, onChange }: GenreFilterProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <SlidersHorizontal
        size={16}
        color="#94a3b8"
        style={{ position: 'absolute', left: '0.85rem', pointerEvents: 'none' }}
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtrar por subgênero"
        style={{
          padding: '0.7rem 1rem 0.7rem 2.4rem',
          borderRadius: 8,
          border: '1px solid #334155',
          background: '#1e293b',
          color: '#f8fafc',
          fontSize: '0.9rem',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {INDIE_GENRES.map((genre) => (
          <option key={genre.id || 'all'} value={genre.id}>
            {genre.label}
          </option>
        ))}
      </select>
    </div>
  );
}
