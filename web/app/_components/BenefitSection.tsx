import CanvaSection from './ui/CanvaSection';
import CanvaCard from './ui/CanvaCard';

const benefits = [
  {
    icon: '👤',
    title: '個人単位の実績と口コミが見える',
    description:
      'コンサルタント個人の相談実績、転職支援実績、実際の利用者のレビューを公開しています。',
  },
  {
    icon: '⭐',
    title: '相談レビューと転職レビューを分けて評価',
    description:
      '相談の質と転職成功の実績を別々に評価できるため、より正確な判断が可能です。',
  },
  {
    icon: '🎯',
    title: '専門性（職種・業界・企業規模）で選べる',
    description:
      '得意な職種、業界、企業規模が明確に表示されるため、自分に合うコンサルタントを見つけやすいです。',
  },
  {
    icon: '📱',
    title: 'SNSの発信もチェックできる',
    description:
      'コンサルタントのSNSでの発信内容やフォロワー数も参考に、人柄や専門性を確認できます。',
  },
  {
    icon: '🏆',
    title: '有能なコンサルほど実績を"持ち運べる"',
    description:
      '個人の実績が可視化されることで、信頼性の高いプラットフォームとして機能します。',
  },
];

export default function BenefitSection() {
  return (
    <CanvaSection variant="accent">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
        個人指名という新しい常識
      </h2>
      <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
        CareerSelect なら、担当者を"選べます"。
        <br />
        会社ではなく"人"で選ぶ転職相談へ。実績・口コミ・専門性・SNSでの人柄発信から、自分に合う相談相手を見つけられます。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <CanvaCard key={index} className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-4xl mb-6 mx-auto shadow-sm">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {benefit.title}
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </CanvaCard>
        ))}
      </div>
    </CanvaSection>
  );
}

