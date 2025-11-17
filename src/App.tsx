import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { mockVideos } from './data/mockVideos';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const handleUpdateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.video_id === videoId ? { ...video, ...updates } : video
      )
    );
  };

  return <Dashboard videos={videos} onUpdateVideo={handleUpdateVideo} />;
}

export default App;

