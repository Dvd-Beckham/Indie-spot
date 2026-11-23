import type { IGDBGame } from '../types/game';

export function formatIGDBImage(
  url?: string,
  size: 't_cover_big' | 't_screenshot_big' = 't_cover_big'
): string {
  if (!url) {
    return 'https://placehold.co/264x374/1e293b/94a3b8?text=Sem+Capa';
  }
  const fullUrl = url.startsWith('//') ? `https:${url}` : url;
  return fullUrl.replace('t_thumb', size);
}

export async function fetchIndieGames(params?: {
  search?: string;
  genre?: string;
}): Promise<IGDBGame[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.genre) query.set('genre', params.genre);

  const response = await fetch(`/api/games?${query.toString()}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar catálogo de jogos indie');
  }
  return response.json();
}

export async function fetchGameById(id: string): Promise<IGDBGame | null> {
  const response = await fetch(`/api/games?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar detalhes do jogo');
  }
  const data: IGDBGame[] = await response.json();
  return data[0] ?? null;
}
