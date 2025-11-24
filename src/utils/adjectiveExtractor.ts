import { Video } from '../types/video';

// Lista de adjetivos positivos relacionados a comida/restaurantes
const POSITIVE_ADJECTIVES = [
  'delicioso',
  'deliciosa',
  'frio',
  'fria',
  'salgado',
  'salgada',
  'cremoso',
  'cremosa',
  'quente',
  'doce',
  'fresco',
  'fresca',
  'crocante',
  'perfeito',
  'perfeita',
  'incrível',
  'incrivel',
  'ótimo',
  'ótima',
  'excelente',
  'maravilhoso',
  'maravilhosa',
  'saboroso',
  'saborosa',
  'apetitoso',
  'apetitosa',
];

/**
 * Extrai adjetivos positivos de uma transcrição
 */
export function extractAdjectives(transcription: string): string[] {
  const lowerTranscription = transcription.toLowerCase();
  const foundAdjectives: string[] = [];

  POSITIVE_ADJECTIVES.forEach((adjective) => {
    // Busca por palavra completa (com word boundaries)
    const regex = new RegExp(`\\b${adjective}\\b`, 'gi');
    if (regex.test(lowerTranscription)) {
      // Normaliza para forma base (masculino singular quando possível)
      const normalized = normalizeAdjective(adjective);
      if (!foundAdjectives.includes(normalized)) {
        foundAdjectives.push(normalized);
      }
    }
  });

  return foundAdjectives;
}

/**
 * Normaliza adjetivos para forma base
 */
function normalizeAdjective(adjective: string): string {
  const lower = adjective.toLowerCase();
  
  // Mapeamento de variações para forma base
  const normalizationMap: Record<string, string> = {
    'deliciosa': 'delicioso',
    'salgada': 'salgado',
    'cremosa': 'cremoso',
    'fria': 'frio',
    'fresca': 'fresco',
    'perfeita': 'perfeito',
    'ótima': 'ótimo',
    'maravilhosa': 'maravilhoso',
    'saborosa': 'saboroso',
    'apetitosa': 'apetitoso',
    'incrivel': 'incrível',
  };

  return normalizationMap[lower] || lower;
}

/**
 * Conta ocorrências de cada adjetivo nos vídeos fornecidos
 */
export function countAdjectives(videos: Video[]): Map<string, number> {
  const counts = new Map<string, number>();

  videos.forEach((video) => {
    const adjectives = extractAdjectives(video.transcricao_voz);
    adjectives.forEach((adjective) => {
      const currentCount = counts.get(adjective) || 0;
      counts.set(adjective, currentCount + 1);
    });
  });

  return counts;
}

/**
 * Retorna estatísticas de adjetivos ordenadas por frequência
 */
export function getAdjectiveStats(videos: Video[]): Array<{ adjective: string; count: number; percentage: number }> {
  const counts = countAdjectives(videos);
  const total = videos.length;
  
  const stats = Array.from(counts.entries())
    .map(([adjective, count]) => ({
      adjective,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count); // Ordena por contagem decrescente

  return stats;
}

