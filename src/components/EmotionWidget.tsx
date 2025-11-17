import { Video } from '../types/video';

interface EmotionWidgetProps {
  emocao: string;
}

export function EmotionWidget({ emocao }: EmotionWidgetProps) {
  const match = emocao.match(/(.+?)\s*\((\d+)%\)/);
  const nomeEmocao = match ? match[1].trim() : emocao;
  const porcentagem = match ? parseInt(match[2]) : 0;

  const getEmotionColor = (nome: string) => {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes('raiva') || nomeLower.includes('frustração')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (nomeLower.includes('tristeza')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (nomeLower.includes('alegria') || nomeLower.includes('animado')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (nomeLower.includes('confusão')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getEmotionColor(nomeEmocao)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">Emoção Facial Predominante</p>
          <p className="text-xl font-bold mt-1">{nomeEmocao}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{porcentagem}%</p>
          <p className="text-xs opacity-75">confiança</p>
        </div>
      </div>
      <div className="mt-3 w-full bg-white/50 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getEmotionColor(nomeEmocao).split(' ')[0]}`}
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  );
}

