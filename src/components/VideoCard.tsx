import { MouseEvent, useEffect } from 'react';
import { Video } from '../types/video';
import {
  extractTiktokVideoId,
  fetchTiktokMetadata,
  getTiktokEmbedUrl,
  requestTiktokStats,
} from '../utils/tiktok';
import { requestTranscription } from '../utils/transcription';

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

  const viewsDisplay = video.views_atualizados ?? video.views_mock;
  const likesDisplay = video.likes_atualizados ?? video.likes_mock;

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

  useEffect(() => {
    let active = true;
    const loadMetrics = async () => {
      if (!video.video_url || !video.video_url.trim()) {
        return;
      }

      const videoId = extractTiktokVideoId(video.video_url);
      if (!videoId) {
        onUpdateVideo({
          metricas_status: 'erro',
          metricas_erro: 'Link inválido ou sem ID de vídeo do TikTok.',
        });
        return;
      }

      onUpdateVideo({
        metricas_status: 'carregando',
        metricas_erro: undefined,
      });

      const stats = await requestTiktokStats(video.video_url);
      if (!active) return;

      if (stats.error) {
        onUpdateVideo({
          metricas_status: 'erro',
          metricas_erro: stats.error,
        });
        return;
      }

      onUpdateVideo({
        metricas_status: 'sucesso',
        views_atualizados: typeof stats.views === 'number' ? stats.views : video.views_atualizados,
        likes_atualizados: typeof stats.likes === 'number' ? stats.likes : video.likes_atualizados,
        metricas_erro: undefined,
      });
    };

    loadMetrics();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.video_url]);

  const runTranscription = async () => {
    if (!video.video_url) {
      onUpdateVideo({
        transcricao_status: 'erro',
        transcricao_erro: 'Cole um link do TikTok para transcrever.',
      });
      return;
    }

    const videoId = extractTiktokVideoId(video.video_url);
    if (!videoId) {
      onUpdateVideo({
        transcricao_status: 'erro',
        transcricao_erro: 'Link inválido ou sem ID de vídeo do TikTok.',
      });
      return;
    }

    onUpdateVideo({
      transcricao_status: 'carregando',
      transcricao_erro: undefined,
    });

    const result = await requestTranscription(video.video_url, video.transcricao_voz);
    if (result.error) {
      onUpdateVideo({
        transcricao_status: 'erro',
        transcricao_erro: result.error,
      });
      return;
    }

    onUpdateVideo({
      transcricao_status: 'sucesso',
      transcricao_voz: result.transcription,
      transcricao_erro: undefined,
    });
  };

  const handleTranscribe = async (e: MouseEvent) => {
    e.stopPropagation();
    await runTranscription();
  };

  useEffect(() => {
    if (!video.video_url || video.transcricao_status) return;
    runTranscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.video_url, video.transcricao_status]);

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
            <span>{formatNumber(viewsDisplay)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{formatNumber(likesDisplay)}</span>
          </div>
        </div>

        <div className="mt-1">
          {video.metricas_status === 'carregando' && (
            <p className="text-xs text-blue-600">Atualizando views e likes...</p>
          )}
          {video.metricas_status === 'erro' && video.metricas_erro && (
            <p className="text-xs text-red-600">{video.metricas_erro}</p>
          )}
          {video.metricas_status === 'sucesso' && (
            <p className="text-xs text-green-600">Métricas atualizadas do TikTok.</p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">Transcrição</p>
            <button
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              onClick={handleTranscribe}
              disabled={video.transcricao_status === 'carregando'}
            >
              {video.transcricao_status === 'carregando' ? 'Transcrevendo...' : 'Transcrever áudio'}
            </button>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {video.transcricao_voz || 'Sem transcrição ainda.'}
          </p>
          {video.transcricao_status === 'erro' && video.transcricao_erro && (
            <p className="text-xs text-red-600 mt-1">{video.transcricao_erro}</p>
          )}
          {video.transcricao_status === 'sucesso' && (
            <p className="text-xs text-green-600 mt-1">Transcrição atualizada.</p>
          )}
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
                views_atualizados: undefined,
                likes_atualizados: undefined,
                metricas_status: undefined,
                metricas_erro: undefined,
                transcricao_status: undefined,
                transcricao_erro: undefined,
                transcricao_voz: '',
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
