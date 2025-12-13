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
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

