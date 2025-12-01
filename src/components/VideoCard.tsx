import { useEffect } from 'react';
import { Video } from '../types/video';
import { extractTiktokVideoId, fetchTiktokMetadata, getTiktokEmbedUrl } from '../utils/tiktok';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  onUpdateVideo: (updates: Partial<Video>) => void;
}

export function VideoCard({ video, onClick, onUpdateVideo }: VideoCardProps) {
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

  const embedUrl = video.video_url ? getTiktokEmbedUrl(video.video_url) : null;

  useEffect(() => {
    let active = true;
    const loadMetadata = async () => {
      if (!video.video_url || !video.video_url.trim()) {
        return;
      }

      const videoId = extractTiktokVideoId(video.video_url);
      if (!videoId) {
        onUpdateVideo({
          video_metadata_status: 'erro',
          video_metadata_error: 'Link inválido ou sem ID de vídeo do TikTok.',
        });
        return;
      }

      onUpdateVideo({
        video_metadata_status: 'carregando',
        video_metadata_error: undefined,
      });

      const meta = await fetchTiktokMetadata(video.video_url);
      if (!active) return;

      if (!meta) {
        onUpdateVideo({
          video_metadata_status: 'erro',
          video_metadata_error:
            'Não foi possível carregar o título/autor do TikTok (possível bloqueio de CORS ou link inválido).',
        });
        return;
      }

      onUpdateVideo({
        video_metadata_status: 'sucesso',
        video_title: meta.title,
        video_author: meta.author,
        video_thumbnail_url: meta.thumbnail,
        video_metadata_error: undefined,
      });
    };

    loadMetadata();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.video_url]);

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
            <h3 className="text-lg font-bold text-gray-900">
              {video.video_title || video.video_id}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {video.video_author ? `${video.video_author} · ${video.fonte}` : video.fonte}
            </p>
            {video.video_title && (
              <p className="text-xs text-gray-400 mt-1">ID: {video.video_id}</p>
            )}
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

        <div
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Link do TikTok
          </label>
          <input
            type="url"
            value={video.video_url || ''}
            placeholder="Cole o link do vídeo do TikTok"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onUpdateVideo({
                video_url: e.target.value,
                video_title: undefined,
                video_author: undefined,
                video_thumbnail_url: undefined,
                video_metadata_error: undefined,
                video_metadata_status: undefined,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Após colar, o player aparece abaixo.</p>
          {video.video_metadata_status === 'carregando' && (
            <p className="text-xs text-blue-600 mt-1">Buscando metadados do TikTok...</p>
          )}
          {video.video_metadata_status === 'erro' && video.video_metadata_error && (
            <p className="text-xs text-red-600 mt-1">{video.video_metadata_error}</p>
          )}
        </div>

        {video.video_url && (
          <div
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {embedUrl ? (
              <div className="relative w-full overflow-hidden rounded-lg border border-gray-200" style={{ paddingBottom: '177%', height: 0 }}>
                <iframe
                  src={embedUrl}
                  title={`TikTok player ${video.video_id}`}
                  allow="encrypted-media; clipboard-write"
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-xs text-red-600">Não foi possível ler o link informado.</p>
            )}
          </div>
        )}

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
