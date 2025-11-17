export interface Video {
  video_id: string;
  fonte: 'TikTok' | 'YouTube';
  views_mock: number;
  likes_mock: number;
  transcricao_voz: string;
  emocao_facial_predominante: string;
  sentimento_geral_ia: string;
  topico_analisado: string;
  sugestao_acao: string;
  prioridade_acao: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  justificativa_acao: string;
  status_acao?: 'Pendente' | 'Ação Enviada';
}

