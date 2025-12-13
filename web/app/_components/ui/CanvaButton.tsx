import Link from 'next/link';
import { ReactNode } from 'react';

type CanvaButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/**
 * Canva風のボタンコンポーネント
 * Primaryのみ目立たせる。グラデは使ってもよいが上品に。
 */
export default function CanvaButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: CanvaButtonProps) {
  const baseClasses = 'inline-block font-bold text-center transition-all duration-300 rounded-2xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md',
  };
  
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-5 text-xl',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

