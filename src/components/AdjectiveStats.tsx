import { Video } from '../types/video';
import { getAdjectiveStats } from '../utils/adjectiveExtractor';

interface AdjectiveStatsProps {
  videos: Video[];
}

export function AdjectiveStats({ videos }: AdjectiveStatsProps) {
  const stats = getAdjectiveStats(videos);

  if (stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Adjetivos Positivos</h2>
        <p className="text-gray-500">Nenhum adjetivo positivo encontrado nos vídeos filtrados.</p>
      </div>
    );
  }

  const getAdjectiveColor = (adjective: string) => {
    const colors: Record<string, string> = {
      delicioso: 'bg-green-100 text-green-800 border-green-300',
      cremoso: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      salgado: 'bg-orange-100 text-orange-800 border-orange-300',
      quente: 'bg-red-100 text-red-800 border-red-300',
      frio: 'bg-blue-100 text-blue-800 border-blue-300',
      fresco: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      crocante: 'bg-amber-100 text-amber-800 border-amber-300',
      perfeito: 'bg-purple-100 text-purple-800 border-purple-300',
    };

    return colors[adjective] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Adjetivos Positivos</h2>
        <span className="text-sm text-gray-500">
          {videos.length} vídeo{videos.length !== 1 ? 's' : ''} analisado{videos.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(({ adjective, count, percentage }) => (
          <div
            key={adjective}
            className={`p-4 rounded-lg border-2 ${getAdjectiveColor(adjective)} transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold capitalize">{adjective}</h3>
              <span className="text-2xl font-bold">{count}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getAdjectiveColor(adjective).split(' ')[0]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium">{percentage}%</span>
            </div>
            <p className="text-xs mt-2 opacity-75">
              {count} vídeo{count !== 1 ? 's' : ''} menciona{count === 1 ? '' : 'm'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

