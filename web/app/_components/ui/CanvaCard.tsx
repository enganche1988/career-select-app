import { ReactNode } from 'react';

type CanvaCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

/**
 * Canva風のカードコンポーネント
 * 角丸は大きめ（rounded-2xl〜3xl）、影は柔らかく
 */
export default function CanvaCard({ children, className = '', hover = true }: CanvaCardProps) {
  return (
    <div
      className={`
        bg-white rounded-3xl shadow-sm border border-gray-100/80
        ${hover ? 'hover:shadow-md hover:border-gray-200/60 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

