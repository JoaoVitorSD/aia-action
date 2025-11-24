import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Navigation } from './components/Navigation';
import { mockVideos } from './data/mockVideos';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [currentView, setCurrentView] = useState<'videos' | 'analytics'>('videos');

  const handleUpdateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.video_id === videoId ? { ...video, ...updates } : video
      )
    );
  };

  return (
    <div>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {currentView === 'videos' ? (
        <Dashboard videos={videos} onUpdateVideo={handleUpdateVideo} />
      ) : (
        <AnalyticsDashboard videos={videos} />
      )}
    </div>
  );
}

export default App;

