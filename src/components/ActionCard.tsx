import { Video } from '../types/video';

interface ActionCardProps {
  sugestao_acao: string;
  prioridade_acao: Video['prioridade_acao'];
  status_acao?: Video['status_acao'];
}

export function ActionCard({ sugestao_acao, prioridade_acao, status_acao }: ActionCardProps) {
  const getPriorityColor = (prioridade: Video['prioridade_acao']) => {
    switch (prioridade) {
      case 'Crítica':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'Alta':
        return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Média':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'Baixa':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getActionIcon = (acao: string) => {
    if (acao.includes('Jira') || acao.includes('Produto')) {
      return '🔧';
    }
    if (acao.includes('Zendesk') || acao.includes('CX')) {
      return '💬';
    }
    if (acao.includes('Marketing') || acao.includes('Slack')) {
      return '📢';
    }
    return '📋';
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getPriorityColor(prioridade_acao)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getActionIcon(sugestao_acao)}</span>
            <p className="text-sm font-medium opacity-75">Ação Sugerida</p>
          </div>
          <p className="text-xl font-bold mb-3">{sugestao_acao}</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/50 text-sm font-semibold">
              Prioridade: {prioridade_acao}
            </span>
            {status_acao === 'Ação Enviada' && (
              <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
                ✓ Enviado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

