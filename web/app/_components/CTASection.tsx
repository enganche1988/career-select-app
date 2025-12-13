import CanvaSection from './ui/CanvaSection';
import CanvaButton from './ui/CanvaButton';

export default function CTASection() {
  return (
    <CanvaSection variant="accent" className="py-16">
      <div className="text-center">
        <CanvaButton href="/consultants" variant="primary" size="lg">
          コンサルタント一覧を見る
        </CanvaButton>
      </div>
    </CanvaSection>
  );
}


