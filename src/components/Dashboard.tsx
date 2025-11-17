import { useState } from 'react';
import { Video } from '../types/video';
import { VideoCard } from './VideoCard';
import { VideoDetailModal } from './VideoDetailModal';

interface DashboardProps {
  videos: Video[];
  onUpdateVideo: (videoId: string, updates: Partial<Video>) => void;
}

export function Dashboard({ videos, onUpdateVideo }: DashboardProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterFonte, setFilterFonte] = useState<'Todas' | 'TikTok' | 'YouTube'>('Todas');

  const filteredVideos =
    filterFonte === 'Todas'
      ? videos
      : videos.filter((video) => video.fonte === filterFonte);

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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum vídeo encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.video_id} video={video} onClick={() => handleVideoClick(video)} />
            ))}
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

