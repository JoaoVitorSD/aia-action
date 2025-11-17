import { Video } from '../types/video';

export function determinarAcao(video: Video): { acao: string; prioridade: Video['prioridade_acao'] } {
  const emocao = video.emocao_facial_predominante.toLowerCase();
  const topico = video.topico_analisado.toLowerCase();
  const sentimento = video.sentimento_geral_ia.toLowerCase();

  if (emocao.includes('raiva') && topico.includes('usabilidade')) {
    return {
      acao: 'Criar Ticket: Produto (Jira)',
      prioridade: 'Crítica',
    };
  }

  if (emocao.includes('tristeza') && sentimento.includes('negativo')) {
    return {
      acao: 'Enviar Lead: CX (Zendesk)',
      prioridade: 'Alta',
    };
  }

  if (emocao.includes('alegria') && topico.includes('feature')) {
    return {
      acao: 'Alerta: Marketing (Slack)',
      prioridade: 'Média',
    };
  }

  return {
    acao: 'Analisar Manualmente',
    prioridade: 'Baixa',
  };
}

