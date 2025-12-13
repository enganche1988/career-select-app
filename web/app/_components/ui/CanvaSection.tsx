import { ReactNode } from 'react';
import CanvaBackground from './CanvaBackground';

type CanvaSectionProps = {
  children: ReactNode;
  variant?: 'default' | 'light' | 'accent';
  className?: string;
  background?: boolean;
};

/**
 * Canva風のセクションコンポーネント
 * 背景レイヤー + コンテンツを統合
 */
export default function CanvaSection({
  children,
  variant = 'default',
  className = '',
  background = true,
}: CanvaSectionProps) {
  return (
    <section className={`w-full relative py-20 md:py-24 overflow-hidden ${className}`}>
      {background && <CanvaBackground variant={variant} />}
      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {children}
      </div>
    </section>
  );
}

