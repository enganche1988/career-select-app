const problems = [
  {
    icon: '🎲',
    title: '担当者ガチャに左右される',
    description:
      '大手では担当者を選べず、誰に当たるかは運次第。実績や口コミも見えないため、質の高い相談に繋がるとは限りません。',
  },
  {
    icon: '💰',
    title: '相談だけでは評価されず、"早く転職させよう"とされる',
    description:
      'エージェント側は転職させないと売上ゼロ。求職者に寄り添うより「決めさせる」インセンティブが働きます。',
  },
  {
    icon: '🔍',
    title: '専門性が分からない',
    description:
      '得意な職種・業界・支援領域が見えないため、自分に合う担当者を選べません。',
  },
  {
    icon: '💬',
    title: '実体験の口コミがない',
    description:
      '相談の質や転職成功の再現性を判断できないまま担当が決まります。',
  },
];

export default function ProblemSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
          転職エージェントに、こんな不安はありませんか？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {problem.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

