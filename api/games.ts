import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedToken: { token: string; expiresAt: number } | null = null;

interface IGDBGameRaw {
  id: number;
  rating?: number;
  rating_count?: number;
}

interface PopularityPrimitive {
  game_id: number;
  value: number;
}

function getQueryParam(req: VercelRequest, key: string, fallback = ''): string {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === 'string') return fromQuery;
  if (Array.isArray(fromQuery) && fromQuery[0]) return fromQuery[0];

  if (req.url) {
    const parsed = new URL(req.url, 'http://localhost');
    return parsed.searchParams.get(key) ?? fallback;
  }

  return fallback;
}

async function getTwitchToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Credenciais TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET ausentes.');
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error('Falha ao autenticar na Twitch');
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

async function queryIGDB<T>(endpoint: string, token: string, body: string): Promise<T> {
  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID as string,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Erro na resposta da IGDB (${response.status})`);
  }

  return response.json() as Promise<T>;
}

const BASE_FIELDS = `
  fields name, summary, rating, rating_count, first_release_date,
         cover.url, genres.name, platforms.name, screenshots.url;
`;

function computeFeaturedScore(game: IGDBGameRaw): number {
  const rating = game.rating ?? 0;
  const count = game.rating_count ?? 0;
  const popularityScore = Math.min(Math.log10(count + 1) / 3, 1) * 100;
  return rating * 0.65 + popularityScore * 0.35;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getTwitchToken();

    const search = getQueryParam(req, 'search');
    const genre = getQueryParam(req, 'genre');
    const id = getQueryParam(req, 'id');
    const mode = getQueryParam(req, 'mode');
    const page = getQueryParam(req, 'page', '1');
    const limit = getQueryParam(req, 'limit', '24');

    const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    // 1. Detalhes de um jogo específico
    if (id) {
      const games = await queryIGDB<IGDBGameRaw[]>(
        'games',
        token,
        `${BASE_FIELDS} where id = ${Number(id)}; limit 1;`
      );
      return res.status(200).json(games);
    }

    // 2. Aba "Populares" — mais jogados recentemente (PopScore: Playing = 3)
    if (mode === 'popular') {
      const primitives = await queryIGDB<PopularityPrimitive[]>(
        'popularity_primitives',
        token,
        'fields game_id, value; where popularity_type = 3; sort value desc; limit 500;'
      );

      if (primitives.length > 0) {
        const scoreByGameId = new Map(primitives.map((p) => [p.game_id, p.value]));
        const ids = primitives.map((p) => p.game_id).join(',');

        const popularIndies = await queryIGDB<IGDBGameRaw[]>(
          'games',
          token,
          `${BASE_FIELDS} where id = (${ids}) & genres = (32) & cover != null; limit 100;`
        );

        popularIndies.sort(
          (a, b) => (scoreByGameId.get(b.id) ?? 0) - (scoreByGameId.get(a.id) ?? 0)
        );

        return res.status(200).json(popularIndies.slice(offset, offset + safeLimit));
      }

      const fallback = await queryIGDB<IGDBGameRaw[]>(
        'games',
        token,
        `${BASE_FIELDS} where genres = (32) & cover != null & rating_count != null; sort rating_count desc; limit ${safeLimit}; offset ${offset};`
      );
      return res.status(200).json(fallback);
    }

    // 3. Aba "Destaques Indie" — ordenado por popularidade + nota
    if (mode === 'featured' && !search && !genre) {
      const candidates = await queryIGDB<IGDBGameRaw[]>(
        'games',
        token,
        `${BASE_FIELDS} where genres = (32) & cover != null & rating != null & rating_count >= 5; sort rating_count desc; limit 200;`
      );

      candidates.sort((a, b) => computeFeaturedScore(b) - computeFeaturedScore(a));
      return res.status(200).json(candidates.slice(offset, offset + safeLimit));
    }

    // 4. Busca e filtros da página Explorar (com paginação via offset)
    const filters: string[] = ['genres = (32)', 'cover != null'];
    if (search) {
      const sanitized = search.replace(/"/g, '').trim();
      if (sanitized) filters.push(`name ~ *"${sanitized}"*`);
    }
    if (genre) {
      filters.push(`genres = (${Number(genre)})`);
    }

    const games = await queryIGDB<IGDBGameRaw[]>(
      'games',
      token,
      `${BASE_FIELDS} where ${filters.join(' & ')}; sort rating_count desc; limit ${safeLimit}; offset ${offset};`
    );
    return res.status(200).json(games);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return res.status(500).json({ error: message });
  }
}