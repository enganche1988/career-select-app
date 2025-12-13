type Props = {
  twitterUrl: string;
};

export default function XProfileCard({ twitterUrl }: Props) {
  // URLからハンドルを抽出
  const handle = twitterUrl
    .replace(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//, '')
    .replace(/\/$/, '');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">X（旧Twitter）での発信</h2>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        日々の考え方やキャリア観は、こちらのXアカウントでご確認いただけます。相談前に「どんな人か」の雰囲気を知りたい方は、ぜひチェックしてみてください。
      </p>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Xアカウントを見る
      </a>
    </div>
  );
}

