# AIA-Action MVP - Multimodal Social Listening

MVP de um sistema de análise multimodal de vídeos (voz e emoções faciais) que gera insights e sugere ações automatizadas.

## Tecnologias

- React 18 + TypeScript
- Vite
- Tailwind CSS

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estrutura

- `src/types/video.ts` - Tipos TypeScript para vídeos
- `src/data/mockVideos.ts` - Dados mockados (8 vídeos)
- `src/components/` - Componentes React
- `src/utils/actionRules.ts` - Regras de negócio mockadas

## Funcionalidades

- Dashboard com lista de vídeos mockados
- Filtros por fonte (TikTok/YouTube)
- Modal detalhado com análise completa
- Widget de emoção facial
- Card de ação sugerida com prioridade
- Simulação de envio para Jira

