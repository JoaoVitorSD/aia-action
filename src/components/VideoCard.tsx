import { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  const getPriorityColor = (prioridade: Video['prioridade_acao']) => {
    switch (prioridade) {
      case 'Crítica':
        return 'border-l-red-500';
      case 'Alta':
        return 'border-l-orange-500';
      case 'Média':
        return 'border-l-yellow-500';
      case 'Baixa':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getPriorityColor(
        video.prioridade_acao
      )}`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{video.video_id}</h3>
            <p className="text-sm text-gray-500 mt-1">{video.fonte}</p>
          </div>
          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
            {video.prioridade_acao}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>👁️</span>
            <span>{formatNumber(video.views_mock)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{formatNumber(video.likes_mock)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 line-clamp-2">{video.transcricao_voz}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{video.sugestao_acao}</span>
          {video.status_acao === 'Ação Enviada' && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              ✓ Enviado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

