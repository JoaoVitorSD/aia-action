import { useEffect, useState } from 'react';
import { Video } from '../types/video';
import { VideoCard } from './VideoCard';
import { VideoDetailModal } from './VideoDetailModal';
import { AdjectiveStats } from './AdjectiveStats';

interface DashboardProps {
  videos: Video[];
  onUpdateVideo: (videoId: string, updates: Partial<Video>) => void;
}

export function Dashboard({ videos, onUpdateVideo }: DashboardProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterFonte, setFilterFonte] = useState<'Todas' | 'TikTok' | 'YouTube'>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtro por fonte
  const videosByFonte =
    filterFonte === 'Todas'
      ? videos
      : videos.filter((video) => video.fonte === filterFonte);

  // Filtro por busca (simula busca na transcrição)
  const filteredVideos = searchQuery.trim()
    ? videosByFonte.filter((video) =>
        video.transcricao_voz.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videosByFonte;

  useEffect(() => {
    if (!selectedVideo) return;
    const freshVideo = videos.find((v) => v.video_id === selectedVideo.video_id);
    if (freshVideo && freshVideo !== selectedVideo) {
      setSelectedVideo(freshVideo);
    }
  }, [videos, selectedVideo]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleSendAction = (videoId: string) => {
    onUpdateVideo(videoId, { status_acao: 'Ação Enviada' });
    if (selectedVideo?.video_id === videoId) {
      setSelectedVideo({ ...selectedVideo, status_acao: 'Ação Enviada' });
    }
    setTimeout(() => {
      alert('Ação enviada com sucesso! (Simulação)');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AIA-Action Dashboard</h1>
                <p className="text-gray-600 mt-1">Análise Multimodal de Vídeos</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={filterFonte}
                  onChange={(e) => setFilterFonte(e.target.value as typeof filterFonte)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todas">Todas as Fontes</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                </select>
                <div className="text-sm text-gray-600">
                  {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vídeos por transcrição ou comentário..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVideos.length > 0 && (
          <div className="mb-8">
            <AdjectiveStats videos={filteredVideos} />
          </div>
        )}

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum vídeo encontrado com os filtros selecionados.</p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Tente buscar por termos como: "restaurante", "delicioso", "cremoso", "salgado", etc.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vídeos Indexados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                  onUpdateVideo={(updates) => onUpdateVideo(video.video_id, updates)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          onClose={handleCloseModal}
          onSendAction={handleSendAction}
        />
      )}
    </div>
  );
}
