interface NavigationProps {
  currentView: 'videos' | 'analytics';
  onViewChange: (view: 'videos' | 'analytics') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">AIA-Action</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewChange('videos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'videos'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Vídeos
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

