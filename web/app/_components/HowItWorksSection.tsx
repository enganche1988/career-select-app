import CanvaSection from './ui/CanvaSection';
import CanvaCard from './ui/CanvaCard';

const steps = [
  {
    number: '1',
    title: 'コンサルタントを探す',
    description: '実績・口コミ・SNSから、自分に合う相談相手を選びます。',
    icon: '🔍',
  },
  {
    number: '2',
    title: '相談を予約する',
    description: 'TimeRex またはアプリ内フォームから希望日を選べます。',
    icon: '📅',
  },
  {
    number: '3',
    title: '相談後にレビューを書く',
    description: '相談レビューと転職レビューを分けて評価できます。',
    icon: '⭐',
  },
];

export default function HowItWorksSection() {
  return (
    <CanvaSection variant="light">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <CanvaCard key={index} className="p-8 text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-4xl mx-auto shadow-sm">
                {step.icon}
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-lg">
                {step.number}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-base text-gray-700 leading-relaxed">{step.description}</p>
          </CanvaCard>
        ))}
      </div>
    </CanvaSection>
  );
}

