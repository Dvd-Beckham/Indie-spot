import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar jogo indie...',
}: SearchBarProps) {
  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        minWidth: 220,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Search
        size={18}
        color="#94a3b8"
        style={{ position: 'absolute', left: '0.85rem', pointerEvents: 'none' }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar jogo indie"
        style={{
          width: '100%',
          padding: '0.7rem 2.4rem 0.7rem 2.6rem',
          borderRadius: 8,
          border: '1px solid #334155',
          background: '#1e293b',
          color: '#f8fafc',
          fontSize: '0.95rem',
          outline: 'none',
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          style={{
            position: 'absolute',
            right: '0.6rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'inline-flex',
            padding: '0.25rem',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
