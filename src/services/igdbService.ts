import type { IGDBGame } from '../types/game';

export type GameFeedMode = 'featured' | 'popular';
export type GameSortOption = 'popular' | 'rating' | 'recent' | 'name';

export interface GamesPageResult {
  games: IGDBGame[];
  total: number;
}

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
  platform?: string;
  minRating?: string;
  sort?: GameSortOption;
  mode?: GameFeedMode;
  page?: number;
  limit?: number;
}): Promise<GamesPageResult> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.genre) query.set('genre', params.genre);
  if (params?.platform) query.set('platform', params.platform);
  if (params?.minRating) query.set('minRating', params.minRating);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.mode) query.set('mode', params.mode);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const response = await fetch(`/api/games?${query.toString()}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar catálogo de jogos indie');
  }

  const games: IGDBGame[] = await response.json();
  const totalHeader = Number(response.headers.get('X-Total-Count'));
  const total = Number.isFinite(totalHeader) && totalHeader > 0 ? totalHeader : games.length;

  return { games, total };
}

export async function fetchGameById(id: string): Promise<IGDBGame | null> {
  const response = await fetch(`/api/games?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar detalhes do jogo');
  }
  const data: IGDBGame[] = await response.json();
  return data[0] ?? null;
}