export default function ServiceExplanationSection() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          サービス説明
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">匿名で質問</h3>
            <p className="text-sm text-gray-600">キャリアの悩みを匿名で投稿</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">複数の回答を比較</h3>
            <p className="text-sm text-gray-600">複数の回答を比較</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">納得した人に相談</h3>
            <p className="text-sm text-gray-600">納得した人に相談</p>
          </div>
        </div>
      </div>
    </section>
  );
}

