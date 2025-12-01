export interface TranscriptionResult {
  transcription?: string;
  error?: string;
}

// Implementação simulada no front-end.
// Sem backend, geramos uma transcrição fictícia (ou reaproveitamos o texto atual)
// para preencher o card e o modal.
export async function requestTranscription(
  videoUrl: string,
  fallback?: string
): Promise<TranscriptionResult> {
  if (!videoUrl) {
    return { error: 'Nenhum link de vídeo informado.' };
  }

  const baseText =
    fallback ||
    `Transcrição simulada a partir do link: ${videoUrl.slice(0, 60)}${videoUrl.length > 60 ? '...' : ''}`;

  // Simula uma resposta assíncrona
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { transcription: baseText };
}
