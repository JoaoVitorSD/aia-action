export function extractTiktokVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    if (match?.[1]) {
      return match[1];
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    const videoIndex = segments.findIndex((segment) => segment === 'video');
    if (videoIndex >= 0 && segments[videoIndex + 1]) {
      return segments[videoIndex + 1];
    }
  } catch (error) {
    // Ignora URLs inválidas
  }
  return null;
}

export function getTiktokEmbedUrl(url: string): string | null {
  const id = extractTiktokVideoId(url);
  if (!id) {
    return null;
  }
  return `https://www.tiktok.com/embed/v2/${id}`;
}

interface TiktokOembedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

export async function fetchTiktokMetadata(url: string) {
  if (!url) {
    return null;
  }

  try {
    const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(endpoint, { mode: 'cors' });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TiktokOembedResponse;
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
    };
  } catch (error) {
    return null;
  }
}

export interface TiktokStatsResult {
  views?: number;
  likes?: number;
  error?: string;
}

// Gera números determinísticos a partir da URL para simular métricas no front-end.
function pseudoRandomFromString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function requestTiktokStats(videoUrl: string): Promise<TiktokStatsResult> {
  if (!videoUrl) {
    return { error: 'Nenhum link de vídeo informado.' };
  }

  // Simula métricas baseadas na URL para que fiquem consistentes entre renderizações
  const seed = pseudoRandomFromString(videoUrl);
  const views = 5000 + (seed % 95000); // 5k a 100k
  const likes = Math.max(200, Math.round(views * (0.05 + (seed % 30) / 200))); // 5% a 20% de views

  // Simula latência
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { views, likes };
}
