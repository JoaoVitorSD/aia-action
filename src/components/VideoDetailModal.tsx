import { Video } from '../types/video';
import { EmotionWidget } from './EmotionWidget';
import { ActionCard } from './ActionCard';

interface VideoDetailModalProps {
  video: Video;
  onClose: () => void;
  onSendAction: (videoId: string) => void;
}

export function VideoDetailModal({ video, onClose, onSendAction }: VideoDetailModalProps) {
  const handleSendAction = () => {
    onSendAction(video.video_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{video.video_id}</h2>
            <p className="text-sm text-gray-500 mt-1">{video.fonte}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span>👁️</span>
              <span className="font-semibold">{video.views_mock.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>❤️</span>
              <span className="font-semibold">{video.likes_mock.toLocaleString()} likes</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados Brutos</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Transcrição da Voz</p>
              <p className="text-gray-900 italic">"{video.transcricao_voz}"</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Insights Analíticos</h3>
            <div className="space-y-4">
              <EmotionWidget emocao={video.emocao_facial_predominante} />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-1">Sentimento Geral da IA</p>
                  <p className="text-lg font-bold text-blue-900">{video.sentimento_geral_ia}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-1">Tópico Analisado</p>
                  <p className="text-lg font-bold text-purple-900">{video.topico_analisado}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ação Sugerida</h3>
            <ActionCard
              sugestao_acao={video.sugestao_acao}
              prioridade_acao={video.prioridade_acao}
              status_acao={video.status_acao}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Justificativa</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{video.justificativa_acao}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {video.status_acao !== 'Ação Enviada' ? (
              <button
                onClick={handleSendAction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Enviar para Jira (Simular)
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                ✓ Ação Enviada
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

