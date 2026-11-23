import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedToken: { token: string; expiresAt: number } | null = null;

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getTwitchToken();
    const { search = '', genre = '', id = '' } = req.query;

    let queryBody = `
      fields name, summary, rating, first_release_date,
             cover.url, genres.name, platforms.name, screenshots.url;
      limit 24;
    `;

    if (id) {
      queryBody += `where id = ${Number(id)};`;
    } else {
      const filters: string[] = ['genres = (32)', 'cover != null'];
      if (search) {
        const sanitized = String(search).replace(/"/g, '').trim();
        if (sanitized) filters.push(`name ~ *"${sanitized}"*`);
      }
      if (genre) {
        filters.push(`genres = (${Number(genre)})`);
      }
      queryBody += `where ${filters.join(' & ')}; sort rating desc;`;
    }

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID as string,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: queryBody,
    });

    if (!igdbRes.ok) {
      return res.status(igdbRes.status).json({ error: 'Erro na resposta da IGDB' });
    }

    const games = await igdbRes.json();
    return res.status(200).json(games);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    return res.status(500).json({ error: message });
  }
}