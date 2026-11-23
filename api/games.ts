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
  // Normaliza a popularidade em escala logarítmica (0 a 100) e combina com a nota
  const popularityScore = Math.min(Math.log10(count + 1) / 3, 1) * 100;
  return rating * 0.65 + popularityScore * 0.35;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getTwitchToken();
    const { search = '', genre = '', id = '', mode = '' } = req.query;

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
        'fields game_id, value; where popularity_type = 3; sort value desc; limit 150;'
      );

      if (primitives.length > 0) {
        const scoreByGameId = new Map(primitives.map((p) => [p.game_id, p.value]));
        const ids = primitives.map((p) => p.game_id).join(',');

        const popularIndies = await queryIGDB<IGDBGameRaw[]>(
          'games',
          token,
          `${BASE_FIELDS} where id = (${ids}) & genres = (32) & cover != null; limit 24;`
        );

        popularIndies.sort(
          (a, b) => (scoreByGameId.get(b.id) ?? 0) - (scoreByGameId.get(a.id) ?? 0)
        );

        return res.status(200).json(popularIndies);
      }

      // Fallback caso popularity_primitives não retorne resultados
      const fallback = await queryIGDB<IGDBGameRaw[]>(
        'games',
        token,
        `${BASE_FIELDS} where genres = (32) & cover != null & rating_count != null; sort rating_count desc; limit 24;`
      );
      return res.status(200).json(fallback);
    }

    // 3. Aba "Destaques Indie" — ordenado por popularidade + nota
    if (mode === 'featured' && !search && !genre) {
      const candidates = await queryIGDB<IGDBGameRaw[]>(
        'games',
        token,
        `${BASE_FIELDS} where genres = (32) & cover != null & rating != null & rating_count >= 15; sort rating_count desc; limit 50;`
      );

      candidates.sort((a, b) => computeFeaturedScore(b) - computeFeaturedScore(a));
      return res.status(200).json(candidates.slice(0, 24));
    }

    // 4. Busca e filtros da página Explorar
    const filters: string[] = ['genres = (32)', 'cover != null'];
    if (search) {
      const sanitized = String(search).replace(/"/g, '').trim();
      if (sanitized) filters.push(`name ~ *"${sanitized}"*`);
    }
    if (genre) {
      filters.push(`genres = (${Number(genre)})`);
    }

    const games = await queryIGDB<IGDBGameRaw[]>(
      'games',
      token,
      `${BASE_FIELDS} where ${filters.join(' & ')}; sort rating_count desc; limit 24;`
    );
    return res.status(200).json(games);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return res.status(500).json({ error: message });
  }
}