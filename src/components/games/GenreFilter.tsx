import { SlidersHorizontal } from 'lucide-react';

interface GenreOption {
  id: string;
  label: string;
}

const INDIE_GENRES: GenreOption[] = [
  { id: '', label: 'Todos os subgêneros' },
  { id: '8', label: 'Plataforma' },
  { id: '12', label: 'RPG' },
  { id: '31', label: 'Aventura' },
  { id: '15', label: 'Estratégia' },
  { id: '5', label: 'Shooter' },
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
          fontSize: '0.95rem',
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
