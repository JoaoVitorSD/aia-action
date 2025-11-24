import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Video } from '../types/video';
import { getAdjectiveStats } from '../utils/adjectiveExtractor';

interface AnalyticsDashboardProps {
  videos: Video[];
}

export function AnalyticsDashboard({ videos }: AnalyticsDashboardProps) {
  // Estatísticas de adjetivos positivos
  const adjectiveStats = useMemo(() => getAdjectiveStats(videos), [videos]);
  
  // Estatísticas de sentimentos
  const sentimentStats = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((video) => {
      const sentiment = video.sentimento_geral_ia;
      counts[sentiment] = (counts[sentiment] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [videos]);

  // Estatísticas de fontes
  const fonteStats = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((video) => {
      counts[video.fonte] = (counts[video.fonte] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [videos]);

  // Estatísticas de prioridades
  const prioridadeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((video) => {
      counts[video.prioridade_acao] = (counts[video.prioridade_acao] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [videos]);

  // Estatísticas de emoções
  const emotionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((video) => {
      const emotion = video.emocao_facial_predominante.split(' ')[0];
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [videos]);

  // Estatísticas gerais
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + v.views_mock, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes_mock, 0);
  const avgViews = Math.round(totalViews / totalVideos);

  // Cores para gráficos
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Dados para gráfico de adjetivos (top 10)
  const topAdjectives = adjectiveStats.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Análise detalhada dos vídeos indexados</p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total de Vídeos</p>
            <p className="text-3xl font-bold text-gray-900">{totalVideos}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total de Views</p>
            <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total de Likes</p>
            <p className="text-3xl font-bold text-gray-900">{totalLikes.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Média de Views</p>
            <p className="text-3xl font-bold text-gray-900">{avgViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Seção de Opiniões */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Opiniões</h2>
          
          {topAdjectives.length > 0 ? (
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topAdjectives}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="adjective" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Ocorrências" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma opinião encontrada</p>
          )}

          {/* Cards de opiniões */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {adjectiveStats.map(({ adjective, count, percentage }) => (
              <div
                key={adjective}
                className="p-4 rounded-lg border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-green-900 capitalize">{adjective}</h3>
                  <span className="text-lg font-bold text-green-800">{count}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-green-700 mt-1">{percentage}% dos vídeos</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gráficos em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Sentimentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Distribuição de Sentimentos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Fontes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Distribuição por Fonte</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fonteStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fonteStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Prioridades */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Distribuição de Prioridades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prioridadeStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Emoções */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Emoções Faciais Predominantes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Top Opiniões */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ranking de Opiniões</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opinião
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocorrências
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentagem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adjectiveStats.map(({ adjective, count, percentage }, index) => (
                  <tr key={adjective} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {adjective}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

